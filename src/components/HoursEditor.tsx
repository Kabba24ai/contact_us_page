import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

interface WeekHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface HoursEditorProps {
  locationId: string;
  locationName: string;
  onHoursChange?: (hoursData: WeekHours) => void;
}

const DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const DEFAULT_HOURS: WeekHours = {
  monday: { open: '07:00', close: '17:00', closed: false },
  tuesday: { open: '07:00', close: '17:00', closed: false },
  wednesday: { open: '07:00', close: '17:00', closed: false },
  thursday: { open: '07:00', close: '17:00', closed: false },
  friday: { open: '07:00', close: '17:00', closed: false },
  saturday: { open: '07:00', close: '12:00', closed: false },
  sunday: { open: '', close: '', closed: true },
};

export default function HoursEditor({ locationId, locationName, onHoursChange }: HoursEditorProps) {
  const [hours, setHours] = useState<WeekHours>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHours();
  }, [locationId]);

  // Pass hours data to parent whenever it changes
  useEffect(() => {
    if (onHoursChange && !loading) {
      onHoursChange(hours);
    }
  }, [hours, loading]);

  const loadHours = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('hours_of_operation')
        .eq('location', locationId)
        .maybeSingle();

      if (error) throw error;

      if (data && data.hours_of_operation) {
        setHours(data.hours_of_operation as WeekHours);
      }
    } catch (error) {
      console.error('Error loading hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosedToggle = (dayId: keyof WeekHours) => {
    setHours((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        closed: !prev[dayId].closed,
        open: !prev[dayId].closed ? '' : '09:00',
        close: !prev[dayId].closed ? '' : '17:00',
      },
    }));
  };

  const handleTimeChange = (dayId: keyof WeekHours, field: 'open' | 'close', value: string) => {
    setHours((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value,
      },
    }));
  };

  const applyToWeekdays = () => {
    const mondayHours = { ...hours.monday };
    setHours((prev) => ({
      ...prev,
      tuesday: { ...mondayHours },
      wednesday: { ...mondayHours },
      thursday: { ...mondayHours },
      friday: { ...mondayHours },
    }));
  };

  const applyToAll = () => {
    const mondayHours = { ...hours.monday };
    setHours({
      monday: { ...mondayHours },
      tuesday: { ...mondayHours },
      wednesday: { ...mondayHours },
      thursday: { ...mondayHours },
      friday: { ...mondayHours },
      saturday: { ...mondayHours },
      sunday: { ...mondayHours },
    });
  };

  // Hours are now saved as part of the parent form save
  // This component only manages the hours state

  const formatTime = (time24: string): string => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatHoursDisplay = (dayId: keyof WeekHours): string => {
    const dayHours = hours[dayId];
    if (dayHours.closed) return 'Closed';
    if (!dayHours.open || !dayHours.close) return 'Not Set';
    return `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900">
          Hours of Operation - {locationName}
        </h3>
        <hr className="mb-6 border-gray-300" />

        <div className="space-y-4">
          {DAYS.map((day) => (
            <div key={day.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 sm:col-span-3">
                <label className="text-sm font-medium text-gray-700">{day.label}</label>
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hours[day.id as keyof WeekHours].closed}
                    onChange={() => handleClosedToggle(day.id as keyof WeekHours)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Closed</span>
                </label>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <input
                  type="time"
                  value={hours[day.id as keyof WeekHours].open}
                  onChange={(e) =>
                    handleTimeChange(day.id as keyof WeekHours, 'open', e.target.value)
                  }
                  disabled={hours[day.id as keyof WeekHours].closed}
                  className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 border-gray-300"
                />
              </div>

              <div className="hidden sm:block sm:col-span-1 text-center">
                <span className="text-gray-500">to</span>
              </div>

              <div className="col-span-12 sm:col-span-3">
                <input
                  type="time"
                  value={hours[day.id as keyof WeekHours].close}
                  onChange={(e) =>
                    handleTimeChange(day.id as keyof WeekHours, 'close', e.target.value)
                  }
                  disabled={hours[day.id as keyof WeekHours].closed}
                  className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 border-gray-300"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={applyToWeekdays}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Copy Monday to Weekdays
            </button>
            <button
              onClick={applyToAll}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Copy Monday to All Days
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Preview (as displayed on website):
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {DAYS.map((day) => (
              <div key={day.id} className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{day.label}</span>
                <span className="text-gray-600">
                  {formatHoursDisplay(day.id as keyof WeekHours)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
