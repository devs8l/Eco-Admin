import { useState, useEffect } from 'react';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../services/api';
import { Check, X, Trash2, RefreshCw } from 'lucide-react';

const FormsDataPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const response = await fetchBookings();
    if (response.success) {
      setBookings(response.data);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      const newStatus = currentStatus === 'confirmed' ? 'cancelled' : 'confirmed';
      const response = await updateBookingStatus(id, newStatus);
      
      if (response.success) {
        setBookings(bookings.map(booking =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        ));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    setDeletingId(id);
    try {
      const response = await deleteBooking(id);
      if (response.success) {
        setBookings(bookings.filter(booking => booking._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
        <button 
          onClick={loadBookings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.packageName}
                  {booking.rooms && (
                    <div className="text-xs text-gray-400">
                      {booking.rooms} room(s) • {booking.adults} adults • {booking.kids} kids
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusUpdate(booking._id, booking.status)}
                    disabled={updatingId === booking._id}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {updatingId === booking._id ? (
                      <span className="animate-spin"><RefreshCw size={14} /></span>
                    ) : booking.status === 'confirmed' ? (
                      <Check size={14} />
                    ) : booking.status === 'cancelled' ? (
                      <X size={14} />
                    ) : null}
                    {booking.status}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDelete(booking._id)}
                    disabled={deletingId === booking._id}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 text-xs"
                  >
                    {deletingId === booking._id ? (
                      <span className="animate-spin"><RefreshCw size={14} /></span>
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormsDataPage;