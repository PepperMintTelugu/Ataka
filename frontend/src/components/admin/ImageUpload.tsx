import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  X, 
  Eye, 
  Trash2, 
  Image as ImageIcon,
  Loader2 
} from "lucide-react";

interface ImageUploadProps {
  type: 'authors' | 'publishers' | 'books';
  currentImage?: string;
  onImageSelect: (imageUrl: string) => void;
  onImageDelete?: (imageUrl: string) => void;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
}

interface UploadedImage {
  filename: string;
  url: string;
  fullUrl: string;
  size: number;
  createdAt?: string;
}

export function ImageUpload({
  type,
  currentImage,
  onImageSelect,
  onImageDelete,
  maxSize = 5,
  accept = "image/*",
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load existing images
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/upload/images/${type}`);
      const data = await response.json();
      
      if (data.success) {
        setUploadedImages(data.data);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (showGallery) {
      loadImages();
    }
  }, [showGallery, type]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/upload/upload/${type}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Upload successful",
          description: "Image has been uploaded successfully",
        });
        
        onImageSelect(data.data.fullUrl);
        
        // Refresh the gallery
        if (showGallery) {
          loadImages();
        }
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (image: UploadedImage) => {
    try {
      const response = await fetch(`/api/upload/delete/${type}/${image.filename}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Image deleted",
          description: "Image has been deleted successfully",
        });
        
        // Remove from local state
        setUploadedImages(prev => prev.filter(img => img.filename !== image.filename));
        
        // Notify parent if this was the selected image
        if (onImageDelete && currentImage === image.fullUrl) {
          onImageDelete(image.fullUrl);
        }
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Something went wrong during deletion",
        variant: "destructive",
      });
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
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {currentImage && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={currentImage}
                alt="Current"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Current Image</p>
                <p className="text-xs text-gray-500">Click "Browse Images" to change</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentImage, '_blank')}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 sm:flex-none"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowGallery(!showGallery)}
          className="flex-1 sm:flex-none"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Browse Images
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Gallery */}
      {showGallery && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Image Gallery</h3>
              <Badge variant="secondary">
                {uploadedImages.length} images
              </Badge>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading images...</span>
              </div>
            ) : uploadedImages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No images uploaded yet</p>
                <p className="text-sm">Upload your first image to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.fullUrl}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => onImageSelect(image.fullUrl)}
                    />
                    
                    {/* Image Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onImageSelect(image.fullUrl)}
                        >
                          Select
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(image)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {currentImage === image.fullUrl && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500">Selected</Badge>
                      </div>
                    )}

                    {/* File Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg">
                      <p className="text-xs truncate">{image.filename}</p>
                      <p className="text-xs opacity-75">{formatFileSize(image.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum file size: {maxSize}MB</p>
        <p>• Recommended size: 400x400px for best quality</p>
      </div>
    </div>
  );
}
