import React from 'react';
import { ImageCard } from './ImageCard';
import { Image } from '../types/Image';

interface ImageGridProps {
  images: Image[];
  onDelete: (id: string) => void;
  onEdit: (image: Image) => void;
  onView: (image: Image) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onDelete, onEdit, onView }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No images yet</h3>
        <p className="text-gray-500">Upload some images to get started with your photo album</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </div>
  );
};