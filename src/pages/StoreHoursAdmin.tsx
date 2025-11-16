import { useState } from 'react';
import HoursEditor from '../components/HoursEditor';

export default function StoreHoursAdmin() {
  const [selectedLocation, setSelectedLocation] = useState('bonaqua');

  const locations = [
    { id: 'bonaqua', name: 'Bon Aqua' },
    { id: 'waverly', name: 'Waverly' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Store Hours Management</h1>
          <p className="mt-2 text-slate-600">
            Manage operating hours for all Rent 'n King locations
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
            Select Store Location
          </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <HoursEditor
          key={selectedLocation}
          locationId={selectedLocation}
          locationName={locations.find((l) => l.id === selectedLocation)?.name || ''}
        />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Important Notes</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Changes are immediately reflected on the contact page</li>
                <li>Use 24-hour format for time entry (will display as 12-hour format)</li>
                <li>Quick copy buttons help maintain consistency across multiple days</li>
                <li>Hours are stored securely in the database</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
