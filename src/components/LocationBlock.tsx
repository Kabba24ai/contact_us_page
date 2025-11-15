import { Phone, MessageCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface LocationBlockProps {
  name: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  mapEmbedUrl: string;
  description?: string;
  locationKey: string;
}

interface HoursOfOperation {
  [day: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export function LocationBlock({ name, address, phone, phoneDisplay, mapEmbedUrl, description, locationKey }: LocationBlockProps) {
  const [hours, setHours] = useState<HoursOfOperation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('hours_of_operation')
          .eq('location', locationKey)
          .maybeSingle();

        if (error) throw error;
        if (data?.hours_of_operation) {
          setHours(data.hours_of_operation as HoursOfOperation);
        }
      } catch (error) {
        console.error('Error fetching hours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, [locationKey]);

  const handleTextClick = () => {
    window.open(`sms:${phone}`, '_blank');
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold text-red-600 mb-6">{name}</h2>

      {/* Info Card */}
      <div className="bg-gray-100 border-4 border-gray-800 rounded-3xl p-8 mb-6">
        <div className="text-center mb-6">
          <p className="text-red-600 text-xl font-semibold mb-1">{address.split(',')[0]}</p>
          <p className="text-red-600 text-xl font-semibold">{address.split(',').slice(1).join(',').trim()}</p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6" />
            <div>
              <p className="font-bold text-sm uppercase">PHONE</p>
              <a
                href={`tel:${phone}`}
                className="text-lg font-semibold hover:text-blue-600 transition-colors"
              >
                {phoneDisplay}
              </a>
            </div>
          </div>

          <button
            onClick={handleTextClick}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-800 rounded-full hover:bg-gray-200 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">Click to Text</span>
          </button>
        </div>

        {description && (
          <p className="text-red-600 text-center font-medium">
            {description}
          </p>
        )}
      </div>

      {/* Hours of Operation */}
      {!loading && hours && Object.keys(hours).length > 0 && (
        <div className="bg-white border-4 border-gray-800 rounded-3xl p-8 mb-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-800">Hours of Operation</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(hours).map(([day, schedule]) => (
              <div key={day} className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-800">{formatDay(day)}</span>
                <span className="text-gray-700">
                  {schedule.closed ? (
                    <span className="text-red-600 font-medium">Closed</span>
                  ) : (
                    `${formatTime(schedule.open)} - ${formatTime(schedule.close)}`
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div>
        <p className="text-red-600 text-center font-semibold mb-3">Click the Map for Directions</p>
        <div className="border-4 border-gray-300 rounded-2xl overflow-hidden">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${name} location map`}
          />
        </div>
      </div>
    </div>
  );
}
