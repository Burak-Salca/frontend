import { useState, useEffect } from 'react';
import axios from 'axios';
import { catchError } from '../../utils/CatchError';
import ErrorMap from '../../components/ErrorMap';
import StudentCourseMap from '../../components/StudentCourseMap';

export default function StudentCourseList() {
  const [relations, setRelations] = useState([]);
  const [error, setError] = useState(null);

  const fetchRelations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students/admin/student-course-relations');
      setRelations(response.data.data || []);
    } catch (err) {
      catchError(err, setError);
    }
  };

  useEffect(() => {
    fetchRelations();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci-Ders Listesi</h1>
      </div>

      <ErrorMap errors={error} />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <StudentCourseMap relations={relations} />
        </div>
      </div>
    </div>
  );
} 