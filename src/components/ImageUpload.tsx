import React, { useCallback, useState } from 'react';
import { Upload, Plus } from 'lucide-react';

interface ImageUploadProps {
  onImagesUpload: (files: File[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onImagesUpload(files);
    }
  }, [onImagesUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onImagesUpload(files);
    }
    
    // Reset input value to allow same file upload again
    e.target.value = '';
  }, [onImagesUpload]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        isDragOver
          ? 'border-blue-500 bg-blue-50 scale-105'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-4 rounded-full transition-colors duration-200 ${
          isDragOver ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          {isDragOver ? (
            <Plus className="w-8 h-8 text-blue-500" />
          ) : (
            <Upload className="w-8 h-8 text-gray-500" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            {isDragOver ? 'Drop images here' : 'Upload Images'}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop images here, or click to select files
          </p>
        </div>
      </div>
    </div>
  );
};