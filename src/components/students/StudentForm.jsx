import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function StudentForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.firstName) {
      errors.firstName = 'Ad alanı zorunludur';
    }

    if (!data.lastName) {
      errors.lastName = 'Soyad alanı zorunludur';
    }

    if (!data.email) {
      errors.email = 'Email alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Geçerli bir email adresi giriniz';
    }

    if (!data.password) {
      errors.password = 'Şifre alanı zorunludur';
    } else if (data.password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    return errors;
  };

  const onSubmit = async (data) => {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post('http://localhost:3001/students', data);
        reset();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error creating student:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          Ad
        </label>
        <div className="mt-1">
          <input
            type="text"
            {...register('firstName')}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Soyad
        </label>
        <div className="mt-1">
          <input
            type="text"
            {...register('lastName')}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            {...register('email')}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Şifre
        </label>
        <div className="mt-1">
          <input
            type="password"
            {...register('password')}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Öğrenci Ekle
        </button>
      </div>
    </form>
  );
} 