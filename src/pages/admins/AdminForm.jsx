import { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorMap from '../../components/ErrorMap';

export default function AdminForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        password: '' // Güvenlik için şifre alanını boş bırakıyoruz
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const dataToSend = { ...formData };
      if (initialData?.id) {
        // Güncelleme işleminde şifre boşsa gönderme
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        await axios.patch(`http://localhost:3001/admins/${initialData.id}`, dataToSend);
      } else {
        await axios.post('http://localhost:3001/admins', dataToSend);
      }
      onSuccess();
    } catch (err) {
      console.error('Admin form error:', err);
      
      if (err.response?.data?.data) {
        const allErrors = [];
        for (const error of err.response.data.data) {
          for (const message of error.errors) {
            allErrors.push(message);
          }
        }
        setErrors(allErrors);
      } else if (err.response?.data?.message) {
        setErrors([err.response.data.message]);
      } else {
        setErrors(['Bir hata oluştu. Lütfen tekrar deneyin.']);
      }
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
    <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit} noValidate>
      
        <ErrorMap errors={errors} />

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-posta
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Ad
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Soyad
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Şifre {initialData && <span className="text-gray-500">(değiştirmek istemiyorsanız boş bırakın)</span>}
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            İptal
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {initialData ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 