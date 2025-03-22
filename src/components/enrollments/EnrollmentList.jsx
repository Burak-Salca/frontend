import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/students/profile/myCourses');
      setEnrollments(response.data.data || []);
      setError(null);
    } catch (error) {
      setError('Kayıt listesi yüklenirken bir hata oluştu');
      console.error('Error fetching enrollments:', error);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/courses/available');
      setAvailableCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching available courses:', error);
      setAvailableCourses([]);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    if (user?.role === 'student') {
      fetchAvailableCourses();
    }
  }, [user?.role]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`http://localhost:3001/students/profile/courses/${courseId}`);
      await fetchEnrollments();
      await fetchAvailableCourses();
      alert('Derse başarıyla kayıt oldunuz!');
    } catch (error) {
      setError('Derse kayıt olurken bir hata oluştu');
      console.error('Error enrolling to course:', error);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (window.confirm('Bu dersten kaydınızı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/students/profile/courses/${courseId}`);
        await fetchEnrollments();
        await fetchAvailableCourses();
        alert('Ders kaydınız başarıyla silindi!');
      } catch (error) {
        setError('Ders kaydı silinirken bir hata oluştu');
        console.error('Error unenrolling from course:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kayıtlı Derslerim</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {user?.role === 'student' && availableCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kayıt Olabileceğim Dersler</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {availableCourses.map((course) => (
                <li key={course.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {course?.name || 'İsimsiz Ders'}
                      </h3>
                      <p className="text-sm text-gray-500">{course?.content || 'İçerik bulunmamaktadır.'}</p>
                    </div>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Kayıt Ol
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {enrollments && enrollments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {enrollments.map((enrollment) => {
              const courseName = enrollment?.name || enrollment?.course?.name || 'İsimsiz Ders';
              const courseContent = enrollment?.content || enrollment?.course?.content || 'İçerik bulunmamaktadır.';
              const courseId = enrollment?.id || enrollment?.course?.id;

              return (
                <li key={courseId} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{courseName}</h3>
                      <p className="text-sm text-gray-500">{courseContent}</p>
                    </div>
                    <button
                      onClick={() => handleUnenroll(courseId)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Kaydı Sil
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Henüz kayıtlı ders bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
} 