import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseForm from './CourseForm';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/courses/${id}`);
      setCourse(response.data.data);
    } catch (error) {
      setError('Ders bilgileri yüklenirken bir hata oluştu');
      console.error('Error fetching course:', error);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/courses/${id}/students`);
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCourse();
      await fetchEnrolledStudents();
    };
    fetchData();
  }, [id]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchCourse();
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Ders Detayları</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Düzenle
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Geri Dön
          </button>
        </div>
      </div>

      {showEditForm ? (
        <CourseForm
          initialData={course}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditForm(false)}
        />
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Ders Bilgileri</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ders Adı</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {course?.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">İçerik</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {course?.content}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Kayıtlı Öğrenciler</h3>
            </div>
            <div className="border-t border-gray-200">
              {students.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <li key={student.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Bu derse henüz kayıtlı öğrenci bulunmamaktadır.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 