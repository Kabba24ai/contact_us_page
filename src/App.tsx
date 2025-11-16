import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContactPage from './pages/ContactPage';
import StoreSettings from './pages/StoreSettings';
import StoreHoursAdmin from './pages/StoreHoursAdmin';
import AdminNav from './components/AdminNav';

function App() {
  return (
    <BrowserRouter>
      <AdminNav />
      <Routes>
        <Route path="/" element={<ContactPage />} />
        <Route path="/admin/store-settings" element={<StoreSettings />} />
        <Route path="/admin/store-hours" element={<StoreHoursAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
