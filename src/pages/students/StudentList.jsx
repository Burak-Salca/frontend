import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';
import { useNavigate } from 'react-router-dom';
import StudentMap from '../../components/StudentMap';
import ErrorMap from '../../components/ErrorMap';
import { AuthContext } from '../../contexts/AuthContext';
import { catchError } from '../../utils/CatchError';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students');
      setStudents(response.data.data || []);
    } catch (err) {
      catchError(err, setError);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/students/${id}`);
        fetchStudents();
      } catch (err) {
        catchError(err, setError);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedStudent(null);
    fetchStudents();
  };

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci Listesi</h1>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setShowForm(!showForm);
          }}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showForm ? 'İptal' : 'Öğrenci Ekle'}
        </button>
      </div>

      <ErrorMap errors={error} />

      {showForm && (
        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <StudentForm 
            initialData={selectedStudent} 
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setSelectedStudent(null);
            }}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <StudentMap 
          students={students}
          onDeleteStudent={handleDelete}
          onView={handleViewStudent}
          showViewButton={true}
        />
      </div>
    </div>
  );
} 