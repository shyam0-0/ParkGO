import { useState } from "react";

function BookingHistory() {
  // Sample booking data - in a real app, this would come from the backend
  const [bookings] = useState([
    {
      id: "TXN001",
      parkingName: "Anna Nagar Parking",
      location: "Anna Nagar, Chennai",
      startTime: "2024-01-15 10:30 AM",
      duration: "2 hours",
      cost: 80,
      status: "completed",
      spots: "B-12",
    },
    {
      id: "TXN002",
      parkingName: "T Nagar Parking",
      location: "T Nagar, Chennai",
      startTime: "2024-01-14 2:15 PM",
      duration: "3 hours",
      cost: 120,
      status: "completed",
      spots: "A-5",
    },
    {
      id: "TXN003",
      parkingName: "Velachery Parking",
      location: "Velachery, Chennai",
      startTime: "2024-01-13 9:00 AM",
      duration: "4 hours",
      cost: 160,
      status: "completed",
      spots: "C-8",
    },
    {
      id: "TXN004",
      parkingName: "Adyar Parking",
      location: "Adyar, Chennai",
      startTime: "2024-01-12 5:45 PM",
      duration: "1.5 hours",
      cost: 60,
      status: "completed",
      spots: "D-3",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓";
      case "pending":
        return "⏳";
      case "cancelled":
        return "✕";
      default:
        return "•";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Booking History
          </h1>
          <p className="text-xl text-gray-600">
            View and manage all your parking bookings
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Total Spent</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              ₹{bookings.reduce((sum, b) => sum + b.cost, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium">Completed</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {bookings.filter(b => b.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Parking</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Spot</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        {booking.id}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.parkingName}</p>
                        <p className="text-sm text-gray-600">{booking.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.startTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{booking.spots}</td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">₹{booking.cost}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        <span>{getStatusIcon(booking.status)}</span>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Parking Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click on a transaction ID to view detailed receipt</li>
            <li>• Download invoices from the booking details page</li>
            <li>• Cancel bookings up to 30 minutes before start time</li>
            <li>• Earn loyalty points with every booking</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default BookingHistory;
