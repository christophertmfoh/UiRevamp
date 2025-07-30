import React, { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Camera, Share, Download, Eye, EyeOff } from 'lucide-react';
import type { 
  EnhancedUniversalEntityConfig, 
  DetailTabConfig 
} from '../config/EntityConfig';
import { formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, AlertTriangle } from 'lucide-react';
import { Trash } from 'lucide-react';

interface UniversalEntityDetailViewProps {
  config: EnhancedUniversalEntityConfig;
  entity: any;
  projectId: string;
  onBack: () => void;
  onEdit: (entity: any) => void;
  onDelete: (entity: any) => void;
}

// Lazy load tab content for performance
const LazyTabContent = lazy(() => Promise.resolve({
  default: memo(({ config, entity, tab }: any) => {
    return (
      <div className="space-y-6">
        {tab.sections?.map((section: any) => (
          <Card key={section.key}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map((fieldKey: string) => {
                  const field = config.fields.find((f: any) => f.key === fieldKey);
                  if (!field) return null;
                  
                  return (
                    <div key={fieldKey} className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {field.label}
                      </label>
                      <div className="text-sm">
                        {renderFieldValue(entity[fieldKey], field)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  })
}));

// Memoized field value renderer
const MemoizedFieldValue = memo(({ value, field }: { value: any; field: any }) => {
  const renderValue = useMemo(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <span className="text-muted-foreground italic">No {field.label.toLowerCase()}</span>;
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 5).map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {String(item)}
            </Badge>
          ))}
          {value.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 5} more
            </Badge>
          )}
        </div>
      );
    }
    
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }
    
    if (typeof value === 'number') {
      return <span className="font-medium">{value.toLocaleString()}</span>;
    }
    
    if (typeof value === 'string' && value.length > 200) {
      return (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronDown className="h-3 w-3" />
            Show full text
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 text-sm">{value}</div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    
    return <span>{String(value)}</span>;
  }, [value, field]);
  
  return renderValue;
});

// Memoized tab header component
const MemoizedTabHeader = memo(({ tab, isActive, onClick }: any) => {
  return (
    <TabsTrigger 
      value={tab.key} 
      className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {tab.icon && <tab.icon className="h-4 w-4" />}
        {tab.label}
      </div>
    </TabsTrigger>
  );
});

export const UniversalEntityDetailView = memo(function UniversalEntityDetailView({
  config,
  entity,
  projectId,
  onEdit,
  onDelete
}: UniversalEntityDetailViewProps) {
  const [activeTab, setActiveTab] = useState(() => {
    const visibleTabs = getVisibleTabs(config.detailTabConfig?.tabs || [], entity);
    return visibleTabs[0]?.key || 'overview';
  });
  
  // Performance: Memoize visible tabs
  const visibleTabs = useMemo(() => 
    getVisibleTabs(config.detailTabConfig?.tabs || [], entity),
    [config.detailTabConfig?.tabs, entity]
  );
  
  // Performance: Memoize completion calculation
  const completionPercentage = useMemo(() => {
    const allFields = config.fields;
    const priorityWeights = {
      'critical': 3,
      'high': 2,
      'medium': 1,
      'low': 0.5,
      'optional': 0.25
    };
    
    let totalWeight = 0;
    let completedWeight = 0;
    
    allFields.forEach(field => {
      const weight = priorityWeights[field.priority as keyof typeof priorityWeights] || 1;
      totalWeight += weight;
      
      const value = entity[field.key];
      if (value !== undefined && value !== null && 
          (typeof value !== 'string' || value.trim() !== '') &&
          (!Array.isArray(value) || value.length > 0)) {
        completedWeight += weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  }, [config.fields, entity]);
  
  // Performance: Memoize field counts
  const fieldStats = useMemo(() => {
    const stats = {
      total: config.fields.length,
      completed: 0,
      critical: 0,
      criticalCompleted: 0
    };
    
    config.fields.forEach(field => {
      const value = entity[field.key];
      const isCompleted = value !== undefined && value !== null && 
                         (typeof value !== 'string' || value.trim() !== '') &&
                         (!Array.isArray(value) || value.length > 0);
      
      if (isCompleted) stats.completed++;
      
      if (field.priority === 'critical') {
        stats.critical++;
        if (isCompleted) stats.criticalCompleted++;
      }
    });
    
    return stats;
  }, [config.fields, entity]);
  
  // Performance: Memoized tab change handler
  const handleTabChange = useCallback((tabKey: string) => {
    setActiveTab(tabKey);
  }, []);
  
  // Performance: Memoized active tab data
  const activeTabData = useMemo(() => 
    visibleTabs.find(tab => tab.key === activeTab),
    [visibleTabs, activeTab]
  );
  
  return (
    <div className="space-y-6">
      {/* Header with performance-optimized info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <config.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">
                    {entity.name || entity.title || `${config.displayName} #${entity.id}`}
                  </CardTitle>
                  {entity.title && entity.name !== entity.title && (
                    <p className="text-muted-foreground mt-1">{entity.title}</p>
                  )}
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{fieldStats.completed}/{fieldStats.total} fields completed</span>
                {fieldStats.critical > 0 && (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {fieldStats.criticalCompleted}/{fieldStats.critical} critical
                  </span>
                )}
                <span>Last updated {formatDistanceToNow(new Date(entity.updatedAt || entity.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Completion indicator */}
              <div className="text-right">
                <div className="text-sm font-medium">{completionPercentage}% Complete</div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(entity)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(entity)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(entity)}
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Tabbed content with lazy loading */}
      <Card>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-auto overflow-x-auto">
              {visibleTabs.map((tab) => (
                <MemoizedTabHeader
                  key={tab.key}
                  tab={tab}
                  isActive={activeTab === tab.key}
                  onClick={() => handleTabChange(tab.key)}
                />
              ))}
            </TabsList>
          </CardHeader>
          
          <CardContent>
            {visibleTabs.map((tab) => (
              <TabsContent key={tab.key} value={tab.key} className="mt-0">
                {activeTab === tab.key && (
                  <Suspense fallback={
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  }>
                    <LazyTabContent 
                      config={config} 
                      entity={entity} 
                      tab={tab}
                    />
                  </Suspense>
                )}
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
});

// Helper function to render field values (moved outside for performance)
function renderFieldValue(value: any, field: any) {
  return <MemoizedFieldValue value={value} field={field} />;
}

// Helper function to get visible tabs (memoized externally)
function getVisibleTabs(tabs: any[], entity: any) {
  return tabs.filter(tab => {
    if (!tab.conditional) return true;
    
    const { field, value, operator = 'equals' } = tab.conditional;
    const entityValue = entity[field];
    
    switch (operator) {
      case 'equals':
        return entityValue === value;
      case 'notEquals':
        return entityValue !== value;
      case 'contains':
        return Array.isArray(entityValue) && entityValue.includes(value);
      case 'exists':
        return entityValue !== undefined && entityValue !== null && entityValue !== '';
      default:
        return true;
    }
  });
}

export default UniversalEntityDetailView;