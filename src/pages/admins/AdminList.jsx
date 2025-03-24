import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import AdminForm from './AdminForm';
import ErrorMap from '../../components/ErrorMap';
import AdminMap from '../../components/AdminMap';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admins');
      // Giriş yapan admin'i listeden çıkar
      const filteredAdmins = response.data.data.filter(admin => admin.id !== user.id);
      setAdmins(filteredAdmins || []);
      setError([]);
    } catch (err) {
      console.error('Admin list hatası:', err);
      
      if (err.response?.data?.data) {
        const allErrors = [];
        for (const error of err.response.data.data) {
          for (const message of error.errors) {
            allErrors.push(message);
          }
        }
        setError(allErrors);
      } else if (err.response?.data?.message) {
        setError([err.response.data.message]);
      } else {
        setError(['Bir hata oluştu. Lütfen tekrar deneyin.']);
      }
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [user.id]);

  const handleDelete = async (id) => {
    if (window.confirm('Bu admini silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/admins/${id}`);
        setSuccess('Admin başarıyla silindi');
        await fetchAdmins();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Admin list delete error:', err);
        
        if (err.response?.data?.data) {
          const allErrors = [];
          for (const error of err.response.data.data) {
            for (const message of error.errors) {
              allErrors.push(message);
            }
          }
          setError(allErrors);
        } else if (err.response?.data?.message) {
          setError([err.response.data.message]);
        } else {
          setError(['Bir hata oluştu. Lütfen tekrar deneyin.']);
        }
      }
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchAdmins();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Listesi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Admin Ekle
        </button>
      </div>

      <ErrorMap errors={error} />

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
          {success}
        </div>
      )}

      {showForm && <AdminForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <AdminMap 
          admins={admins}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
} 