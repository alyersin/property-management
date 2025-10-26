'use client';

import { useState, useEffect } from 'react';
import databaseService from '../../services/databaseService';

const PropertyTenantManagement = ({ propertyId, onClose }) => {
  const [tenants, setTenants] = useState([]);
  const [propertyTenants, setPropertyTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [leaseData, setLeaseData] = useState({
    lease_start: '',
    lease_end: '',
    rent_amount: '',
    status: 'Active'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tenantsData, propertyTenantsData] = await Promise.all([
        databaseService.getTenants(),
        databaseService.getPropertyTenants(propertyId)
      ]);
      setTenants(tenantsData);
      setPropertyTenants(propertyTenantsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTenant = async () => {
    if (!selectedTenant || !leaseData.lease_start || !leaseData.rent_amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await databaseService.assignTenantToProperty(propertyId, selectedTenant, leaseData);
      await loadData();
      setShowAssignForm(false);
      setSelectedTenant('');
      setLeaseData({
        lease_start: '',
        lease_end: '',
        rent_amount: '',
        status: 'Active'
      });
    } catch (error) {
      console.error('Error assigning tenant:', error);
      alert('Error assigning tenant. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTenant = async (tenantId) => {
    if (!confirm('Are you sure you want to remove this tenant from the property?')) {
      return;
    }

    try {
      setSaving(true);
      await databaseService.removeTenantFromProperty(propertyId, tenantId);
      await loadData();
    } catch (error) {
      console.error('Error removing tenant:', error);
      alert('Error removing tenant. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const availableTenants = tenants.filter(tenant => 
    !propertyTenants.some(pt => pt.tenant_id === tenant.id)
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">Loading tenant data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Property Tenant Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Tenants */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Current Tenants</h3>
            <button
              onClick={() => setShowAssignForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={saving}
            >
              Assign New Tenant
            </button>
          </div>

          {propertyTenants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tenants currently assigned to this property.
            </div>
          ) : (
            <div className="space-y-4">
              {propertyTenants.map(pt => (
                <div key={pt.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{pt.name}</h4>
                      <p className="text-sm text-gray-600">{pt.email}</p>
                      <p className="text-sm text-gray-600">{pt.phone}</p>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Lease Start:</span>
                          <p className="text-gray-800">{new Date(pt.lease_start).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Lease End:</span>
                          <p className="text-gray-800">
                            {pt.lease_end ? new Date(pt.lease_end).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Rent:</span>
                          <p className="text-gray-800">${pt.rent_amount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            pt.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveTenant(pt.tenant_id)}
                      className="ml-4 px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assign Tenant Form */}
        {showAssignForm && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Assign New Tenant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Tenant
                </label>
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a tenant...</option>
                  {availableTenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lease Start Date *
                  </label>
                  <input
                    type="date"
                    value={leaseData.lease_start}
                    onChange={(e) => setLeaseData({ ...leaseData, lease_start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lease End Date
                  </label>
                  <input
                    type="date"
                    value={leaseData.lease_end}
                    onChange={(e) => setLeaseData({ ...leaseData, lease_end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rent Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={leaseData.rent_amount}
                    onChange={(e) => setLeaseData({ ...leaseData, rent_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={leaseData.status}
                    onChange={(e) => setLeaseData({ ...leaseData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignForm(false);
                    setSelectedTenant('');
                    setLeaseData({
                      lease_start: '',
                      lease_end: '',
                      rent_amount: '',
                      status: 'Active'
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTenant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Assigning...' : 'Assign Tenant'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTenantManagement;
