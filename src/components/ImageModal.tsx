import React from 'react';
import { X, Download, Edit2, Trash2 } from 'lucide-react';
import { Image } from '../types/Image';

interface ImageModalProps {
  image: Image | null;
  onClose: () => void;
  onEdit: (image: Image) => void;
  onDelete: (id: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onEdit, onDelete }) => {
  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || 'image';
    link.click();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-200 z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        {/* Action buttons */}
        <div className="absolute top-4 left-4 flex space-x-2 z-10">
          <button
            onClick={handleDownload}
            className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-200"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => onEdit(image)}
            className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-200"
          >
            <Edit2 className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-200"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Image */}
        <img
          src={image.url}
          alt={image.title}
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Image info */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4">
          <h2 className="text-white text-xl font-semibold mb-1">{image.title}</h2>
          {image.description && (
            <p className="text-gray-300 text-sm">{image.description}</p>
          )}
          <p className="text-gray-400 text-xs mt-2">
            {image.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};