'use client';

import { useState, useEffect } from 'react';
import databaseService from '../../services/databaseService';

const PropertyAmenities = ({ propertyId, onClose }) => {
  const [amenities, setAmenities] = useState([]);
  const [propertyAmenities, setPropertyAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [amenitiesData, propertyAmenitiesData] = await Promise.all([
        databaseService.getAmenities(),
        databaseService.getPropertyAmenities(propertyId)
      ]);
      setAmenities(amenitiesData);
      setPropertyAmenities(propertyAmenitiesData);
    } catch (error) {
      console.error('Error loading amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = async (amenityId) => {
    const isSelected = propertyAmenities.some(pa => pa.id === amenityId);
    
    try {
      setSaving(true);
      if (isSelected) {
        await databaseService.removeAmenityFromProperty(propertyId, amenityId);
        setPropertyAmenities(prev => prev.filter(pa => pa.id !== amenityId));
      } else {
        await databaseService.addAmenityToProperty(propertyId, amenityId);
        const amenity = amenities.find(a => a.id === amenityId);
        setPropertyAmenities(prev => [...prev, amenity]);
      }
    } catch (error) {
      console.error('Error updating amenities:', error);
      alert('Error updating amenities. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">Loading amenities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Property Amenities</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                {category} Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryAmenities.map(amenity => {
                  const isSelected = propertyAmenities.some(pa => pa.id === amenity.id);
                  return (
                    <div
                      key={amenity.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !saving && handleAmenityToggle(amenity.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => !saving && handleAmenityToggle(amenity.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={saving}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{amenity.name}</h4>
                          {amenity.description && (
                            <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyAmenities;
