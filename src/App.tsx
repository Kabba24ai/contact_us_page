import { Phone, MessageCircle, MapPin } from 'lucide-react';

function App() {
  const locations = [
    {
      name: "Rent 'n King - Bon Aqua",
      address: '10296 Highway 46',
      city: 'Bon Aqua, TN 37055',
      phone: '6158156734',
      phoneDisplay: '(615) 815-6734',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3227.8!2d-87.35!3d35.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDU3JzAwLjAiTiA4N8KwMjEnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus',
      description: 'Full service location with walk-in, phone & turnkey delivery immediately available',
    },
    {
      name: "Rent 'n King - Waverly",
      address: 'Highway 70',
      city: 'Waverly, TN 37185',
      phone: '6158156734',
      phoneDisplay: '(615) 815-6734',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204374.4!2d-87.4!3d36.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88648670c5b06391%3A0x670045f9e4ba6e51!2sClarksville%2C%20TN!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus',
      description: 'Full service location with walk-in, phone & turnkey delivery immediately available',
    },
  ];

  const handleTextClick = (phone: string) => {
    window.open(`sms:${phone}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl text-slate-700 mb-3 font-medium">
              Speak with a human - No frustrating menus and bots
            </p>
            <p className="text-sm text-slate-500 italic whitespace-nowrap">
              (We might be on the phone with others when you call, but we'll always call you back as quickly as possible)
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {locations.map((location) => (
            <div key={location.name} className="flex flex-col space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">{location.name}</h2>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                <div className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{location.address}</p>
                      <p className="text-lg text-slate-700">{location.city}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <a
                      href={`tel:${location.phone}`}
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{location.phoneDisplay}</span>
                    </a>

                    <button
                      onClick={() => handleTextClick(location.phone)}
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors border-2 border-slate-300"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Click to Text</span>
                    </button>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <p className="text-blue-900 font-medium">{location.description}</p>
                  </div>
                </div>

                <div className="relative h-96">
                  <iframe
                    src={location.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${location.name} location map`}
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
