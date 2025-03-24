import { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorMap from '../../components/ErrorMap';

export default function CourseForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  });
  const [errors, setErrors] = useState([]);

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
    setErrors([]);

    try {
      if (initialData?.id) {
        await axios.put(`http://localhost:3001/courses/${initialData.id}`, formData);
      } else {
        await axios.post('http://localhost:3001/courses', formData);
      }
      onSuccess();
    } catch (err) {
      console.error('Course form error:', err);
      
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
      <form onSubmit={handleSubmit}>
        
        <ErrorMap errors={errors} />
        
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