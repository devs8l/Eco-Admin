import React, { useState, useEffect } from 'react';
import { getGallerySignature, addGalleryImage, getGalleryImages, deleteGalleryImage } from '../services/galleryApi';
import { uploadGalleryImage } from '../services/galleryApi';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('PROPERTY');
  const [message, setMessage] = useState({ text: '', type: '' });

  const categoryOptions = [
    'PROPERTY',
    'SWIMMING POOL',
    'COMMON AREA',
    'DINING AREA',
    'RAIN DANCE',
    'VILLA',
    'WOODEN COTTAGE',
    'POOL ROOM'
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const galleryImages = await getGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      setMessage({ text: 'Failed to load gallery images', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setMessage({ text: 'Please select an image file', type: 'error' });
        return;
      }
     
      setSelectedFile(file);
      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ text: 'Please select an image file', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      // Get Cloudinary signature
      const signatureData = await getGallerySignature();
      
      // Upload to Cloudinary
      const cloudinaryRes = await uploadGalleryImage(selectedFile, signatureData);
      
      // Save to database
      await addGalleryImage({
        url: cloudinaryRes.url,
        category
      });

      setMessage({ text: 'Image uploaded successfully!', type: 'success' });
      setSelectedFile(null);
      fetchGalleryImages(); // Refresh the gallery
    } catch (error) {
      setMessage({ text: 'Upload failed. Please try again.', type: 'error' });
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id);
        setImages(images.filter(img => img._id !== id));
        setMessage({ text: 'Image deleted successfully', type: 'success' });
      } catch (error) {
        setMessage({ text: 'Failed to delete image', type: 'error' });
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gallery Management</h1>
      
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload New Image</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 8MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${uploading || !selectedFile ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
      
      {/* Gallery Display */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Gallery Images</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : images.length === 0 ? (
          <p className="text-gray-500">No images in the gallery yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image._id} className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={image.url}
                  alt={image.category}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800">{image.category}</p>
                </div>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;