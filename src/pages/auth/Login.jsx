import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useState } from 'react';
import { catchError } from '../../utils/CatchError';
import ErrorMap from '../../components/ErrorMap';

export default function Login() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { login, isAuthenticated } = authContext;
  const [error, setError] = useState([]);
  

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value
    };

    if (!formData.role) {
      setError(['Rol seçimi zorunludur']);
      return;
    }

    try {
      await login(formData.email, formData.password, formData.role);
      navigate('/profile');
    } catch (err) {
      catchError(err, setError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesabınıza giriş yapın
          </h2>

          <ErrorMap errors={error} />

        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email adresi</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue="Deneme1@hotmail.com"//Sonra kaldırılcaklar 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                defaultValue="Deneme1*" //Sonra kaldırılcaklar
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">Rol</label>
              <select
                id="role"
                name="role"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Rol seçiniz</option>
                <option value="admin">Admin</option>
                <option value="student">Öğrenci</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Giriş Yap
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Hesabınız yok mu? Kayıt olun
          </Link>
        </div>
      </div>
    </div>
  );
} 