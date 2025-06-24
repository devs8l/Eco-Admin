import { useState, useEffect } from 'react';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../services/api';
import { Check, X, Trash2, RefreshCw, ChevronDown } from 'lucide-react';

const FormsDataPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Helper function
  function formatToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await updateBookingStatus(id, newStatus);
      if (response.success) {
        setBookings(bookings.map(booking =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        ));
      }
    } finally {
      setUpdatingId(null);
      setOpenDropdownId(null);
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

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-200' };
      default:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', hover: 'hover:bg-yellow-200' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Check size={14} />;
      case 'cancelled':
        return <X size={14} />;
      default:
        return null;
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
                  {formatToDDMMYYYY(booking.checkInDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.checkOutDate ? formatToDDMMYYYY(booking.checkOutDate) : '-'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap relative">
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(booking._id)}
                      disabled={updatingId === booking._id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status).bg} ${getStatusColor(booking.status).text} ${getStatusColor(booking.status).hover}`}
                    >
                      {updatingId === booking._id ? (
                        <span className="animate-spin"><RefreshCw size={14} /></span>
                      ) : (
                        <>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                          <ChevronDown size={14} className={`transition-transform ${openDropdownId === booking._id ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                    
                    {openDropdownId === booking._id && (
                      <div className="absolute z-10 mt-1 w-32 bg-white shadow-lg rounded-md py-1">
                        {['pending', 'confirmed', 'cancelled'].map((status) => (
                          status !== booking.status && (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(booking._id, status)}
                              className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${getStatusColor(status).hover}`}
                            >
                              {getStatusIcon(status)}
                              {status}
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>
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