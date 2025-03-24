import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { catchError } from '../../utils/CatchError';
import ErrorMap from '../../components/ErrorMap';
import CourseMap from '../../components/CourseMap';

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students/profile/myCourses');
      setEnrollments(response.data.data || []);
      setError(null);
    } catch (err) {
      catchError(err, setError);
      setEnrollments([]);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/courses');
      setAvailableCourses(response.data.data || []);
    } catch (err) {
      catchError(err, setError);
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
    } catch (err) {
      catchError(err, setError);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (window.confirm('Bu dersten kaydınızı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/students/profile/courses/${courseId}`);
        await fetchEnrollments();
        await fetchAvailableCourses();
        alert('Ders kaydınız başarıyla silindi!');
      } catch (err) {
        catchError(err, setError);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kayıtlı Derslerim</h1>
      </div>

      <ErrorMap errors={error} />

      {user?.role === 'student' && availableCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kayıt Olabileceğim Dersler</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <CourseMap 
              courses={availableCourses}
              user={{ ...user, type: 'student' }}
              onEnroll={handleEnroll}
              showViewButton={false}
              isEnrolled={false}
              emptyMessage="Kayıt olabileceğiniz ders bulunmamaktadır."
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <CourseMap 
          courses={enrollments}
          user={{ ...user, type: 'student' }}
          onDelete={handleUnenroll}
          showViewButton={false}
          isEnrolled={true}
          emptyMessage="Henüz kayıtlı ders bulunmamaktadır."
        />
      </div>
    </div>
  );
} 