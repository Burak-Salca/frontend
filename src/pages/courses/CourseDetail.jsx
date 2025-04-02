import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import CourseForm from './CourseForm';
import ErrorMap from '../../components/ErrorMap';
import StudentMap from '../../components/StudentMap';
import { catchError } from '../../utils/CatchError';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [emptyMessage, setEmptyMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/courses/${id}`);
      setCourse(response.data.data);
      setError(null);
    } catch (err) {
      catchError(err, setError);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/courses/${id}/students`);
      setStudents(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setStudents([]);
        setEmptyMessage(error.response.data.message);
      } else {
        catchError(error, setError);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCourse();
      await fetchEnrolledStudents();
    };
    fetchData();
  }, [id]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchCourse();
  };

  const handleAddStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      await axios.post(`/courses/${id}/admin/students/${selectedStudent}`);
      setSuccess('Öğrenci derse başarıyla eklendi');
      setError([]);
      setSelectedStudent('');
      await fetchCourse();
      
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

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Bu öğrenciyi dersten çıkarmak istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/courses/${id}/admin/students/${studentId}`);
        setSuccess('Öğrenci dersten başarıyla çıkarıldı');
        setError([]);
        await fetchCourse();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError([err.response?.data?.message || 'Bir hata oluştu']);
        setTimeout(() => {
          setError([]);
        }, 3000);
      }
    }
  };

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

      <ErrorMap errors={error} />

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
          {success}
        </div>
      )}

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
                    {course?.content }
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Kayıtlı Öğrenciler</h3>
            </div>
            <StudentMap 
              students={students}
              onDeleteStudent={handleRemoveStudent}
              showViewButton={false}
              emptyMessage={emptyMessage}
            />
          </div>
        </>
      )}
    </div>
  );
} 