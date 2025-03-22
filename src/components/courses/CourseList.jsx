import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import CourseForm from './CourseForm';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const fetchCourses = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/courses?page=${page}`);
      console.log('Courses response:', response.data);
      setCourses(response.data.data || []);
      setTotalPages(Math.ceil((response.data.total || 0) / 10));
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Dersler yüklenirken bir hata oluştu.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/courses/${id}`);
        await fetchCourses(currentPage);
        alert('Ders başarıyla silindi!');
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Ders silinirken bir hata oluştu.');
      }
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`http://localhost:3001/students/profile/courses/${courseId}`);
      alert('Derse başarıyla kayıt oldunuz!');
    } catch (err) {
      console.error('Error enrolling to course:', err);
      setError('Derse kayıt olurken bir hata oluştu.');
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchCourses(currentPage);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Ders Listesi</h1>
        </div>
        {user?.type === 'admin' && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Ders Ekle
            </button>
          </div>
        )}
      </div>

      {showForm && <CourseForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Ders Adı
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      İçerik
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {course.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{course.content}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {user?.type === 'admin' ? (
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Sil
                          </button>
                        ) : user?.type === 'student' ? (
                          <button
                            onClick={() => handleEnroll(course.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Kayıt Ol
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
} 