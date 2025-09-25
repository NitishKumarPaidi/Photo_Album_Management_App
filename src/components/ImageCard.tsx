import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Image } from '../types/Image';

interface ImageCardProps {
  image: Image;
  onDelete: (id: string) => void;
  onEdit: (image: Image) => void;
  onView: (image: Image) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete, onEdit, onView }) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onClick={() => onView(image)}
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={() => onView(image)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => onEdit(image)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(image.id)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {image.title}
        </h3>
        {image.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {image.description}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          {image.createdAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};