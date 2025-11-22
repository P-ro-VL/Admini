export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">Total APIs</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">Total Pages</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">Published</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">0</p>
                </div>
            </div>
        </div>
    );
}
