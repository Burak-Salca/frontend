import { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorMap from '../../components/ErrorMap';

export default function ProfileForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        password: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      const endpoint = initialData?.type === 'admin' 
        ? `http://localhost:3001/admins/${initialData.id}`
        : 'http://localhost:3001/students/profile/update';
      
      await axios.patch(endpoint, dataToSend);
      onSuccess(dataToSend);
    } catch (err) {
      console.error('Profile update error:', err);
      
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6" noValidate>
    
      <ErrorMap errors={errors} />

      <div>
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

      <div>
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

      <div>
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Şifre {!formData.password && <span className="text-gray-500">(değiştirmek istemiyorsanız boş bırakın)</span>}
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

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          İptal
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
} 