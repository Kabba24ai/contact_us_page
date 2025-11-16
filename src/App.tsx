import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContactPage from './pages/ContactPage';
import StoreSettings from './pages/StoreSettings';
import AdminNav from './components/AdminNav';

function App() {
  return (
    <BrowserRouter>
      <AdminNav />
      <Routes>
        <Route path="/" element={<ContactPage />} />
        <Route path="/admin/store-settings" element={<StoreSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
