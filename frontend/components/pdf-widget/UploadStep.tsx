import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadStepProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export const UploadStep = ({ onUpload, isUploading }: UploadStepProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isUploading
  });

  const handleAnalyze = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          "hover:border-primary hover:bg-primary/5",
          isDragActive && "border-primary bg-primary/10",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-12 w-12 text-primary" />
            <p className="font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium text-foreground">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (max 50MB)
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={!selectedFile || isUploading}
        className="w-full"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Analyze PDF
          </>
        )}
      </Button>
    </div>
  );
};
