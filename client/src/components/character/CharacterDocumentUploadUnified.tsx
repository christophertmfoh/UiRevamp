import React, { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Upload, FileText, File, Loader2, CheckCircle2, 
  X, AlertCircle, Download, Eye, FileCheck
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';

interface CharacterDocumentUploadUnifiedProps {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  theme: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    border: string;
  };
}

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'analyzing' | 'complete' | 'error';
  errorMessage?: string;
}

const SUPPORTED_FORMATS = [
  { ext: '.txt', type: 'text/plain', icon: FileText, label: 'Text Files' },
  { ext: '.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: File, label: 'Word Documents' },
  { ext: '.pdf', type: 'application/pdf', icon: File, label: 'PDF Files' },
  { ext: '.md', type: 'text/markdown', icon: FileText, label: 'Markdown Files' }
];

const PROCESSING_STEPS = [
  'Extracting text content',
  'Analyzing character information',
  'Identifying key traits and details',
  'Generating complete character profile',
  'Creating character portrait'
];

export function CharacterDocumentUploadUnified({
  projectId,
  onBack,
  onComplete,
  theme
}: CharacterDocumentUploadUnifiedProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const generateMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch(`/api/projects/${projectId}/characters/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (character) => {
      setFiles(prev => 
        prev.map(f => f.file.name === character.sourceFile 
          ? { ...f, status: 'complete' }
          : f
        )
      );
      setTimeout(() => onComplete(character as Character), 1000);
    },
    onError: (error) => {
      setFiles(prev => 
        prev.map(f => ({ 
          ...f, 
          status: 'error', 
          errorMessage: error.message 
        }))
      );
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isValidFileType = (file: File) => {
    return SUPPORTED_FORMATS.some(format => 
      file.type === format.type || file.name.toLowerCase().endsWith(format.ext)
    );
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const validFiles = Array.from(fileList).filter(isValidFileType);
    
    if (validFiles.length === 0) {
      alert('Please upload a supported file type (TXT, DOCX, PDF, MD)');
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      uploadProgress: 0,
      status: 'uploading'
    }));

    setFiles(newFiles);
    
    // Simulate upload progress for the first file
    if (newFiles.length > 0) {
      simulateUpload(newFiles[0]);
    }
  };

  const simulateUpload = (uploadedFile: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => 
          prev.map(f => f.name === uploadedFile.name 
            ? { ...f, uploadProgress: 100, status: 'analyzing' }
            : f
          )
        );
        
        // Start processing simulation
        setTimeout(() => {
          startProcessing(uploadedFile);
        }, 500);
      } else {
        setFiles(prev => 
          prev.map(f => f.name === uploadedFile.name 
            ? { ...f, uploadProgress: progress }
            : f
          )
        );
      }
    }, 200);
  };

  const startProcessing = (uploadedFile: UploadedFile) => {
    let step = 0;
    const interval = setInterval(() => {
      setCurrentStep(step);
      step++;
      if (step >= PROCESSING_STEPS.length) {
        clearInterval(interval);
        generateMutation.mutate(uploadedFile.file);
      }
    }, 1500);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    setCurrentStep(0);
  };

  const isProcessing = files.some(f => f.status === 'analyzing') || generateMutation.isPending;

  if (isProcessing) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full border-4 animate-spin"
              style={{ 
                borderColor: theme.border,
                borderTopColor: theme.primary
              }}
            />
            <Upload 
              className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ color: theme.primary }}
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">Processing Document</h3>
            <p className="text-gray-600">
              Analyzing your document and extracting character information...
            </p>
          </div>

          <div className="space-y-4">
            <Progress value={(currentStep / PROCESSING_STEPS.length) * 100} className="h-2" />
            <div className="space-y-2">
              {PROCESSING_STEPS.map((step, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" style={{ color: theme.primary }} />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                  )}
                  <span className={cn(
                    index < currentStep ? 'text-gray-900' : 
                    index === currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
                  )}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Document</h2>
          <p className="text-gray-600">Upload a document containing character information</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Upload Area */}
          {files.length === 0 && (
            <Card
              className={cn(
                "relative border-2 border-dashed transition-all cursor-pointer group",
                dragActive ? "border-orange-400 bg-orange-50" : "border-gray-300 hover:border-gray-400"
              )}
              style={{
                ...(dragActive && {
                  borderColor: theme.primary,
                  backgroundColor: theme.background
                })
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div 
                    className={cn(
                      "mx-auto w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center transition-all",
                      dragActive ? "border-orange-400 bg-orange-100" : "border-gray-300 group-hover:border-gray-400"
                    )}
                    style={{
                      ...(dragActive && {
                        borderColor: theme.primary,
                        backgroundColor: theme.background
                      })
                    }}
                  >
                    <Upload 
                      className={cn(
                        "h-8 w-8 transition-colors",
                        dragActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"
                      )}
                      style={{
                        ...(dragActive && { color: theme.primary })
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {dragActive ? 'Drop your file here' : 'Upload a document'}
                    </h3>
                    <p className="text-gray-600">
                      Drag and drop a file or click to browse
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="gap-2"
                    style={{
                      borderColor: theme.primary,
                      color: theme.primary
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>
              </CardContent>
              
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept=".txt,.docx,.pdf,.md"
                onChange={handleFileInput}
              />
            </Card>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              {files.map((file) => (
                <Card key={file.name} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: theme.background }}
                      >
                        <FileText 
                          className="h-6 w-6"
                          style={{ color: theme.primary }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{file.size}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.name)}
                              className="p-1 h-auto text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {file.status === 'uploading' && (
                          <div className="space-y-2">
                            <Progress value={file.uploadProgress} className="h-2" />
                            <p className="text-sm text-gray-500">Uploading... {Math.round(file.uploadProgress)}%</p>
                          </div>
                        )}
                        
                        {file.status === 'complete' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Processing complete</span>
                          </div>
                        )}
                        
                        {file.status === 'error' && (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{file.errorMessage || 'Upload failed'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Supported Formats */}
          <Card className="border border-gray-200">
            <CardHeader>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-gray-600" />
                Supported Formats
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SUPPORTED_FORMATS.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div key={format.ext} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{format.ext.toUpperCase()}</div>
                        <div className="text-xs text-gray-500">{format.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
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