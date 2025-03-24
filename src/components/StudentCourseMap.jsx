export default function StudentCourseMap({ relations = [] }) {
  if (!relations || relations.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">Henüz öğrenci-ders eşleşmesi bulunmamaktadır.</p>
      </div>
    );
  }

  return (
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
  );
} 