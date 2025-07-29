import React, { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, X, Upload, FileText, File, Loader2, CheckCircle2
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import type { Character } from '@/lib/types';

interface CharacterDocumentUploadV4Props {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  onClose: () => void;
}

export function CharacterDocumentUploadV4({
  projectId,
  onBack,
  onComplete,
  onClose
}: CharacterDocumentUploadV4Props) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return await CharacterCreationService.importFromDocument(projectId, file);
    },
    onSuccess: (character) => {
      onComplete(character as Character);
    }
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setFile(file);
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  if (uploadMutation.isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
            <Upload className="h-8 w-8 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Processing Document</h3>
            <p className="text-sm text-muted-foreground">
              AI is extracting character information from your document...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            This usually takes 15-30 seconds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-xl font-semibold">Import Document</h2>
            <p className="text-sm text-muted-foreground">
              Extract character from existing text
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Upload Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Upload className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Upload Your Document</h3>
                <p className="text-sm text-muted-foreground">
                  AI will extract character details from your text
                </p>
              </div>
            </div>

            <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.docx,.txt"
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-64",
                  "border-2 border-dashed rounded-xl cursor-pointer",
                  "transition-all duration-200",
                  dragActive 
                    ? "border-orange-500 bg-orange-500/5" 
                    : "border-border hover:border-orange-500/50 hover:bg-muted/50",
                  file && "border-orange-500 bg-orange-500/5"
                )}
              >
                <div 
                  className="flex flex-col items-center justify-center pt-5 pb-6"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <>
                      <CheckCircle2 className="h-12 w-12 text-orange-500 mb-3" />
                      <p className="text-sm font-medium mb-1">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                      >
                        Choose a different file
                      </Button>
                    </>
                  ) : (
                    <>
                      <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium mb-1">
                        Drop your document here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOCX, or TXT files up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </label>
            </form>
          </div>

          {/* Supported Formats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: File, label: 'PDF', desc: 'Character sheets, profiles' },
              { icon: FileText, label: 'DOCX', desc: 'Story documents, notes' },
              { icon: File, label: 'TXT', desc: 'Plain text descriptions' }
            ].map((format) => (
              <div
                key={format.label}
                className="p-4 rounded-lg border bg-muted/30 text-center"
              >
                <format.icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium text-sm">{format.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{format.desc}</p>
              </div>
            ))}
          </div>

          {/* How it Works */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Upload className="h-4 w-4 text-orange-500" />
              How It Works
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Upload a document containing character information</li>
              <li>AI analyzes the text to identify character details</li>
              <li>Extracts name, appearance, personality, and more</li>
              <li>Creates a complete character profile automatically</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-muted/10">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploadMutation.isPending}
            className="gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <Upload className="h-4 w-4" />
            Extract Character
          </Button>
        </div>
      </div>
    </div>
  );
}