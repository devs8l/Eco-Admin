import { useState, useEffect } from 'react';
import { 
    getBentoItems, 
    updateBentoItem,
} from '../services/bentoApi';
import { 
    getGallerySignature, 
    uploadGalleryImage 
} from '../services/galleryApi';

const HeroBento = () => {
    const [bentos, setBentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingBento, setEditingBento] = useState(null);
    const [editForm, setEditForm] = useState({
        url: '',
        imgText: ''
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBentos();
    }, []);

    const fetchBentos = async () => {
        try {
            setIsLoading(true);
            const data = await getBentoItems();
            setBentos(data);
        } catch (error) {
            console.error('Failed to load bento items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const signatureData = await getGallerySignature();
            const uploadResult = await uploadGalleryImage(file, {
                ...signatureData,
                folder: 'eco-holiday-bento'
            });
            
            setEditForm(prev => ({ ...prev, url: uploadResult.url }));
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await updateBentoItem(editingBento._id, editForm);
            setShowModal(false);
            fetchBentos();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const openEditModal = (bento) => {
        setEditingBento(bento);
        setEditForm({
            url: bento.url,
            imgText: bento.imgText
        });
        setShowModal(true);
    };

    const filterBentos = (start, end) => {
        return bentos.filter(bento => {
            const idNum = parseInt(bento.bentoId);
            return idNum >= start && idNum <= end;
        }).sort((a, b) => parseInt(a.bentoId) - parseInt(b.bentoId));
    };

    const renderBentoGrid = (bentos, title) => (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bentos.map(bento => (
                    <div 
                        key={bento._id} 
                        className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => openEditModal(bento)}
                    >
                        <img 
                            src={bento.url} 
                            alt={bento.imgText} 
                            className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0   transition-all duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                Click to edit
                            </span>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="font-medium">{bento.imgText}</p>
                            <p className="text-sm text-gray-500">ID: {bento.bentoId}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            
            
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {renderBentoGrid(filterBentos(1, 6), "Hero Section Bento Grid")}
                    {renderBentoGrid(filterBentos(7, 9), "Camping Grid")}
                    {renderBentoGrid(filterBentos(10, 12), "Day Out Party Grid")}
                </>
            )}

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#000000a8] backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Edit Bento Item</h2>
                            
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image Upload
                                    </label>
                                    <input 
                                        type="file" 
                                        onChange={handleFileUpload}
                                        className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                        accept="image/*"
                                    />
                                    {editForm.url && (
                                        <div className="mt-2">
                                            <img 
                                                src={editForm.url} 
                                                alt="Preview" 
                                                className="h-20 w-20 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image Text
                                    </label>
                                    <input
                                        type="text"
                                        name="imgText"
                                        value={editForm.imgText}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, imgText: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroBento;