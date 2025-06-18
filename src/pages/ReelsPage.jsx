import { useState, useRef } from 'react';
import { Play, Pause, Trash2, Edit, Check, X, ExternalLink, Upload } from 'lucide-react';

const ReelsPage = () => {
  const [playingStates, setPlayingStates] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [videoLinks, setVideoLinks] = useState({});
  const [videoFiles, setVideoFiles] = useState({});
  const videoRefs = useRef({});

  // Initial videos data
  const [videos, setVideos] = useState([
    { id: 1, src: '/eco-hero.mp4', poster: '/foot-home.png' },
    { id: 2, src: '/eco-hero.mp4', poster: '/foot-home.png' },
    { id: 3, src: '/eco-hero.mp4', poster: '/foot-home.png' },
    { id: 4, src: '/eco-hero.mp4', poster: '/foot-home.png' },
    { id: 5, src: '/eco-hero.mp4', poster: '/foot-home.png' },
    { id: 6, src: '/eco-hero.mp4', poster: '/foot-home.png' }
  ]);

  const [newVideo, setNewVideo] = useState({
    url: '',
    file: null
  });

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

  const startEditing = (id) => {
    setEditingId(id);
    setVideoLinks(prev => ({ ...prev, [id]: videos.find(v => v.id === id).src }));
    setVideoFiles(prev => ({ ...prev, [id]: null }));
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveVideo = (id) => {
    // In a real app, you would upload the file here
    const updatedVideo = {
      ...videos.find(v => v.id === id),
      src: videoFiles[id] ? URL.createObjectURL(videoFiles[id]) : videoLinks[id]
    };
    
    setVideos(videos.map(video => 
      video.id === id ? updatedVideo : video
    ));
    setEditingId(null);
  };

  const deleteVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleLinkChange = (id, value) => {
    setVideoLinks(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (id, file) => {
    setVideoFiles(prev => ({ ...prev, [id]: file }));
    // Clear URL input when file is selected
    setVideoLinks(prev => ({ ...prev, [id]: '' }));
  };

  const handleNewVideoChange = (e) => {
    const { name, value, files } = e.target;
    setNewVideo(prev => ({
      ...prev,
      [name]: name === 'file' ? files[0] : value
    }));
  };

  const addNewVideo = (e) => {
    e.preventDefault();
    if (!newVideo.url && !newVideo.file) return;
    
    const newId = Math.max(...videos.map(v => v.id), 0) + 1;
    const src = newVideo.file ? URL.createObjectURL(newVideo.file) : newVideo.url;
    
    setVideos([...videos, {
      id: newId,
      src,
      poster: '/default-poster.jpg' // You might want to generate this from the video
    }]);
    
    setNewVideo({ url: '', file: null });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reels Management</h1>
      
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Video Player */}
            <div className="relative group overflow-hidden aspect-[3/5]">
              <video
                ref={el => videoRefs.current[video.id] = el}
                src={video.src}
                poster={video.poster}
                className="w-full h-full object-cover"
                onClick={() => togglePlayPause(video.id)}
                playsInline
                muted
                loop
                onPlay={() => setPlayingStates(prev => ({ ...prev, [video.id]: true }))}
                onPause={() => setPlayingStates(prev => ({ ...prev, [video.id]: false }))}
              />

              {!playingStates[video.id] && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause(video.id);
                  }}
                  className="absolute inset-0 m-auto w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all"
                >
                  <Play className="text-black pl-1" size={20} />
                </button>
              )}
            </div>

            {/* Edit Controls */}
            <div className="p-3 bg-gray-50">
              {editingId === video.id ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Video URL</label>
                    <input
                      type="url"
                      value={videoLinks[video.id] || ''}
                      onChange={(e) => handleLinkChange(video.id, e.target.value)}
                      placeholder="Or enter video URL"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Or upload file</label>
                    <label className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                      <Upload size={16} />
                      <span className="text-sm">{videoFiles[video.id]?.name || 'Choose file'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(video.id, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => saveVideo(video.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm"
                      disabled={!videoLinks[video.id] && !videoFiles[video.id]}
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded text-sm"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <button
                    onClick={() => startEditing(video.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    <Edit size={16} /> Update
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Video Form */}
      <div className="mt-8 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Reel</h2>
        <form onSubmit={addNewVideo} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Video URL</label>
            <input
              type="url"
              name="url"
              value={newVideo.url}
              onChange={handleNewVideoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter video URL"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Or upload file</label>
            <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
              <Upload size={16} />
              <span>{newVideo.file?.name || 'Choose video file'}</span>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleNewVideoChange}
                className="hidden"
              />
            </label>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={!newVideo.url && !newVideo.file}
          >
            Add Reel
          </button>
        </form>
      </div>

    </div>
  );
};

export default ReelsPage;