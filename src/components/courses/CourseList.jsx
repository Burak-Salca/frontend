import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import CourseForm from './CourseForm';
import { useNavigate } from 'react-router-dom';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/courses');
      setCourses(response.data.data || []);
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
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/courses/${id}`);
        await fetchCourses();
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
    fetchCourses();
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ders Listesi</h1>
        {user?.type === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Ders Ekle
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {showForm && <CourseForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {courses && courses.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => (
              <li key={course.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {course.name || 'İsimsiz Ders'}
                    </h3>
                    <p className="text-sm text-gray-500">{course.content || 'İçerik bulunmamaktadır.'}</p>
                  </div>
                  <div className="flex space-x-2">
                    {user?.type === 'student' && (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Kayıt Ol
                      </button>
                    )}
                    {user?.type === 'admin' && (
                      <>
                        <button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Görüntüle
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Henüz ders bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
} 