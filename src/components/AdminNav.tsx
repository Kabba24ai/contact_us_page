import { Link, useLocation } from 'react-router-dom';
import { Home, Building2 } from 'lucide-react';

export default function AdminNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="text-2xl">🏠</span>
              Rent 'n King
            </Link>

            <div className="flex gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                Contact Page
              </Link>

              <Link
                to="/admin/store-settings"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin/store-settings')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Store Management
          </div>
        </div>
      </div>
    </nav>
  );
}
