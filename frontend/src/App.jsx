import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FindParking from "./pages/FindParking";
import ListParking from "./pages/ListParking";
import Analytics from "./pages/Analytics";
import BookingHistory from "./pages/BookingHistory";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2H5zm6 0a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2h-2zm0 13a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition">
                  ParkGo
                </h1>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-8">
                <Link 
                  to="/" 
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition group"
                >
                  Find Parking
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>

                <Link 
                  to="/list" 
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition group"
                >
                  List Parking
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>

                <Link 
                  to="/bookings" 
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition group"
                >
                  My Bookings
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>

                <Link 
                  to="/analytics" 
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition group"
                >
                  Analytics
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<FindParking />} />
          <Route path="/list" element={<ListParking />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold mb-4">ParkGo</h3>
                <p className="text-sm">Smart parking marketplace connecting drivers with parking space owners.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="hover:text-white transition cursor-pointer">Find Parking</li>
                  <li className="hover:text-white transition cursor-pointer">List Spaces</li>
                  <li className="hover:text-white transition cursor-pointer">Real-time Booking</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li className="hover:text-white transition cursor-pointer">About</li>
                  <li className="hover:text-white transition cursor-pointer">Contact</li>
                  <li className="hover:text-white transition cursor-pointer">Privacy</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li className="hover:text-white transition cursor-pointer">Help Center</li>
                  <li className="hover:text-white transition cursor-pointer">FAQ</li>
                  <li className="hover:text-white transition cursor-pointer">Contact Us</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>&copy; 2026 ParkGo. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;