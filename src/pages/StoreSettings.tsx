import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import HoursEditor from '../components/HoursEditor';
import { MapPin, Phone, Mail, Info, Building2, Globe, Save, CheckCircle2 } from 'lucide-react';

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
  const [showHoursEditor, setShowHoursEditor] = useState(false);

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
          store_name: data.store_name || locationId.charAt(0).toUpperCase() + locationId.slice(1),
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

  const handleInputChange = (field: keyof StoreData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  const validateForm = (): boolean => {
    if (!formData.store_name.trim()) {
      setMessage({ type: 'error', text: 'Store name is required' });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Valid email is required' });
      return false;
    }
    if (!formData.phone.trim()) {
      setMessage({ type: 'error', text: 'Phone number is required' });
      return false;
    }
    if (!formData.address.trim()) {
      setMessage({ type: 'error', text: 'Address is required' });
      return false;
    }
    return true;
  };

  const saveStore = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setMessage(null);

    try {
      const storeRecord = {
        location: formData.location_id,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            Store Settings
          </h1>
          <p className="mt-2 text-slate-600">
            Manage store information and operating hours
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="store-select" className="block text-sm font-medium text-slate-700 mb-2">
            Select Store
          </label>
          <select
            id="store-select"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
          >
            {stores.map((store) => (
              <option key={store.location_id} value={store.location_id}>
                {store.store_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Basic Information</h3>
              <hr className="mb-6 border-gray-300" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="store_name" className="block mb-2 text-sm font-medium text-gray-700">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="store_name"
                    value={formData.store_name}
                    onChange={(e) => handleInputChange('store_name', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    placeholder="Enter store name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                      placeholder="(xxx) xxx-xxxx"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                      placeholder="store@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-700">
                    Details
                  </label>
                  <input
                    type="text"
                    id="details"
                    value={formData.details}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    placeholder="Enter any additional details about the store"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Store Address
              </h3>
              <hr className="mb-6 border-gray-300" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-4">
                  <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    required
                  >
                    <option value="">Select State</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="zip_code" className="block mb-2 text-sm font-medium text-gray-700">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    placeholder="12345"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                      placeholder="USA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="latitude" className="block mb-2 text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    placeholder="36.085351"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block mb-2 text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500"
                    placeholder="-87.759946"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Store Settings</h3>
              <hr className="mb-6 border-gray-300" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Store Designation
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="is_primary"
                        checked={formData.is_primary}
                        onChange={() => handleInputChange('is_primary', true)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">Primary Store</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="is_primary"
                        checked={!formData.is_primary}
                        onChange={() => handleInputChange('is_primary', false)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">Alternate Store</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Store Status
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange('status', formData.status === 'Active' ? 'Inactive' : 'Active')
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        formData.status === 'Active' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                          formData.status === 'Active' ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      ></span>
                    </button>
                    <span className="text-sm text-gray-800">{formData.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={saveStore}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Store Settings
                </>
              )}
            </button>

            <button
              onClick={() => setShowHoursEditor(!showHoursEditor)}
              className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition shadow-lg"
            >
              {showHoursEditor ? 'Hide' : 'Edit'} Hours of Operation
            </button>
          </div>

          {showHoursEditor && (
            <div className="mt-6">
              <HoursEditor locationId={selectedStore} locationName={formData.store_name} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
