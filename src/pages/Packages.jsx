import React, { useState, useEffect } from 'react';
import pricingAPI from '../services/packageApi';

export default function Packages() {
  const [pricing, setPricing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    async function loadPricing() {
      try {
        const data = await pricingAPI.getPricing();
        if (data.party) setPricing(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load pricing:', error);
        setIsLoading(false);
      }
    }
    loadPricing();
  }, []);

  const handleChange = (path, value) => {
    const paths = path.split('.');
    setPricing(prev => {
      const newPricing = {...prev};
      let current = newPricing;
      
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      return newPricing;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pricingAPI.updatePricing(pricing, token);
      alert('Pricing updated successfully!');
    } catch (error) {
      console.error('Failed to update pricing:', error);
      alert('Failed to update pricing');
    }
  };

  if (isLoading) return <div className="flex justify-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Package Pricing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Party Pricing */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Party Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adult Price (₹)</label>
              <input
                type="number"
                value={pricing.party.adult || ''}
                onChange={(e) => handleChange('party.adult', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child Price (₹)</label>
              <input
                type="number"
                value={pricing.party.child || ''}
                onChange={(e) => handleChange('party.child', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Party Timings */}
          <h3 className="text-md font-medium mt-6 mb-3">Party Timings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                value={pricing.party.timing.from || ''}
                onChange={(e) => handleChange('party.timing.from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                value={pricing.party.timing.to || ''}
                onChange={(e) => handleChange('party.timing.to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Lunch Timings */}
          <h3 className="text-md font-medium mt-6 mb-3">Lunch Timings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                value={pricing.party.lunch.from || ''}
                onChange={(e) => handleChange('party.lunch.from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                value={pricing.party.lunch.to || ''}
                onChange={(e) => handleChange('party.lunch.to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Dinner Timings */}
          <h3 className="text-md font-medium mt-6 mb-3">Dinner Timings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                value={pricing.party.dinner.from || ''}
                onChange={(e) => handleChange('party.dinner.from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                value={pricing.party.dinner.to || ''}
                onChange={(e) => handleChange('party.dinner.to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Night Stay Pricing */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Night Stay</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cottage (₹)</label>
              <input
                type="number"
                value={pricing.nightStay.cottage || ''}
                onChange={(e) => handleChange('nightStay.cottage', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Villa (₹)</label>
              <input
                type="number"
                value={pricing.nightStay.villa || ''}
                onChange={(e) => handleChange('nightStay.villa', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pool Room (₹)</label>
              <input
                type="number"
                value={pricing.nightStay.poolRoom || ''}
                onChange={(e) => handleChange('nightStay.poolRoom', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Camping Pricing */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Camping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
              <input
                type="number"
                value={pricing.camping.basePrice || ''}
                onChange={(e) => handleChange('camping.basePrice', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
              <input
                type="number"
                value={pricing.camping.taxPercent || ''}
                onChange={(e) => handleChange('camping.taxPercent', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Pricing
          </button>
        </div>
      </form>
    </div>
  );
}