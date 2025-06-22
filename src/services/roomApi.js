export const getRoomImages = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room-images`);
  return await response.json();
};

export const getRoomImageUploadSignature = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room-images/signature`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
    }
  });
  console.log('Signature response:', response);
  
  return await response.json();
};

export const uploadRoomImage = async (file, signatureData) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', signatureData.timestamp);
  formData.append('signature', signatureData.signature);
  formData.append('folder', 'eco-holiday-rooms');

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

export const updateRoomImages = async (type, images) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room-images/${type}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('ecoAdminToken')}`
    },
    body: JSON.stringify({ images })
  });
  return await response.json();
};

export const deleteRoomImage = async (type, publicId) => {
  // First delete from Cloudinary
  const signatureRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room-images/signature`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  const { apiKey, timestamp, signature, cloudName } = await signatureRes.json();

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: 'POST', body: formData }
  );
  
  // Then remove from database
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room-images/${type}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify({
      images: (await getRoomImages())[type].filter(img => img.publicId !== publicId)
    })
  });
  return await response.json();
};