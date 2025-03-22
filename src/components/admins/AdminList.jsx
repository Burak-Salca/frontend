import { useState, useEffect } from 'react';
import axios from 'axios';
import EditAdminForm from './EditAdminForm';
import AdminForm from './AdminForm';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const fetchAdmins = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/admins?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setAdmins(response.data.data || []);
      setTotalPages(Math.ceil((response.data.total || 0) / ITEMS_PER_PAGE));
      setError(null);
    } catch (error) {
      setError('Admin listesi yüklenirken bir hata oluştu');
      console.error('Error fetching admins:', error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('Bu admini silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/admins/${id}`);
        await fetchAdmins(currentPage);
        alert('Admin başarıyla silindi!');
      } catch (error) {
        setError('Admin silinirken bir hata oluştu');
        console.error('Error deleting admin:', error);
      }
    }
  };

  const handleEditSuccess = () => {
    setEditingAdmin(null);
    fetchAdmins(currentPage);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchAdmins();
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Listesi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Admin Oluştur
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-md">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Kapat</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Yeni Admin Oluştur</h3>
              <AdminForm onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}

      {editingAdmin && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-3xl">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={() => setEditingAdmin(null)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Kapat</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <EditAdminForm
              admin={editingAdmin}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingAdmin(null)}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {admins && admins.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <li key={admin.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {admin.firstName} {admin.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingAdmin(admin)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Henüz admin bulunmamaktadır.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 