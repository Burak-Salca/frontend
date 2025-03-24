import { useNavigate } from 'react-router-dom';

export default function CourseMap({ courses, user, onEnroll, onDelete, showViewButton, emptyMessage }) {
  const navigate = useNavigate();

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {courses.map((course) => (
        <li key={course.id} className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {course.name }
              </h3>
              <p className="text-sm text-gray-500">
                {course.content}
              </p>
            </div>
            <div className="flex space-x-2">
              {user.type === 'student' && (
                <button
                  onClick={() => onEnroll(course.id)}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Kayıt Ol
                </button>
              )}
              {user.type === 'admin' && (
                <>
                {showViewButton && (
                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Görüntüle
                  </button>
                  )}
                  <button
                    onClick={() => onDelete(course.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sil
                  </button>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 