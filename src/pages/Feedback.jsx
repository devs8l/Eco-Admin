import React, { useEffect, useState } from 'react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch(`${import.meta.env.VITE_API_BASE_URL}/feedback`)
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error('Error fetching feedbacks:', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">User Feedback</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbacks.map(feedback => (
          <div
            key={feedback._id}
            className="bg-white rounded-xl shadow p-4 border border-gray-100"
          >
            <h2 className="text-lg font-bold">{feedback.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{feedback.email}</p>
            <p className="text-sm"><strong>Mobile:</strong> {feedback.mobile}</p>
            <p className="text-sm"><strong>Address:</strong> {feedback.address}</p>
            <p className="mt-2 text-gray-700 italic">“{feedback.message}”</p>
            <p className="text-xs text-right text-gray-400 mt-3">
              {new Date(feedback.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
