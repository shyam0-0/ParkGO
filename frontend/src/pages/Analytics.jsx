import { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = () => {
    axios.get("http://localhost:5000/analytics")
      .then(res => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching analytics:", err));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Parking Analytics
          </h1>
          <p className="text-xl text-gray-600">
            Real-time insights into parking demand and performance
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Active Parkings */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Parkings</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {analytics?.total_active_parkings}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2H5zm6 0a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2h-2zm0 13a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {analytics?.total_bookings}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Confirmed</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {analytics?.confirmed_bookings}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  ₹{analytics?.total_revenue.toFixed(0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 012 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Capacity Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Parking Capacity</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Occupied</span>
                  <span className="text-sm font-bold text-gray-900">
                    {analytics?.total_occupied} / {analytics?.total_capacity}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${(analytics?.total_occupied / analytics?.total_capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {Math.round((analytics?.total_occupied / analytics?.total_capacity) * 100)}% Occupancy Rate
              </p>
            </div>
          </div>

          {/* Demand Zones */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Demand Zones</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">High Demand</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {analytics?.demand_zones?.high}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Medium Demand</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {analytics?.demand_zones?.medium}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Low Demand</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {analytics?.demand_zones?.low}
                </span>
              </div>
            </div>
          </div>

          {/* Average Booking Value */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Booking Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analytics?.average_booking_value.toFixed(2)}
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.total_bookings > 0 ? Math.round((analytics?.confirmed_bookings / analytics?.total_bookings) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Info Cards */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-2">📊 Real-time Monitoring</h4>
              <p className="text-blue-100">Monitor parking demand and availability across all locations instantly</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">💰 Revenue Tracking</h4>
              <p className="text-blue-100">Track total earnings and average booking value in real-time</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">🎯 Demand Analytics</h4>
              <p className="text-blue-100">Analyze demand patterns across different zones and time periods</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
