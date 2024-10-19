import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LeadList from './components/LeadList';
import CallSimulator from './components/CallSimulator';
import Settings from './components/Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/leads" element={<PrivateRoute><LeadList /></PrivateRoute>} />
          <Route path="/simulator" element={<PrivateRoute><CallSimulator /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;