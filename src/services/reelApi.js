export const fetchReels = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reels`);
        if (!response.ok) throw new Error('Failed to fetch reels');
        return await response.json();
    } catch (error) {
        console.error('Error fetching reels:', error);
        throw error;
    }
};

export const uploadReel = async (formData) => {
    try {
        const response = await fetch(`https://eco-backend-test.vercel.app/api/reels`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload reel');
        return await response.json();
    } catch (error) {
        console.error('Error uploading reel:', error);
        throw error;
    }
};

export const deleteReel = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reels/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error('Failed to delete reel');
        return await response.json();
    } catch (error) {
        console.error('Error deleting reel:', error);
        throw error;
    }
};