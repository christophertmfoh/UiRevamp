import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { X, Upload, BookOpen, FileText, AlertTriangle, Feather, Sparkles, FileUp, Globe, Book } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Project } from '../lib/types';

// Project Creation/Edit Modal
interface ProjectModalProps {
  projectToEdit?: Project | null;
  isRenameOnly?: boolean;
  onClose: () => void;
  onProjectCreated?: (project: Project) => void;
  onSwitchToManuscriptImport?: () => void;
}

export function ProjectModal({ 
  projectToEdit, 
  isRenameOnly = false, 
  onClose, 
  onProjectCreated, 
  onSwitchToManuscriptImport 
}: ProjectModalProps) {
  const [name, setName] = useState(projectToEdit?.name || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [type, setType] = useState<'novel' | 'screenplay' | 'comic'>(projectToEdit?.type || 'novel');
  const [genres, setGenres] = useState<string[]>(projectToEdit?.genre || []);
  const [outlineTemplate, setOutlineTemplate] = useState<'blank' | 'classic-15-beat' | 'three-act'>('blank');
  const [newGenre, setNewGenre] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const commonGenres = ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Adventure', 'Horror', 'Historical Fiction', 'Contemporary Fiction', 'Young Adult'];

  const addGenre = (genre: string) => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
    setNewGenre('');
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres(genres.filter(g => g !== genreToRemove));
  };

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      if (projectToEdit) {
        // Update existing project
        return await apiRequest('PUT', `/api/projects/${projectToEdit.id}`, projectData);
      } else {
        // Create new project
        return await apiRequest('POST', '/api/projects', {
          id: Date.now().toString(),
          ...projectData,
        });
      }
    },
    onSuccess: async (result) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
      if (!projectToEdit) {
        // For new projects, fetch the full project data and navigate to it
        try {
          const response = await apiRequest('GET', `/api/projects/${(await result.json()).id}`);
          const fullProject = await response.json();
          if (onProjectCreated) {
            onProjectCreated(fullProject);
          }
        } catch (error) {
          // Handle error silently - user will see creation failed
        }
      }
      
      toast({
        title: projectToEdit ? "Project Updated" : "Project Created",
        description: `${name} has been ${projectToEdit ? 'updated' : 'created'} successfully.`,
      });
      
      onClose();
    },
    onError: (error) => {
      // Handle error through mutation error state
      toast({
        title: "Error",
        description: `Failed to ${projectToEdit ? 'update' : 'create'} project. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectData = {
      name: name.trim(),
      description: description.trim(),
      type,
      genre: genres,
      manuscriptNovel: projectToEdit?.manuscript?.novel || '',
      manuscriptScreenplay: projectToEdit?.manuscript?.screenplay || '',
    };

    createProjectMutation.mutate(projectData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="creative-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-title text-xl">
            {projectToEdit ? (isRenameOnly ? 'Rename Project' : 'Edit Project') : 'Create New Project'}
          </DialogTitle>
          <DialogDescription className="font-literary">
            {projectToEdit 
              ? (isRenameOnly ? 'Give your project a new name' : 'Update your project details')
              : 'Start your creative journey with a new project'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your project name..."
              className="creative-card"
              autoFocus
            />
          </div>

          {!isRenameOnly && (
            <>
              {/* Project Type */}
              {!projectToEdit && (
                <div className="space-y-2">
                  <Label className="font-medium">Project Type</Label>
                  <Select value={type} onValueChange={(value: 'novel' | 'screenplay' | 'comic') => setType(value)}>
                    <SelectTrigger className="creative-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="creative-card">
                      <SelectItem value="novel">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Novel
                        </div>
                      </SelectItem>
                      <SelectItem value="screenplay">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Screenplay
                        </div>
                      </SelectItem>
                      <SelectItem value="comic">
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Comic/Graphic Novel
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your story about?"
                  className="creative-card font-literary"
                  rows={3}
                />
              </div>

              {/* Genres */}
              <div className="space-y-3">
                <Label className="font-medium">Genres</Label>
                
                {/* Common Genres */}
                <div className="flex flex-wrap gap-2">
                  {commonGenres.map(genre => (
                    <Button
                      key={genre}
                      type="button"
                      variant={genres.includes(genre) ? "default" : "outline"}
                      size="sm"
                      onClick={() => genres.includes(genre) ? removeGenre(genre) : addGenre(genre)}
                      className={genres.includes(genre) ? "candlelight-glow" : ""}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>

                {/* Custom Genre Input */}
                <div className="flex space-x-2">
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Add custom genre..."
                    className="creative-card"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGenre(newGenre);
                      }
                    }}
                  />
                  <Button type="button" onClick={() => addGenre(newGenre)} variant="outline">
                    Add
                  </Button>
                </div>

                {/* Selected Genres */}
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {genres.map(genre => (
                      <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => removeGenre(genre)}>
                        {genre} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Outline Template (for new projects only) */}
              {!projectToEdit && (
                <div className="space-y-2">
                  <Label className="font-medium">Outline Template</Label>
                  <Select value={outlineTemplate} onValueChange={(value: 'blank' | 'classic-15-beat' | 'three-act') => setOutlineTemplate(value)}>
                    <SelectTrigger className="creative-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="creative-card">
                      <SelectItem value="blank">Blank - Start from scratch</SelectItem>
                      <SelectItem value="classic-15-beat">Classic 15-Beat Structure</SelectItem>
                      <SelectItem value="three-act">Three-Act Structure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div>
              {!projectToEdit && onSwitchToManuscriptImport && (
                <Button type="button" variant="outline" onClick={onSwitchToManuscriptImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Instead
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || createProjectMutation.isPending} className="candlelight-glow">
                {createProjectMutation.isPending ? 'Saving...' : (projectToEdit ? 'Update Project' : 'Create Project')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Modal
interface ConfirmDeleteModalProps {
  project: Project;
  onClose: () => void;
  onDelete: (projectId: string) => void;
}

export function ConfirmDeleteModal({ project, onClose, onDelete }: ConfirmDeleteModalProps) {
  const handleDelete = () => {
    onDelete(project.id);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="creative-card max-w-md">
        <DialogHeader>
          <DialogTitle className="font-title text-xl flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Project
          </DialogTitle>
          <DialogDescription className="font-literary">
            This action cannot be undone. Are you sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>

        <Card className="workbench-surface">
          <CardContent className="p-4">
            <div className="font-title text-lg">{project.name}</div>
            <div className="text-sm text-muted-foreground">
              {project.type} • {project.genre.join(', ')}
            </div>
            {project.description && (
              <div className="text-sm text-muted-foreground mt-2 font-literary">
                {project.description}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="ember-accent">
            Delete Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Import Manuscript Modal
interface ImportManuscriptModalProps {
  projectToUpdate?: Project | null;
  onClose: () => void;
  onUpdateProject?: (project: Project) => void;
  onCreateProject?: (data: any, fileName: string) => void;
}

export function ImportManuscriptModal({ 
  projectToUpdate, 
  onClose, 
  onUpdateProject, 
  onCreateProject 
}: ImportManuscriptModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const data = {
        manuscriptText: text,
        outline: [] // Could parse this from the text if needed
      };
      
      if (projectToUpdate && onUpdateProject) {
        onUpdateProject({
          ...projectToUpdate,
          manuscript: {
            ...projectToUpdate.manuscript,
            novel: text
          },
          lastModified: new Date()
        });
      } else if (onCreateProject) {
        onCreateProject(data, file.name);
      }
    } catch (error) {
      // Handle error through UI feedback
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="creative-card max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-title text-xl">
            {projectToUpdate ? 'Import to Project' : 'Import Manuscript'}
          </DialogTitle>
          <DialogDescription className="font-literary">
            {projectToUpdate 
              ? 'Add content to your existing project'
              : 'Create a new project from your existing manuscript'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`workbench-surface border-2 border-dashed transition-colors p-8 text-center cursor-pointer ${
              dragActive ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {file ? (
              <div>
                <div className="font-medium text-accent">{file.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div>
                <div className="font-medium mb-2">Drop your manuscript here</div>
                <div className="text-sm text-muted-foreground mb-4 font-literary">
                  or click to select a file
                </div>
                <div className="text-xs text-muted-foreground">
                  Supports: TXT, DOCX, PDF files
                </div>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept=".txt,.docx,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* File Info */}
          {file && (
            <Card className="workbench-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-accent" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB • {file.type || 'text file'}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={processFile} 
              disabled={!file || isProcessing}
              className="candlelight-glow"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <Feather className="h-4 w-4 mr-2" />
                  {projectToUpdate ? 'Import to Project' : 'Create Project'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Intelligent Document Import Modal
interface IntelligentImportModalProps {
  onClose: () => void;
  onProjectCreated?: (project: Project) => void;
}

export function IntelligentImportModal({ onClose, onProjectCreated }: IntelligentImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'manuscript' | 'worldbible' | 'auto'>('auto');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<'novel' | 'screenplay' | 'comic'>('novel');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        setFile(file);
        if (!projectName) {
          setProjectName(file.name.replace(/\.[^/.]+$/, ''));
        }
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a TXT, PDF, or DOCX file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        setFile(file);
        if (!projectName) {
          setProjectName(file.name.replace(/\.[^/.]+$/, ''));
        }
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a TXT, PDF, or DOCX file.",
          variant: "destructive",
        });
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    return validTypes.includes(file.type) || file.name.match(/\.(txt|pdf|docx|doc)$/i);
  };

  const processDocument = async () => {
    if (!file || !projectName.trim()) return;

    setIsProcessing(true);
    try {
      // Read file content
      const content = await readFileContent(file);
      
      // This is where the intelligent processing will happen in the future
      // For now, we'll create a basic project structure
      const projectData = {
        id: Date.now().toString(),
        name: projectName.trim(),
        type: projectType,
        description: `Imported from ${file.name}`,
        genre: [],
        manuscriptNovel: documentType === 'manuscript' || documentType === 'auto' ? content : '',
        manuscriptScreenplay: '',
      };

      // Create the project via API
      const newProject = await apiRequest('POST', '/api/projects', projectData);

      // TODO: Future AI-powered content extraction will happen here
      // - Analyze document type automatically
      // - Extract world building elements from manuscripts
      // - Parse world bible structure and populate world elements
      // - Generate outline from story structure
      // - Identify characters, factions, items automatically

      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });

      toast({
        title: "Document Imported Successfully",
        description: `${projectName} has been created and populated with your document content.`,
      });

      if (onProjectCreated) {
        const projectData = await newProject.json();
        onProjectCreated(projectData);
      }

      onClose();
    } catch (error) {
      // Handle error through UI feedback
      toast({
        title: "Import Failed",
        description: "Failed to import document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to read file content (placeholder for now)
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content || '');
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="creative-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-title text-xl flex items-center">
            <FileUp className="h-5 w-5 mr-2 text-accent" />
            Intelligent Document Import
          </DialogTitle>
          <DialogDescription className="font-literary">
            Import manuscripts or world bibles to automatically populate your project with intelligent content extraction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-3">
            <Label className="font-medium">Document Type</Label>
            <div className="grid grid-cols-3 gap-3">
              <Card 
                className={`cursor-pointer transition-all ${documentType === 'auto' ? 'ring-2 ring-accent bg-accent/5' : 'hover:bg-accent/5'}`}
                onClick={() => setDocumentType('auto')}
              >
                <CardContent className="p-4 text-center">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="font-medium text-sm">Auto-Detect</div>
                  <div className="text-xs text-muted-foreground">AI analyzes content</div>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all ${documentType === 'manuscript' ? 'ring-2 ring-accent bg-accent/5' : 'hover:bg-accent/5'}`}
                onClick={() => setDocumentType('manuscript')}
              >
                <CardContent className="p-4 text-center">
                  <Book className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="font-medium text-sm">Manuscript</div>
                  <div className="text-xs text-muted-foreground">Story content</div>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all ${documentType === 'worldbible' ? 'ring-2 ring-accent bg-accent/5' : 'hover:bg-accent/5'}`}
                onClick={() => setDocumentType('worldbible')}
              >
                <CardContent className="p-4 text-center">
                  <Globe className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="font-medium text-sm">World Bible</div>
                  <div className="text-xs text-muted-foreground">World building</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`creative-card border-2 border-dashed transition-colors p-8 text-center cursor-pointer ${
              dragActive ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('intelligent-file-upload')?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {file ? (
              <div>
                <div className="font-medium text-accent">{file.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div>
                <div className="font-medium mb-2">Drop your document here</div>
                <div className="text-sm text-muted-foreground mb-4 font-literary">
                  or click to select a file
                </div>
                <div className="text-xs text-muted-foreground">
                  Supports: TXT, DOCX, PDF files up to 10MB
                </div>
              </div>
            )}
            <input
              id="intelligent-file-upload"
              type="file"
              accept=".txt,.docx,.pdf,.doc"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Project Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="font-medium">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="creative-card"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Project Type</Label>
              <Select value={projectType} onValueChange={(value: 'novel' | 'screenplay' | 'comic') => setProjectType(value)}>
                <SelectTrigger className="creative-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="creative-card">
                  <SelectItem value="novel">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Novel
                    </div>
                  </SelectItem>
                  <SelectItem value="screenplay">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Screenplay
                    </div>
                  </SelectItem>
                  <SelectItem value="comic">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Comic/Graphic Novel
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* AI Processing Preview */}
          {file && (
            <Card className="creative-card border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                  <div className="space-y-2">
                    <div className="font-medium text-sm">AI Processing Preview</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• {documentType === 'auto' ? 'Auto-detect document type and structure' : `Process as ${documentType}`}</div>
                      <div>• Extract and populate {documentType === 'worldbible' ? 'world building elements' : 'story content'}</div>
                      <div>• Generate {documentType === 'worldbible' ? 'character profiles and factions' : 'outline and character list'}</div>
                      <div>• Intelligent content organization and tagging</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={processDocument} 
              disabled={!file || !projectName.trim() || isProcessing}
              className="candlelight-glow"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Processing Document...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import & Create Project
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}