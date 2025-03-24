import { useNavigate } from 'react-router-dom';

export default function AdminMap({ admins, onDelete }) {
  const navigate = useNavigate();

  if (!admins || admins.length === 0) {
    return (
      <div className="px-4 py-5">
        <p className="text-sm text-gray-500">Henüz başka admin bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {admins.map((admin) => (
        <li key={admin.id} className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {admin.firstName} {admin.lastName}
              </h3>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/admins/${admin.id}`)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Görüntüle
              </button>
              <button
                onClick={() => onDelete(admin.id)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sil
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 