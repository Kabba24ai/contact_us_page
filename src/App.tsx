import { LocationBlock } from './components/LocationBlock';
import { ContactForm } from './components/ContactForm';

function App() {
  const locations = [
    {
      name: "Rent 'n King - Bon Aqua",
      address: '10296 Highway 46, Bon Aqua, TN 37055',
      phone: '6158156734',
      phoneDisplay: '(615) 815-6734',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3227.8!2d-87.35!3d35.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDU3JzAwLjAiTiA4N8KwMjEnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus',
      description: 'Full service location with walk-in, phone & turnkey delivery immediately available',
      locationKey: 'bon-aqua',
    },
    {
      name: "Rent 'n King - Waverly",
      address: 'Highway 70, Waverly, TN 37185',
      phone: '6158156734',
      phoneDisplay: '(615) 815-6734',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204374.4!2d-87.4!3d36.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88648670c5b06391%3A0x670045f9e4ba6e51!2sClarksville%2C%20TN!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus',
      description: 'Full service location with walk-in, phone & turnkey delivery immediately available',
      locationKey: 'waverly',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl text-gray-700 mb-3 font-medium">
              Speak with a human - No frustrating menus and bots
            </p>
            <p className="text-sm text-gray-500 italic">
              (We might be on the phone with others when you call, but we'll always call you back as quickly as possible)
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {locations.map((location) => (
            <LocationBlock
              key={location.name}
              name={location.name}
              address={location.address}
              phone={location.phone}
              phoneDisplay={location.phoneDisplay}
              mapEmbedUrl={location.mapEmbedUrl}
              description={location.description}
              locationKey={location.locationKey}
            />
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default App;
