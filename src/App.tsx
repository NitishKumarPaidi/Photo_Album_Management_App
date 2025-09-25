import React, { useState, useCallback } from 'react';
import { Images } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ImageGrid } from './components/ImageGrid';
import { ImageModal } from './components/ImageModal';
import { EditImageModal } from './components/EditImageModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Image } from './types/Image';

function App() {
  const { user, isLoading, error, login, register, logout, clearError } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; imageId: string; imageName: string }>({
    isOpen: false,
    imageId: '',
    imageName: ''
  });

  const handleImagesUpload = useCallback((files: File[]) => {
    const newImages: Image[] = files.map(file => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
      title: file.name.split('.')[0],
      description: '',
      createdAt: new Date()
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleDeleteImage = useCallback((id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      setDeleteConfirm({
        isOpen: true,
        imageId: id,
        imageName: image.title
      });
    }
  }, [images]);

  const confirmDelete = useCallback(() => {
    setImages(prev => {
      const imageToDelete = prev.find(img => img.id === deleteConfirm.imageId);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      return prev.filter(img => img.id !== deleteConfirm.imageId);
    });
    
    setDeleteConfirm({ isOpen: false, imageId: '', imageName: '' });
    setSelectedImage(null);
  }, [deleteConfirm.imageId]);

  const handleEditImage = useCallback((image: Image) => {
    setEditingImage(image);
    setSelectedImage(null);
  }, []);

  const handleSaveEdit = useCallback((id: string, title: string, description: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, title, description } : img
    ));
  }, []);

  const handleReplaceImage = useCallback((id: string, newFile: File) => {
    setImages(prev => prev.map(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.url);
        return {
          ...img,
          file: newFile,
          url: URL.createObjectURL(newFile),
          title: newFile.name.split('.')[0]
        };
      }
      return img;
    }));
  }, []);

  const handleViewImage = useCallback((image: Image) => {
    setSelectedImage(image);
  }, []);

  const handleAuthSubmit = useCallback((email: string, password: string, name?: string) => {
    clearError();
    if (authMode === 'login') {
      login(email, password);
    } else {
      register(email, password, name!);
    }
  }, [authMode, login, register, clearError]);

  const toggleAuthMode = useCallback(() => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    clearError();
  }, [clearError]);

  // Show auth form if user is not logged in
  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuthSubmit}
        onToggleMode={toggleAuthMode}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <ImageUpload onImagesUpload={handleImagesUpload} />
        </div>

        {/* Stats */}
        {images.length > 0 && (
          <div className="mb-6 flex items-center space-x-2 text-gray-600">
            <Images className="w-5 h-5" />
            <span>{images.length} {images.length === 1 ? 'image' : 'images'}</span>
          </div>
        )}

        {/* Image Grid */}
        <ImageGrid
          images={images}
          onDelete={handleDeleteImage}
          onEdit={handleEditImage}
          onView={handleViewImage}
        />

        {/* Modals */}
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onEdit={handleEditImage}
          onDelete={handleDeleteImage}
        />

        <EditImageModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={handleSaveEdit}
          onReplace={handleReplaceImage}
        />

        <DeleteConfirmModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, imageId: '', imageName: '' })}
          onConfirm={confirmDelete}
          imageName={deleteConfirm.imageName}
        />
      </div>
    </div>
  );
}

export default App;