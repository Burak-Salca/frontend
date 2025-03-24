import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import CourseForm from './CourseForm';
import ErrorMap from '../../components/ErrorMap';
import CourseMap from '../../components/CourseMap';
import { catchError } from '../../utils/CatchError';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const authContext = useContext(AuthContext);
  const { user } = authContext; // Usera göre işlem yapılacak 
 

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/courses');
      setCourses(response.data.data || []);
      setError([]);
    } catch (err) {
      catchError(err, setError);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  //Adminin kullancağı fonksiyon 
  const handleDelete = async (id) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/courses/${id}`);
        await fetchCourses();
        alert('Ders başarıyla silindi!');
      } catch (err) {
        catchError(err, setError);
      }
    }
  };

  //Öğrencinin kullancağı fonksiyon 
  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`http://localhost:3001/students/profile/courses/${courseId}`);
      alert('Derse başarıyla kayıt oldunuz!');
    } catch (err) {
      catchError(err, setError);
    }
  };

  //Ders create etme için kullanılacak fonksiyon 
  const handleSuccess = () => {
    setShowForm(false);
    fetchCourses();
  };

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

      <ErrorMap errors={error} />

      {showForm && <CourseForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <CourseMap 
          courses={courses}
          user={user}
          onEnroll={handleEnroll}
          onDelete={handleDelete}
          showViewButton={true}
          emptyMessage="Henüz ders bulunmamaktadır."
        />
      </div>
    </div>
  );
} 