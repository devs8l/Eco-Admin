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


export const uploadVideoToCloudinary = async (videoFile) => {
    try {
        // Get signed credentials
        const res = await fetch(`http://localhost:3000/api/signature`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
            }
        });

        if (!res.ok) throw new Error('Failed to get upload signature');

        const { timestamp, signature, apiKey, cloudName } = await res.json();
        console.log('Upload credentials:', { timestamp, signature, apiKey, cloudName });
        

        // Prepare upload
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', 'eco-holiday-reels');

        // Upload to Cloudinary
        const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
            { method: 'POST', body: formData }
        );

        return await uploadRes.json();
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};

export const uploadReel = async (formData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reels`, {
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