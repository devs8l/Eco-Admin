
// Get Cloudinary signature
export const getGallerySignature = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gallery/gallery-signature`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get Cloudinary signature');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting Cloudinary signature:', error);
        throw error;
    }
};

export const uploadGalleryImage = async (file, signatureData) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('signature', signatureData.signature);
    formData.append('folder', 'eco-holiday-gallery');

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        { method: 'POST', body: formData }
    );

    const result = await uploadRes.json();
    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};

// Get all gallery images
export const getGalleryImages = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gallery`);

        if (!response.ok) {
            throw new Error('Failed to fetch gallery images');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        throw error;
    }
};

// Add new image to gallery
export const addGalleryImage = async (imageData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gallery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
            },
            body: JSON.stringify(imageData)
        });

        if (!response.ok) {
            throw new Error('Failed to add gallery image');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding gallery image:', error);
        throw error;
    }
};

// Delete image from gallery
export const deleteGalleryImage = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gallery/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete gallery image');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        throw error;
    }
};