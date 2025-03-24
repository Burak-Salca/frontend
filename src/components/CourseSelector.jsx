import React from 'react';

export default function CourseSelector({ selectedCourse, availableCourses, onCourseSelect, onAddCourse }) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex space-x-4">
        <select
          value={selectedCourse}
          onChange={(e) => onCourseSelect(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Ders Seçin</option>
          {availableCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <button
          onClick={onAddCourse}
          disabled={!selectedCourse}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Ders Ekle
        </button>
      </div>
    </div>
  );
} 