import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentForm from './StudentForm';
import { AuthContext } from '../../contexts/AuthContext';
import CourseMap from '../../components/CourseMap';
import ErrorMap from '../../components/ErrorMap';
import CourseSelector from '../../components/CourseSelector';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user } = useContext(AuthContext);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/students/${id}`);
      setStudent(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Student detail hatası:', err);
      
      if (err.response?.data?.data) {
        const allErrors = [];
        for (const error of err.response.data.data) {
          for (const message of error.errors) {
            allErrors.push(message);
          }
        }
        setError(allErrors);
      } else if (err.response?.data?.message) {
        setError([err.response.data.message]);
      } else {
        setError(['Bir hata oluştu. Lütfen tekrar deneyin.']);
      }
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/courses');
      setAvailableCourses(response.data.data || []);
    } catch (err) {
      console.error('Student detail hatası:', err);
      
      if (err.response?.data?.data) {
        const allErrors = [];
        for (const error of err.response.data.data) {
          for (const message of error.errors) {
            allErrors.push(message);
          }
        }
        setError(allErrors);
      } else if (err.response?.data?.message) {
        setError([err.response.data.message]);
      } else {
        setError(['Bir hata oluştu. Lütfen tekrar deneyin.']);
      }
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchAvailableCourses();
  }, [id]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchStudent();
  };

  const handleAddCourse = async () => {
    if (!selectedCourse) return;

    try {
      await axios.post(`http://localhost:3001/students/${id}/admin/courses/${selectedCourse}`);
      setSelectedCourse('');
      fetchStudent();
    } catch (err) {
      console.error('Student detail hatası:', err);
      
      if (err.response?.data?.data) {
        const allErrors = [];
        for (const error of err.response.data.data) {
          for (const message of error.errors) {
            allErrors.push(message);
          }
        }
        setError(allErrors);
      } else if (err.response?.data?.message) {
        setError([err.response.data.message]);
      } else {
        setError(['Bir hata oluştu. Lütfen tekrar deneyin.']);
      }
    }
  };

  const handleRemoveCourse = async (courseId) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/students/${id}/admin/courses/${courseId}`);
        fetchStudent();
      } catch (err) {
        console.error('Student detail hatası:', err);
        
        if (err.response?.data?.data) {
          const allErrors = [];
          for (const error of err.response.data.data) {
            for (const message of error.errors) {
              allErrors.push(message);
            }
          }
          setError(allErrors);
        } else if (err.response?.data?.message) {
          setError([err.response.data.message]);
        } else {
          setError(['Bir hata oluştu. Lütfen tekrar deneyin.']);
        }
      }
    }
  };

  <ErrorMap errors={error} />

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
            onClick={() => setShowEditForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Düzenle
          </button>
          <button
            onClick={() => navigate('/admins')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Geri Dön
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
              <CourseSelector
                selectedCourse={selectedCourse}
                availableCourses={availableCourses}
                onCourseSelect={(value) => setSelectedCourse(value)}
                onAddCourse={handleAddCourse}
              />
            )}
            <CourseMap 
              courses={student.courses || []}
              user={user}
              onDelete={handleRemoveCourse}
              showViewButton={false}
              emptyMessage="Henüz kayıtlı ders bulunmamaktadır."
            />
          </div>
        </div>
      )}
    </div>
  );
} 