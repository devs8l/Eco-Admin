export default {
  async getPricing() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pricing`);
    return await response.json();
  },

  async updatePricing(pricingData, token) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pricing`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pricingData)
    });
    return await response.json();
  }
};