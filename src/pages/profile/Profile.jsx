import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ProfileForm from './ProfileForm';

export default function Profile() {
  const authContext = useContext(AuthContext);
  const { user, setUser } = authContext;
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSuccess = (updatedData) => {
    setUser({
      ...user,
      ...updatedData,
    });
    setSuccess(true);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSuccess(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Bilgilerim</h1>

      {success && (
        <div className="space-y-6 bg-green-50 text-green-800 p-4 rounded-md mb-4">
          Profil başarıyla güncellendi!
        </div>
      )}

      {!showForm ? (
        <div className="space-y-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Kişisel Bilgiler</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Ad</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.firstName}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Soyad</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.lastName}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Profil Bilgilerimi Güncelle
            </button>
          </div>
        </div>
      ) : (
        <ProfileForm
          initialData={user}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
} 