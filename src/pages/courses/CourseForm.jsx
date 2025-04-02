import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import ErrorMap from '../../components/ErrorMap';
import { catchError } from '../../utils/CatchError';

export default function CourseForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  });
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        content: initialData.content || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await axios.put(`/courses/${initialData.id}`, formData);
        setSuccess('Ders başarıyla güncellendi');
      } else {
        await axios.post('/courses', formData);
        setSuccess('Ders başarıyla oluşturuldu');
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
    <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit}>

        <ErrorMap errors={error} />
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Ders Adı
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            İçerik
          </label>
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
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