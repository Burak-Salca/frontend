import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';
import EditStudentForm from './EditStudentForm';
import { useNavigate } from 'react-router-dom';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/students');
      setStudents(response.data.data || []);
      setError(null);
    } catch (error) {
      setError('Öğrenci listesi yüklenirken bir hata oluştu');
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3001/students/${id}`);
        await fetchStudents();
        alert('Öğrenci başarıyla silindi!');
      } catch (error) {
        setError('Öğrenci silinirken bir hata oluştu');
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchStudents();
  };

  const handleEditSuccess = () => {
    setEditingStudent(null);
    fetchStudents();
  };

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci Listesi</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showAddForm ? 'İptal' : 'Öğrenci Ekle'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-3xl">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={() => setEditingStudent(null)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Kapat</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <EditStudentForm
              student={editingStudent}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingStudent(null)}
            />
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="mb-6">
          <StudentForm onSuccess={handleAddSuccess} />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {students && students.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewStudent(student.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Görüntüle
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Henüz öğrenci bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
} 