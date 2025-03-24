import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminForm from './AdminForm';
import ErrorMap from '../../components/ErrorMap';

export default function AdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/admins/${id}`);
      setAdmin(response.data.data);
    } catch (error) {
      setErrors(['Admin bilgileri yüklenirken bir hata oluştu']);
      console.error('Error fetching admin:', error);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, [id]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setSuccess('Admin bilgileri başarıyla güncellendi');
    fetchAdmin();
    
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Detayları</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Düzenle
          </button>
          <button
            onClick={() => navigate('/admins')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Geri Dön
          </button>
        </div>
      </div>

      <ErrorMap errors={errors} />

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
          {success}
        </div>
      )}

      {showEditForm ? (
        <AdminForm
          initialData={admin}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditForm(false)}
        />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Bilgileri</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Ad</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {admin?.firstName || 'Yükleniyor...'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Soyad</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {admin?.lastName || 'Yükleniyor...'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {admin?.email || 'Yükleniyor...'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
} 