// pages/FormsDataPage.jsx
import { useState, useEffect } from 'react';
import { fetchBookings, updateBookingStatus } from '../services/api';

const FormsDataPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchBookings();
      if (response.success) {
        setBookings(response.data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending';
    const response = await updateBookingStatus(id, newStatus);

    if (response.success) {
      setBookings(bookings.map(booking =>
        booking._id === id ? { ...booking, status: newStatus } : booking
      ));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white  rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Room Booking Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full  bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adults</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kids</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Beds</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.packageName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.adults}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.kids}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.rooms}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.extraBeds}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOutDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleStatusToggle(booking._id, booking.status)}
                    className={`px-2 py-1 rounded text-xs font-medium ${booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                  >
                    {booking.status}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleString()}
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