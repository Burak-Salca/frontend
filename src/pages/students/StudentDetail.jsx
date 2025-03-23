import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditStudentForm from './EditStudentForm';
import { AuthContext } from '../../contexts/AuthContext';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/students/${id}`);
      setStudent(response.data.data);
      setError(null);
    } catch (error) {
      setError('Öğrenci bilgileri yüklenirken bir hata oluştu');
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/courses');
      const allCourses = response.data.data || [];
      const enrolledCourseIds = new Set(student?.courses?.map(c => c.id) || []);
      const availableCourses = allCourses.filter(course => !enrolledCourseIds.has(course.id));
      setAvailableCourses(availableCourses);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  useEffect(() => {
    if (student && user?.type === 'admin') {
      fetchAvailableCourses();
    }
  }, [student, user?.type]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchStudent();
  };

  const handleAddCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      await axios.post(`http://localhost:3001/students/${id}/admin/courses/${selectedCourse}`);
      await fetchStudent();
      await fetchAvailableCourses();
      setSelectedCourse('');
      alert('Ders başarıyla eklendi!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Ders eklenirken bir hata oluştu');
    }
  };

  const handleRemoveCourse = async (courseId) => {
    if (window.confirm('Bu dersi öğrenciden silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/students/${id}/admin/courses/${courseId}`);
        await fetchStudent();
        await fetchAvailableCourses();
        alert('Ders kaydı başarıyla silindi!');
      } catch (error) {
        console.error('Error removing course:', error);
        alert('Ders silinirken bir hata oluştu');
      }
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci Detayları</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/students')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Geri Dön
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Düzenle
          </button>
        </div>
      </div>

      {showEditForm ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <EditStudentForm
            student={student}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Kişisel Bilgiler</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ad</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student?.firstName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Soyad</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student?.lastName}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student?.email}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Kayıtlı Dersler</h3>
            </div>
            <div className="border-t border-gray-200">
              {user?.type === 'admin' && (
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <div className="flex space-x-4">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Ders Seçin</option>
                      {availableCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddCourse}
                      disabled={!selectedCourse}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Ders Ekle
                    </button>
                  </div>
                </div>
              )}
              <div className="px-4 py-5 sm:px-6">
                {student?.courses?.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {student.courses.map((course) => (
                      <li key={course.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{course.name}</h4>
                          <p className="text-sm text-gray-500">{course.content}</p>
                        </div>
                        {user?.type === 'admin' && (
                          <button
                            onClick={() => handleRemoveCourse(course.id)}
                            className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Dersi Sil
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Henüz kayıtlı ders bulunmamaktadır.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 