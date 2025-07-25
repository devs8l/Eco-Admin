// services/api.js
export const fetchBookings = async () => {
  try {
    const token = localStorage.getItem('ecoAdminToken');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, data: [] };
  }
};


export const updateBookingStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('ecoAdminToken');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    const token = localStorage.getItem('ecoAdminToken');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};