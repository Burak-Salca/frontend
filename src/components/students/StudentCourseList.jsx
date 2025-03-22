import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentCourseList() {
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRelations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/students/admin/student-course-relations');
      setRelations(response.data.data || []);
      setError(null);
    } catch (error) {
      setError('Öğrenci-ders eşleşmeleri yüklenirken bir hata oluştu');
      console.error('Error fetching relations:', error);
      setRelations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelations();
  }, []);

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci-Ders Listesi</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ders Adı
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {relations.map((relation, index) => (
                  <tr key={`${relation.studentId}-${relation.courseId}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {relation.studentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {relation.courseName}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 