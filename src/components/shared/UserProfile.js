'use client';

import { useState, useEffect } from 'react';
import databaseService from '../../services/databaseService';

const UserProfile = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    address: '',
    date_of_birth: '',
    emergency_contact: '',
    emergency_phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await databaseService.getUserProfile(userId);
      setProfile(profileData);
      setFormData({
        bio: profileData.bio || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        date_of_birth: profileData.date_of_birth || '',
        emergency_contact: profileData.emergency_contact || '',
        emergency_phone: profileData.emergency_phone || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (profile) {
        await databaseService.updateUserProfile(userId, formData);
      } else {
        await databaseService.createUserProfile(userId, formData);
      }
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      date_of_birth: profile?.date_of_birth || '',
      emergency_contact: profile?.emergency_contact || '',
      emergency_phone: profile?.emergency_phone || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Your address..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile?.bio && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.phone && (
                <div>
                  <h4 className="font-medium text-gray-800">Phone</h4>
                  <p className="text-gray-600">{profile.phone}</p>
                </div>
              )}

              {profile?.date_of_birth && (
                <div>
                  <h4 className="font-medium text-gray-800">Date of Birth</h4>
                  <p className="text-gray-600">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {profile?.address && (
              <div>
                <h4 className="font-medium text-gray-800">Address</h4>
                <p className="text-gray-600">{profile.address}</p>
              </div>
            )}

            {(profile?.emergency_contact || profile?.emergency_phone) && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.emergency_contact && (
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="text-gray-600">{profile.emergency_contact}</p>
                    </div>
                  )}
                  {profile.emergency_phone && (
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="text-gray-600">{profile.emergency_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
