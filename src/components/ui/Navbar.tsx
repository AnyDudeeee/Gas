import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const { config } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Clientes',
      path: '/clientes',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Certificados',
      path: '/certificados',
      icon: <FileCheck className="h-5 w-5" />
    },
    {
      name: 'Configuración',
      path: '/configuracion',
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 p-4">
          <h1 className="text-lg font-bold text-blue-600">{config.empresa.nombre}</h1>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          <ul className="flex flex-col py-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                    location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center text-gray-600 hover:text-blue-600 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Cerrar sesión</span>
          </button>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
          <h1 className="text-lg font-bold text-blue-600">{config.empresa.nombre}</h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white pt-16">
            <ul className="flex flex-col py-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                      location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.icon}
                    <span className="ml-3 text-lg">{item.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => { closeMobileMenu(); logout(); }}
                  className="flex items-center px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3 text-lg">Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;