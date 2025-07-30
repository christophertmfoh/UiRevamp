import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Upload,
  File,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  X,
  FileIcon,
  ImageIcon,
  Download
} from 'lucide-react';
import type { EnhancedUniversalEntityConfig } from '../config/EntityConfig';

interface UniversalDocumentUploadProps {
  config: EnhancedUniversalEntityConfig;
  onComplete: (entity: any) => void;
  projectId: string;
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extractedData?: any;
  errorMessage?: string;
}

export function UniversalDocumentUpload({
  config,
  onComplete,
  projectId
}: UniversalDocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedEntity, setExtractedEntity] = useState<any>(null);
  
  const uploadConfig = config.uploadConfig || {
    enabled: true,
    acceptedFormats: ['.pdf', '.txt', '.docx'],
    maxFileSize: 10, // MB
    extractionRules: []
  };
  
  const isUploadEnabled = uploadConfig.enabled && config.features?.hasDocumentUpload !== false;
  
  // Handle drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);
  
  // Handle file selection
  const handleFileSelection = (files: File[]) => {
    const validFiles = files.filter(file => validateFile(file));
    
    if (validFiles.length === 0) {
      return;
    }
    
    const newUploads: UploadedFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadedFiles(prev => [...prev, ...newUploads]);
    
    // Start upload process for each file
    validFiles.forEach((file, index) => {
      processFile(file, newUploads.length - validFiles.length + index);
    });
  };
  
  // Validate file based on config
  const validateFile = (file: File): boolean => {
    // Check file size
    const maxSizeMB = uploadConfig.maxFileSize || 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File ${file.name} is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    
    // Check file format
    const acceptedFormats = uploadConfig.acceptedFormats || ['.pdf', '.txt', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedFormats.includes(fileExtension)) {
      alert(`File ${file.name} format not supported. Accepted formats: ${acceptedFormats.join(', ')}`);
      return false;
    }
    
    return true;
  };
  
  // Process uploaded file
  const processFile = async (file: File, index: number) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        setUploadedFiles(prev => 
          prev.map((upload, i) => 
            i === index ? { ...upload, progress } : upload
          )
        );
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Update to processing status
      setUploadedFiles(prev => 
        prev.map((upload, i) => 
          i === index ? { ...upload, status: 'processing', progress: 100 } : upload
        )
      );
      
      // Extract data from file
      const extractedData = await extractDataFromFile(file);
      
      // Update with extracted data
      setUploadedFiles(prev => 
        prev.map((upload, i) => 
          i === index ? { 
            ...upload, 
            status: 'completed', 
            extractedData 
          } : upload
        )
      );
      
    } catch (error) {
      console.error('File processing failed:', error);
      setUploadedFiles(prev => 
        prev.map((upload, i) => 
          i === index ? { 
            ...upload, 
            status: 'error', 
            errorMessage: 'Failed to process file'
          } : upload
        )
      );
    }
  };
  
  // Extract data from file based on config rules
  const extractDataFromFile = async (file: File): Promise<any> => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    // Simulate different extraction based on file type
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    switch (fileExtension) {
      case '.pdf':
        return extractFromPDF(file);
      case '.txt':
        return extractFromText(file);
      case '.docx':
        return extractFromDocx(file);
      default:
        return extractGeneric(file);
    }
  };
  
  // PDF extraction simulation
  const extractFromPDF = async (file: File): Promise<any> => {
    // This would use a PDF parsing library
    return {
      name: file.name.replace('.pdf', ''),
      description: `Extracted from PDF document: ${file.name}`,
      source: 'pdf_upload',
      extractedContent: 'This would contain the extracted text content from the PDF file.',
      metadata: {
        originalFileName: file.name,
        fileSize: file.size,
        extractionMethod: 'pdf_parser'
      }
    };
  };
  
  // Text file extraction
  const extractFromText = async (file: File): Promise<any> => {
    const text = await file.text();
    
    // Apply extraction rules from config
    const extractedData: any = {
      name: file.name.replace('.txt', ''),
      description: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
      source: 'text_upload',
      extractedContent: text
    };
    
    // Apply configured extraction rules
    if (uploadConfig.extractionRules) {
      uploadConfig.extractionRules.forEach(rule => {
        if (rule.pattern && rule.field) {
          const regex = new RegExp(rule.pattern, 'i');
          const match = text.match(regex);
          if (match) {
            extractedData[rule.field] = match[1] || match[0];
          }
        }
      });
    }
    
    return extractedData;
  };
  
  // DOCX extraction simulation
  const extractFromDocx = async (file: File): Promise<any> => {
    // This would use a DOCX parsing library
    return {
      name: file.name.replace('.docx', ''),
      description: `Extracted from Word document: ${file.name}`,
      source: 'docx_upload',
      extractedContent: 'This would contain the extracted text content from the Word document.',
      metadata: {
        originalFileName: file.name,
        fileSize: file.size,
        extractionMethod: 'docx_parser'
      }
    };
  };
  
  // Generic extraction fallback
  const extractGeneric = async (file: File): Promise<any> => {
    return {
      name: file.name.split('.')[0],
      description: `Uploaded from file: ${file.name}`,
      source: 'file_upload',
      metadata: {
        originalFileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      }
    };
  };
  
  // Handle creating entity from extracted data
  const handleCreateFromFile = (uploadedFile: UploadedFile) => {
    if (uploadedFile.extractedData) {
      const entityData = {
        projectId,
        ...uploadedFile.extractedData,
        // Ensure required fields are present
        name: uploadedFile.extractedData.name || uploadedFile.file.name.split('.')[0]
      };
      
      setExtractedEntity(entityData);
    }
  };
  
  // Handle using extracted entity
  const handleUseExtracted = () => {
    if (extractedEntity) {
      onComplete(extractedEntity);
    }
  };
  
  // Remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Get file icon based on type
  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'txt':
        return <FileIcon className="h-6 w-6 text-gray-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6 text-muted-foreground" />;
    }
  };
  
  // If upload is not enabled, show disabled state
  if (!isUploadEnabled) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Document Upload Disabled</h3>
          <p className="text-muted-foreground mb-4">
            Document upload is not enabled for {config.displayName.toLowerCase()} creation.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact your administrator to enable document upload for this entity type.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Document
        </h3>
        <p className="text-muted-foreground">
          Upload a document to extract {config.displayName.toLowerCase()} information
        </p>
      </div>
      
      {/* Upload Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <CardContent className="p-12 text-center">
          <Upload className={`h-12 w-12 mx-auto mb-4 ${
            isDragOver ? 'text-primary' : 'text-muted-foreground'
          }`} />
          
          <h3 className="text-lg font-semibold mb-2">
            {isDragOver ? 'Drop files here' : 'Upload Documents'}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Accepted formats:</strong> {uploadConfig.acceptedFormats?.join(', ') || 'PDF, TXT, DOCX'}
            </p>
            <p>
              <strong>Maximum size:</strong> {uploadConfig.maxFileSize || 10}MB
            </p>
          </div>
          
          <input
            id="file-upload"
            type="file"
            multiple
            accept={uploadConfig.acceptedFormats?.join(',') || '.pdf,.txt,.docx'}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileSelection(Array.from(e.target.files));
              }
            }}
          />
        </CardContent>
      </Card>
      
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Uploaded Files</h4>
          
          <div className="space-y-3">
            {uploadedFiles.map((upload, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(upload.file)}
                      <div className="flex-1">
                        <h5 className="font-medium">{upload.file.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {(upload.file.size / 1024 / 1024).toFixed(2)}MB
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {upload.status === 'uploading' && (
                        <div className="flex items-center gap-2">
                          <Progress value={upload.progress} className="w-20" />
                          <span className="text-sm">{upload.progress}%</span>
                        </div>
                      )}
                      
                      {upload.status === 'processing' && (
                        <Badge variant="secondary">Processing...</Badge>
                      )}
                      
                      {upload.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCreateFromFile(upload)}
                          >
                            Use Data
                          </Button>
                        </div>
                      )}
                      
                      {upload.status === 'error' && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive">Error</Badge>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {upload.status === 'error' && upload.errorMessage && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">{upload.errorMessage}</p>
                    </div>
                  )}
                  
                  {upload.status === 'completed' && upload.extractedData && (
                    <div className="mt-3 p-3 bg-accent/20 rounded-md">
                      <h6 className="font-medium text-sm mb-2">Extracted Data Preview:</h6>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div><strong>Name:</strong> {upload.extractedData.name}</div>
                        <div><strong>Description:</strong> {upload.extractedData.description}</div>
                        {upload.extractedData.metadata && (
                          <div><strong>Source:</strong> {upload.extractedData.source}</div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Extracted Entity Preview */}
      {extractedEntity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Extracted {config.displayName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{extractedEntity.name}</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {Object.entries(extractedEntity)
                  .filter(([key]) => !key.startsWith('_') && key !== 'projectId' && key !== 'name' && key !== 'metadata')
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}
                    </div>
                  ))}
                }
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleUseExtracted} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Create {config.displayName}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setExtractedEntity(null)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Configuration Info */}
      {uploadConfig.extractionRules && uploadConfig.extractionRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Extraction Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Custom extraction rules are configured for this entity type:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {uploadConfig.extractionRules.map((rule, index) => (
                  <li key={index}>
                    Extract <strong>{rule.field}</strong> using pattern: <code className="bg-accent px-1 rounded">{rule.pattern}</code>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UniversalDocumentUpload;