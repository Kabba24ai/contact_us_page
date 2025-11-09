import { Phone, MessageCircle } from 'lucide-react';

interface LocationBlockProps {
  name: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  mapEmbedUrl: string;
  description?: string;
}

export function LocationBlock({ name, address, phone, phoneDisplay, mapEmbedUrl, description }: LocationBlockProps) {
  const handleTextClick = () => {
    window.open(`sms:${phone}`, '_blank');
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
