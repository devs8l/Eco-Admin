import React, { useState, useEffect } from 'react';
import { 
  getRoomImages, 
  getRoomImageUploadSignature,
  uploadRoomImage,
  updateRoomImages
} from '../services/roomApi';

const RoomImages = () => {
  const [roomType, setRoomType] = useState('cottage');
  const [roomData, setRoomData] = useState({
    cottage: [],
    villa: [],
    poolRoom: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchRoomImages();
  }, []);

  const fetchRoomImages = async () => {
    setIsLoading(true);
    try {
      const data = await getRoomImages();
      setRoomData(data);
    } catch (error) {
      console.error('Error fetching room images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setIsLoading(true);
    try {
      const signatureData = await getRoomImageUploadSignature();
      setUploadProgress(0);
      
      const result = await uploadRoomImage(file, signatureData, (progress) => {
        setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
      });

      let updatedImages;
      if (index !== null) {
        // Replace image at specific index
        updatedImages = [...roomData[roomType]];
        updatedImages[index] = {
          url: result.url,
          publicId: result.publicId,
          isFeatured: updatedImages[index]?.isFeatured || false
        };
      } else {
        // Add new image
        updatedImages = [
          ...roomData[roomType], 
          {
            url: result.url,
            publicId: result.publicId,
            isFeatured: false
          }
        ];
      }

      await updateRoomImages(roomType, updatedImages);
      setRoomData(prev => ({
        ...prev,
        [roomType]: updatedImages
      }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      e.target.value = null;
    }
  };

  const handleSetFeatured = async (publicId) => {
    try {
      const updatedImages = roomData[roomType].map(img => ({
        ...img,
        isFeatured: img.publicId === publicId
      }));
      
      await updateRoomImages(roomType, updatedImages);
      setRoomData(prev => ({
        ...prev,
        [roomType]: updatedImages
      }));
    } catch (error) {
      console.error('Error setting featured image:', error);
    }
  };

  const triggerFileInput = (index) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => handleFileUpload(e, index);
    fileInput.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Room Image Management</h1>
        
        {/* Room Type Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Room Type</label>
          <div className="flex space-x-4">
            {['cottage', 'villa', 'poolRoom'].map((type) => (
              <button
                key={type}
                onClick={() => setRoomType(type)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  roomType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <label className="mt-4 cursor-pointer">
              <span className="text-blue-600 font-medium">Click to upload</span>
              <span className="text-gray-500 ml-1">or drag and drop</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <p className="mt-1 text-xs text-red-500">PNG, JPG, JPEG up to 8MB</p>
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">Uploading...</span>
                <span className="text-sm font-medium text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Images
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({roomData[roomType]?.length || 0} images)
              </span>
            </h2>

            {roomData[roomType]?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No images uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {roomData[roomType]?.map((image, index) => (
                  <div
                    key={image.publicId}
                    className={`relative group overflow-hidden rounded-lg shadow-md transition-transform hover:shadow-lg ${
                      image.isFeatured ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Room ${roomType}`}
                      className="w-full h-56 object-cover"
                    />
                    
                    {image.isFeatured && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                        Featured
                      </div>
                    )}

                    <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                      <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex justify-end">
                          
                          <button
                            onClick={() => triggerFileInput(index)}
                            className="px-3 py-1 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomImages;