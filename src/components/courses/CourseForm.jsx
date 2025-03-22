import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function CourseForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name) {
      errors.name = 'Ders adı zorunludur';
    }

    if (!data.content) {
      errors.content = 'Ders içeriği zorunludur';
    }

    return errors;
  };

  const onSubmit = async (data) => {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post('http://localhost:3001/courses', data);
        reset();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error creating course:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Ders Adı
        </label>
        <div className="mt-1">
          <input
            type="text"
            {...register('name')}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Ders İçeriği
        </label>
        <div className="mt-1">
          <textarea
            {...register('content')}
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ders Ekle
        </button>
      </div>
    </form>
  );
} 