import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import User from './pages/User';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="nav">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          {/* User link would usually appear after login */}
          <Link to="/user">My Account</Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/" element={<Home />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;