import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function StudentMap({ 
  students, 
  onDeleteStudent, 
  onView, 
  showViewButton = false,
  emptyMessage = "Henüz öğrenci bulunmamaktadır."
}) {
  const { user } = useContext(AuthContext);

  if (!students || students.length === 0) {
    return (
      <div className="px-4 py-5">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
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
              {user?.type === 'admin' && showViewButton && (
                <button
                  onClick={() => onView(student.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Görüntüle
                </button>
              )}
              {user?.type === 'admin' && (
                <button
                  onClick={() => onDeleteStudent(student.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sil
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 