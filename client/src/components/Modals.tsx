import React, { useState } from 'react';
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
import { X, Upload, BookOpen, FileText, AlertTriangle, Feather, Sparkles } from 'lucide-react';
import type { Project } from '../lib/types';

// Project Creation/Edit Modal
interface ProjectModalProps {
  projectToEdit?: Project | null;
  isRenameOnly?: boolean;
  onClose: () => void;
  onCreate?: (projectDetails: { name: string; type: 'novel' | 'screenplay' | 'comic'; genres: string[]; outlineTemplate: 'blank' | 'classic-15-beat' | 'three-act' }) => void;
  onUpdate?: (project: Project) => void;
  onSwitchToManuscriptImport?: () => void;
}

export function ProjectModal({ 
  projectToEdit, 
  isRenameOnly = false, 
  onClose, 
  onCreate, 
  onUpdate, 
  onSwitchToManuscriptImport 
}: ProjectModalProps) {
  const [name, setName] = useState(projectToEdit?.name || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [type, setType] = useState<'novel' | 'screenplay' | 'comic'>(projectToEdit?.type || 'novel');
  const [genres, setGenres] = useState<string[]>(projectToEdit?.genre || []);
  const [outlineTemplate, setOutlineTemplate] = useState<'blank' | 'classic-15-beat' | 'three-act'>('blank');
  const [newGenre, setNewGenre] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (projectToEdit && onUpdate) {
      onUpdate({
        ...projectToEdit,
        name: name.trim(),
        description: description.trim(),
        type,
        genre: genres,
        lastModified: new Date()
      });
    } else if (onCreate) {
      onCreate({
        name: name.trim(),
        type,
        genres,
        outlineTemplate
      });
    }
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
              <Button type="submit" disabled={!name.trim()} className="candlelight-glow">
                {projectToEdit ? 'Update Project' : 'Create Project'}
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
      console.error('Error processing file:', error);
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