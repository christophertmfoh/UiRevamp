import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Upload, FileText, FileCheck, AlertCircle, CheckCircle, 
  X, Loader2, File, FileImage, FileCode, FileMinus
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import type { Character } from '@/lib/types';

interface CharacterDocumentUploadUnifiedProps {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  content?: string;
  error?: string;
}

const SUPPORTED_FORMATS = [
  {
    ext: 'txt',
    label: 'Text Files',
    icon: FileText,
    mimeTypes: ['text/plain']
  },
  {
    ext: 'docx',
    label: 'Word Documents',
    icon: FileText,
    mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  {
    ext: 'pdf',
    label: 'PDF Documents',
    icon: FileText,
    mimeTypes: ['application/pdf']
  },
  {
    ext: 'md',
    label: 'Markdown',
    icon: FileCode,
    mimeTypes: ['text/markdown']
  }
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function CharacterDocumentUploadUnified({
  projectId,
  onBack,
  onComplete
}: CharacterDocumentUploadUnifiedProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateMutation = useMutation({
    mutationFn: async (fileContent: string) => {
      return await CharacterCreationService.generateFromDocument(projectId, fileContent);
    },
    onSuccess: (character) => {
      onComplete(character as Character);
    }
  });

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        return false;
      }
      return SUPPORTED_FORMATS.some(format => 
        format.mimeTypes.includes(file.type) || file.name.endsWith(`.${format.ext}`)
      );
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file processing
    validFiles.forEach((file, index) => {
      simulateFileProcessing(file, index);
    });
  };

  const simulateFileProcessing = async (file: File, index: number) => {
    const fileIndex = files.length + index;
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, progress } : f
      ));
    }

    // Mark as processing
    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { ...f, status: 'processing', progress: 0 } : f
    ));

    // Simulate content extraction
    for (let progress = 0; progress <= 100; progress += 25) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, progress } : f
      ));
    }

    // Complete processing
    const content = `Sample content extracted from ${file.name}`;
    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { ...f, status: 'completed', progress: 100, content } : f
    ));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    const completedFiles = files.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) return;

    setIsProcessing(true);
    const combinedContent = completedFiles.map(f => f.content).join('\n\n');
    generateMutation.mutate(combinedContent);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return FileText;
    if (fileName.endsWith('.docx')) return FileText;
    if (fileName.endsWith('.txt')) return FileText;
    if (fileName.endsWith('.md')) return FileCode;
    return File;
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const canGenerate = completedFiles.length > 0 && !isProcessing;

  if (isProcessing || generateMutation.isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 animate-spin border-border border-t-primary" />
            <FileText className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Processing Your Documents</h3>
            <p className="text-muted-foreground">
              AI is extracting character information and creating your profile...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            This may take 30-60 seconds depending on document size
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Upload Character Documents</h2>
          <p className="text-muted-foreground">Upload documents containing character information to automatically extract and organize details</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Upload Area */}
          {files.length === 0 && (
            <Card
              className={cn(
                "relative border-2 border-dashed transition-all cursor-pointer group",
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className={cn(
                    "mx-auto w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center transition-all",
                    dragActive ? "border-primary bg-primary/10" : "border-border group-hover:border-primary group-hover:bg-primary/10"
                  )}>
                    <Upload className={cn(
                      "h-8 w-8 transition-colors",
                      dragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {dragActive ? 'Drop your files here' : 'Drop files to upload'}
                    </h3>
                    <p className="text-muted-foreground">
                      Or click to browse and select files from your computer
                    </p>
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.docx,.pdf,.md"
                onChange={handleFileInput}
                className="hidden"
              />
            </Card>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Uploaded Files</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Add More Files
                </Button>
              </div>

              {files.map((file, index) => {
                const FileIcon = getFileIcon(file.name);
                return (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FileIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>{formatFileSize(file.size)}</span>
                            <div className="flex items-center gap-1">
                              {file.status === 'uploading' && (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              )}
                              {file.status === 'processing' && (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span>Extracting content...</span>
                                </>
                              )}
                              {file.status === 'completed' && (
                                <>
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span className="text-green-600">Ready</span>
                                </>
                              )}
                              {file.status === 'error' && (
                                <>
                                  <AlertCircle className="h-3 w-3 text-destructive" />
                                  <span className="text-destructive">Error</span>
                                </>
                              )}
                            </div>
                          </div>
                          {(file.status === 'uploading' || file.status === 'processing') && (
                            <Progress value={file.progress} className="h-2" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {canGenerate && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleGenerate}
                    size="lg"
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <FileCheck className="h-5 w-5" />
                    Generate Character from Documents
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.docx,.pdf,.md"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}

          {/* Supported Formats */}
          <Card className="border border-border">
            <CardHeader>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-muted-foreground" />
                Supported Formats
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SUPPORTED_FORMATS.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div key={format.ext} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm text-foreground">{format.ext.toUpperCase()}</div>
                        <div className="text-xs text-muted-foreground">{format.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary/80">
                  <strong>Tip:</strong> For best results, include character descriptions, dialogue, and backstory
                  in your document. The AI will extract and organize this information into a complete character profile.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}