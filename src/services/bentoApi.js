// Get all bento items
export const getBentoItems = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bento`);

        if (!response.ok) {
            throw new Error('Failed to fetch bento items');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching bento items:', error);
        throw error;
    }
};

// Add new bento item
export const addBentoItem = async (bentoData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bento`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
            },
            body: JSON.stringify(bentoData)
        });

        if (!response.ok) {
            throw new Error('Failed to add bento item');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding bento item:', error);
        throw error;
    }
};

// Update bento item
export const updateBentoItem = async (id, bentoData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
            },
            body: JSON.stringify(bentoData)
        });

        if (!response.ok) {
            throw new Error('Failed to update bento item');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating bento item:', error);
        throw error;
    }
};

// Delete bento item
export const deleteBentoItem = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bento/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete bento item');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting bento item:', error);
        throw error;
    }
};