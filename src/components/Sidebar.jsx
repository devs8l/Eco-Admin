// components/Sidebar.jsx
import { Link } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Hamburger Button (fixed outside sidebar) */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-800 text-white transition-all ${isOpen ? 'opacity-0' : 'opacity-100'
          }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 w-64 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out ${isOpen ? 'left-0' : '-left-full'
          } md:left-0`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-bold">EcoHoliday Admin</h2>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/forms"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                Forms Data
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reels"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                Reels Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/packages"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                Packages Data
              </Link>
            </li>
            <li>
              <Link
                to="/admin/room-images"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                Room Images
              </Link>
            </li>
            <li>
              <Link
                to="/admin/gallery"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                Gallery
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;