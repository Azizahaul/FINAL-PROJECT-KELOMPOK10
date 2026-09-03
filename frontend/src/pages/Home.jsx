import { useHealthCheck } from '../hooks/useHealthCheck';
import HealthBadge from '../components/HealthBadge';
import Chatbot from '../components/Chatbot'; // Import Chatbot Nia

function Home() {
  const { status, data, checkHealth } = useHealthCheck();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm w-full text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Frontend Template</h1>
        <p className="text-sm text-gray-500 mb-4">Vite + React + Tailwind</p>

        <div className="mb-4">
          <HealthBadge status={status} />
        </div>

        {data && (
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-left overflow-x-auto mb-4">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}

        <button
          onClick={checkHealth}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg"
        >
          Cek Ulang
        </button>
      </div>
      
      {/* Widget Chatbot ditaruh di sini agar muncul di pojok kanan bawah */}
      <Chatbot />
    </div>
  );
}

export default Home;