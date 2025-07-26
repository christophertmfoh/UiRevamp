import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CharacterDocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onParseComplete: (characterData: any) => void;
  projectId: string;
}

export function CharacterDocumentUpload({
  isOpen,
  onClose,
  onParseComplete,
  projectId
}: CharacterDocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedTypes = [
    { extension: 'PDF', description: 'PDF Documents', color: 'bg-red-100 text-red-800' },
    { extension: 'DOCX', description: 'Word Documents', color: 'bg-blue-100 text-blue-800' },
    { extension: 'TXT', description: 'Text Files', color: 'bg-gray-100 text-gray-800' }
  ];

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return validTypes.includes(file.type) || file.name.toLowerCase().endsWith('.txt');
  };

  const handleFileSelect = (file: File) => {
    if (!isValidFileType(file)) {
      setParseError('Please upload a PDF, Word document (.docx), or text file (.txt)');
      return;
    }
    
    setSelectedFile(file);
    setParseError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const importDocument = async () => {
    if (!selectedFile) return;
    
    setIsParsing(true);
    setParseError(null);
    
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('projectId', projectId);
      
      const response = await fetch('/api/characters/import-document', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import document');
      }
      
      const characterData = await response.json();
      console.log('Document imported successfully:', characterData);
      
      onParseComplete(characterData);
      onClose();
      
    } catch (error) {
      console.error('Document import error:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to import document');
    } finally {
      setIsParsing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-6 border-b border-border/30">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
              <Upload className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="font-bold">Import Character Sheet</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Upload your character document and let AI extract all the details
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Supported File Types */}
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Supported File Types</h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {supportedTypes.map((type) => (
                <Badge key={type.extension} className={`${type.color} border-0 font-medium px-3 py-1`}>
                  {type.extension} - {type.description}
                </Badge>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <Card 
            className={`relative transition-all duration-300 border-2 border-dashed ${
              dragOver 
                ? 'border-accent bg-accent/5' 
                : selectedFile 
                  ? 'border-green-300 bg-green-50/50' 
                  : 'border-border/50 hover:border-accent/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <CardContent className="p-12 text-center">
              {!selectedFile ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Drop your character sheet here</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Or click to browse and select a file
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-accent/50 hover:bg-accent/5"
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">File Ready for Processing</h3>
                    <div className="bg-background/50 rounded-lg p-4 text-left max-w-md mx-auto">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(selectedFile.size)} • {selectedFile.type || 'text/plain'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFile}
                          className="flex-shrink-0 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {parseError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{parseError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border/30">
            <Button variant="outline" onClick={onClose} disabled={isParsing}>
              Cancel
            </Button>
            <Button 
              onClick={importDocument} 
              disabled={!selectedFile || isParsing}
              className="bg-accent hover:bg-accent/90"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing Character...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Character Sheet
                </>
              )}
            </Button>
          </div>

          {/* Processing Info */}
          {isParsing && (
            <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
              <div className="text-center space-y-3">
                <div className="text-sm font-medium text-accent">AI Reading Document & Generating Portrait</div>
                <div className="text-xs text-muted-foreground max-w-md mx-auto">
                  Our AI is reading your document, extracting character information to populate all character fields, and automatically generating a character portrait. This may take a moment...
                </div>
                <div className="bg-muted/50 rounded-lg p-3 max-w-sm mx-auto">
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>• Reading document</div>
                    <div>• Extracting traits</div>
                    <div>• Mapping fields</div>
                    <div>• Creating portrait</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}