import { useState } from 'react';
import axios from '../../utils/axios';
import ErrorMap from '../../components/ErrorMap';
import { catchError } from '../../utils/CatchError';
export default function StudentForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      
      // Şifre boş ise request body'den çıkar
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      if (initialData) {
        await axios.put(`/students/${initialData.id}`, dataToSend);
        setSuccess('Öğrenci başarıyla güncellendi');
      } else {
        await axios.post('/students', dataToSend);
        setSuccess('Öğrenci başarıyla oluşturuldu');
      }
      setError([]);
      onSuccess();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError([err.response?.data?.message || 'Bir hata oluştu']);
      setTimeout(() => {
        setError([]);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <ErrorMap errors={error} />

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          Ad
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Soyad
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-posta
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {initialData ? 'Şifre (Boş bırakırsanız değişmeyecektir)' : 'Şifre'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            İptal
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {initialData ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </form>
  );
} 