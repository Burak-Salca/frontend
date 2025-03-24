export default function ErrorMap({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-400 rounded-md p-4">
      <div className="text-red-700">
        <ul className="list-disc list-inside">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 