import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Restaurant from './components/restaurants/Restaurant';
import { RestaurantProvider } from './RestaurantContext'
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import NotFound from './pages/NotFound';
import UserReviews from './components/user/UserReviews'
import UserBookings from './components/user/UserBookings'

function App() {
  const [searchResponse, setSearchResponse] = useState('')
  return (
    <RestaurantProvider>
      <div className="font-body md:mx-20 px-5 md:px-10">
        <Router>
          <Navbar setSearchResponse={setSearchResponse} />
          <Routes>
            <Route path="/" element={<Dashboard searchResponse={searchResponse} />} />
            <Route path="/restaurants/:id/" element={<Restaurant />} />
            <Route path="/users/:id/">
              <Route path="reviews" element={<UserReviews />} />
              <Route path="bookings" element={<UserBookings />} />
            </Route>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </RestaurantProvider>

  );
}

export default App;
