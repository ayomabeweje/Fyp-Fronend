// src/components/Navbar.jsx
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-blue-700 text-white">
      <h1 className="text-2xl font-bold">🧠 Stroke Risk App</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/predict">Predict</Link>
        <Link to="/history">History</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;
