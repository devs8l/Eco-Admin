import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Trash2, Upload } from 'lucide-react';
import { fetchReels, uploadReel, deleteReel } from '../services/reelApi';

const ReelsPage = () => {
  const [playingStates, setPlayingStates] = useState({});
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    file: null
  });
  const videoRefs = useRef({});

  useEffect(() => {
    const loadReels = async () => {
      try {
        const data = await fetchReels();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadReels();
  }, []);

  const togglePlayPause = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingStates[id]) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    setPlayingStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteReel(id);
      setVideos(videos.filter(video => video._id !== id));
    } catch (error) {
      console.error('Error deleting reel:', error);
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    setNewVideo(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newVideo.file || !newVideo.title) return;

    const formData = new FormData();
    formData.append('title', newVideo.title);
    formData.append('description', newVideo.description);
    formData.append('video', newVideo.file);

    try {
      const createdReel = await uploadReel(formData);
      setVideos([createdReel, ...videos]);
      setNewVideo({
        title: '',
        description: '',
        file: null
      });
    } catch (error) {
      console.error('Error uploading reel:', error);
      setError(error.message);
    }
  };

  if (isLoading) return <div className="p-6">Loading reels...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reels Management</h1>
      
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Video Player */}
            <div className="relative group overflow-hidden aspect-[3/5]">
              <video
                ref={el => videoRefs.current[video._id] = el}
                src={video.videoUrl}
                className="w-full h-full object-cover"
                onClick={() => togglePlayPause(video._id)}
                playsInline
                muted
                loop
                onPlay={() => setPlayingStates(prev => ({ ...prev, [video._id]: true }))}
                onPause={() => setPlayingStates(prev => ({ ...prev, [video._id]: false }))}
              />

              {!playingStates[video._id] && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause(video._id);
                  }}
                  className="absolute inset-0 m-auto w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all"
                >
                  <Play className="text-black pl-1" size={20} />
                </button>
              )}
            </div>

            {/* Video Info */}
            <div className="p-3 bg-gray-50">
              <h3 className="font-medium text-gray-800">{video.title}</h3>
              {video.description && (
                <p className="text-sm text-gray-600 mt-1">{video.description}</p>
              )}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleDelete(video._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Video Form */}
      <div className="mt-8 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Reel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Title *</label>
            <input
              type="text"
              name="title"
              value={newVideo.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newVideo.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Video File *</label>
            <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
              <Upload size={16} />
              <span>{newVideo.file?.name || 'Choose video file'}</span>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
            <p className="text-xs text-gray-500">Max file size: 100MB</p>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={!newVideo.file || !newVideo.title}
          >
            Upload Reel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReelsPage;