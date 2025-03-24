import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { catchError } from '../../utils/CatchError';
export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const navigation = [
    { name: 'Öğrenciler', href: '/students', roles: ['admin'] },
    { name: 'Adminler', href: '/admins', roles: ['admin'] },
    { name: 'Dersler', href: '/courses', roles: ['admin', 'student'] },
    { name: 'Kayıtlar', href: '/enrollments', roles: ['student'] },
    { name: 'Öğrenci-Ders Listesi', href: '/student-courses', roles: ['admin'] },
    { name: 'Profilim', href: '/profile', roles: ['admin', 'student'] },
  ].filter(item => item.roles.includes(user?.type));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (location.pathname === '/') {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/auth/logout');
      logout();
      navigate('/login');
    } catch (error) {
      catchError(error, setError);
      logout();
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <UserCircleIcon className="h-8 w-8 text-indigo-600" />
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={
                    location.pathname === item.href
                      ? "text-indigo-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 