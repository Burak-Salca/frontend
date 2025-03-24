import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentForm from './StudentForm';
import { AuthContext } from '../../contexts/AuthContext';
import CourseMap from '../../components/CourseMap';

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

  if (!student) {
    return (
      <div className="text-center text-gray-500">
        Öğrenci bulunamadı.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci Detayları</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/students')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Geri
          </button>
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {showEditForm ? 'İptal' : 'Düzenle'}
          </button>
        </div>
      </div>

      {showEditForm ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <StudentForm
            initialData={student}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Kişisel Bilgiler</h3>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Ad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.firstName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Soyad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.lastName}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Kayıtlı Dersler</h3>
            </div>
            {user?.type === 'admin' && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
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
            <CourseMap 
              courses={student?.courses || []}
              user={user}
              onRemove={handleRemoveCourse}
              showViewButton={false}
              emptyMessage="Henüz kayıtlı ders bulunmamaktadır."
            />
          </div>
        </div>
      )}
    </div>
  );
} 