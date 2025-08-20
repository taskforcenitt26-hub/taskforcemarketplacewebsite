import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCycles } from '../../hooks/useCycles';
import { InlineLoader } from '../../components/SimpleLoaders';
import { supabase } from '../../lib/supabase';

const AddCycleModal = ({ onClose }) => {
  const { addCycle } = useCycles();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', // storing serial number here to keep compatibility
    brand: '',
    model: '',
    description: '',
    is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Upload selected image to Supabase Storage and return public URL
  const uploadImageIfNeeded = async () => {
    if (!imageFile) throw new Error('Please upload a cycle image.');
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `cycles/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt || 'jpg'}`;
    const { error: uploadError } = await supabase.storage
      .from('cycle-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: imageFile.type || 'image/jpeg'
      });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('cycle-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile) {
        alert('Please upload a cycle image before submitting.');
        return;
      }
      // Prevent duplicate Serial Number (name) before insert
      const { data: existing, error: existsErr } = await supabase
        .from('cycles')
        .select('id')
        .eq('name', formData.name.trim())
        .limit(1);
      if (existsErr) throw existsErr;
      if (existing && existing.length > 0) {
        alert('A cycle with this Serial Number already exists. Please use a unique Serial Number.');
        return;
      }

      const publicImageUrl = await uploadImageIfNeeded();
      const cycleData = {
        ...formData,
        image_url: publicImageUrl,
      };

      const result = await addCycle(cycleData);
      if (result.error) {
        alert('Error adding cycle: ' + result.error);
      } else {
        alert('Cycle added successfully!');
        onClose();
      }
    } catch (error) {
      alert('Error adding cycle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Cycle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter serial number"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                id="brand"
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter model"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter cycle description"
            />
          </div>

          {/* Image (upload only) */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {imageFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded border"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Available for sale
            </label>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <InlineLoader message="Adding..." textColor="text-white" />
              ) : (
                'Add Cycle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCycleModal;