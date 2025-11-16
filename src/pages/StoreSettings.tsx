import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import HoursEditor from '../components/HoursEditor';
import { Check, Plus, ExternalLink } from 'lucide-react';

interface StoreData {
  id?: string;
  store_name: string;
  phone: string;
  email: string;
  details: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: string;
  longitude: string;
  is_primary: boolean;
  status: 'Active' | 'Inactive';
  location_id: string;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const INITIAL_STORE_DATA: StoreData = {
  store_name: '',
  phone: '',
  email: '',
  details: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  country: 'USA',
  latitude: '',
  longitude: '',
  is_primary: false,
  status: 'Active',
  location_id: ''
};

export default function StoreSettings() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [formData, setFormData] = useState<StoreData>(INITIAL_STORE_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      loadStoreData(selectedStore);
    }
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('location, id')
        .order('location');

      if (error) throw error;

      if (data) {
        const storeList = data.map(store => ({
          ...INITIAL_STORE_DATA,
          id: store.id,
          location_id: store.location,
          store_name: store.location.charAt(0).toUpperCase() + store.location.slice(1)
        }));
        setStores(storeList);

        if (storeList.length > 0) {
          setSelectedStore(storeList[0].location_id);
        }
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStoreData = async (locationId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('location', locationId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          id: data.id,
          store_name: data.store_name || '',
          phone: data.phone || '',
          email: data.email || '',
          details: data.details || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          country: data.country || 'USA',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          is_primary: data.is_primary || false,
          status: data.status || 'Active',
          location_id: locationId
        });
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StoreData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  const saveStore = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const storeRecord = {
        location: selectedStore,
        store_name: formData.store_name,
        phone: formData.phone,
        email: formData.email,
        details: formData.details,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude,
        is_primary: formData.is_primary,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('store_settings')
        .upsert(storeRecord, {
          onConflict: 'location'
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Store updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving store:', error);
      setMessage({ type: 'error', text: 'Failed to save store. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !selectedStore) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Store</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Info</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.store_name}
                  onChange={(e) => handleInputChange('store_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Waverly"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(615) 815-6734"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sales@RentnKing.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details
              </label>
              <input
                type="text"
                value={formData.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Full service location with walk-in, phone & turnkey delivery immediately available"
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-6 mt-8">Store Address</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1004 US-70"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Waverly"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="37185"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="USA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="36.085351"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="-87.759946"
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-6 mt-8">Store Settings</h2>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Store Designation <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="is_primary"
                      checked={formData.is_primary}
                      onChange={() => handleInputChange('is_primary', true)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Primary Store</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="is_primary"
                      checked={!formData.is_primary}
                      onChange={() => handleInputChange('is_primary', false)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Alternate Store</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Store Status <span className="text-red-500">*</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.status === 'Active'}
                      onChange={(e) => handleInputChange('status', e.target.checked ? 'Active' : 'Inactive')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">{formData.status}</span>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <HoursEditor locationId={selectedStore} locationName={formData.store_name} />
            </div>

            <div className="flex justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={saveStore}
                disabled={saving}
                className="inline-flex items-center px-5 py-2.5 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </button>

              <button
                onClick={saveStore}
                disabled={saving}
                className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save & New
              </button>

              <button
                onClick={saveStore}
                disabled={saving}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
