import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  Edit3,
  Users,
  RefreshCw
} from 'lucide-react';

/**
 * Phase 5 Component 2: Advanced Writing Metrics Dashboard
 * Comprehensive analytics for creative writing sessions
 */

interface WritingSessionData {
  id: string;
  date: string;
  duration: number; // minutes
  wordCount: number;
  averageWPM: number;
  characterCount: number;
  projectId: string;
  projectTitle: string;
  documentTitle?: string;
}

interface CreativeMetrics {
  totalWords: number;
  totalSessions: number;
  totalTime: number; // minutes
  averageWPM: number;
  bestWPM: number;
  streakDays: number;
  projectsActive: number;
  charactersCreated: number;
  sessionsToday: number;
  wordsToday: number;
}

interface WritingMetricsProps {
  sessionId?: string;
  showRealTime?: boolean;
  projectId?: string;
  className?: string;
}

export const WritingMetrics: React.FC<WritingMetricsProps> = ({
  sessionId,
  showRealTime = true,
  projectId,
  className
}) => {
  const [metrics, setMetrics] = useState<CreativeMetrics>({
    totalWords: 0,
    totalSessions: 0,
    totalTime: 0,
    averageWPM: 0,
    bestWPM: 0,
    streakDays: 0,
    projectsActive: 0,
    charactersCreated: 0,
    sessionsToday: 0,
    wordsToday: 0
  });

  const [recentSessions, setRecentSessions] = useState<WritingSessionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    const generateMockData = () => {
      const mockSessions: WritingSessionData[] = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          duration: 45,
          wordCount: 850,
          averageWPM: 19,
          characterCount: 4250,
          projectId: 'proj-1',
          projectTitle: 'The Midnight Chronicles',
          documentTitle: 'Chapter 3: The Discovery'
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          duration: 30,
          wordCount: 620,
          averageWPM: 21,
          characterCount: 3100,
          projectId: 'proj-1',
          projectTitle: 'The Midnight Chronicles',
          documentTitle: 'Chapter 2: Revelations'
        },
        {
          id: '3',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          duration: 60,
          wordCount: 1200,
          averageWPM: 20,
          characterCount: 6000,
          projectId: 'proj-2',
          projectTitle: 'Character Study: Maya',
          documentTitle: 'Background & Motivation'
        }
      ];

      setRecentSessions(mockSessions);

      const mockMetrics: CreativeMetrics = {
        totalWords: mockSessions.reduce((sum, session) => sum + session.wordCount, 0),
        totalSessions: mockSessions.length,
        totalTime: mockSessions.reduce((sum, session) => sum + session.duration, 0),
        averageWPM: Math.round(mockSessions.reduce((sum, session) => sum + session.averageWPM, 0) / mockSessions.length),
        bestWPM: Math.max(...mockSessions.map(session => session.averageWPM)),
        streakDays: 3,
        projectsActive: new Set(mockSessions.map(session => session.projectId)).size,
        charactersCreated: 12,
        sessionsToday: mockSessions.filter(session => session.date === new Date().toISOString().split('T')[0]).length,
        wordsToday: mockSessions
          .filter(session => session.date === new Date().toISOString().split('T')[0])
          .reduce((sum, session) => sum + session.wordCount, 0)
      };

      setMetrics(mockMetrics);
      setLastUpdate(new Date());
    };

    generateMockData();
  }, []);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const refreshMetrics = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getProductivityLevel = (wpm: number): { level: string; color: string } => {
    if (wpm >= 25) return { level: 'Excellent', color: 'bg-green-500' };
    if (wpm >= 20) return { level: 'Good', color: 'bg-blue-500' };
    if (wpm >= 15) return { level: 'Average', color: 'bg-yellow-500' };
    return { level: 'Getting Started', color: 'bg-gray-500' };
  };

  const productivity = getProductivityLevel(metrics.averageWPM);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Writing Analytics
          </h2>
          <p className="text-muted-foreground">
            Track your creative writing progress and productivity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMetrics}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Words</p>
                <p className="text-2xl font-bold">{metrics.totalWords.toLocaleString()}</p>
              </div>
              <Edit3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average WPM</p>
                <p className="text-2xl font-bold">{metrics.averageWPM}</p>
                <Badge className={`text-xs ${productivity.color} text-white`}>
                  {productivity.level}
                </Badge>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Writing Streak</p>
                <p className="text-2xl font-bold">{metrics.streakDays}</p>
                <p className="text-xs text-muted-foreground">days in a row</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{metrics.projectsActive}</p>
                <p className="text-xs text-muted-foreground">{metrics.charactersCreated} characters</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Today's Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sessions</span>
                    <span className="font-medium">{metrics.sessionsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Words written</span>
                    <span className="font-medium">{metrics.wordsToday.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time writing</span>
                    <span className="font-medium">
                      {formatTime(recentSessions
                        .filter(session => session.date === new Date().toISOString().split('T')[0])
                        .reduce((sum, session) => sum + session.duration, 0)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Time Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  All Time Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total sessions</span>
                    <span className="font-medium">{metrics.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best WPM</span>
                    <span className="font-medium">{metrics.bestWPM}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total time</span>
                    <span className="font-medium">{formatTime(metrics.totalTime)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Writing Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{session.projectTitle}</p>
                      {session.documentTitle && (
                        <p className="text-sm text-muted-foreground">{session.documentTitle}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{session.wordCount.toLocaleString()} words</p>
                      <p className="text-sm text-muted-foreground">
                        {session.averageWPM} WPM • {formatTime(session.duration)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Writing Velocity Trend</p>
                  <div className="flex items-end gap-2 h-20">
                    {recentSessions.map((session, index) => (
                      <div
                        key={session.id}
                        className="bg-blue-500 rounded-t flex-1 min-w-[20px]"
                        style={{ 
                          height: `${(session.averageWPM / metrics.bestWPM) * 100}%`
                        }}
                        title={`${session.averageWPM} WPM on ${new Date(session.date).toLocaleDateString()}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Oldest</span>
                    <span>Most Recent</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Performance Insights</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Your average writing speed is {metrics.averageWPM} words per minute</li>
                    <li>• You've maintained a {metrics.streakDays}-day writing streak</li>
                    <li>• Most productive session: {metrics.bestWPM} WPM</li>
                    <li>• Total creative output: {metrics.totalWords.toLocaleString()} words across {metrics.projectsActive} projects</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};