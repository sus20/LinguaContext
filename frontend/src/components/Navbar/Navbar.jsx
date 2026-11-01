import logo from "../../assets/logo.png";
import "./Navbar.css";
import { NavLink } from "react-router-dom"; 



function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="LinguaContext logo" className="logo-img" />
        LinguaContext
      </div>

      <nav className="nav-links">
        <NavLink to = "/library"> My Library</NavLink>
        <NavLink to = "/words"> My Words</NavLink>
        <NavLink to = "/review"> Review</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
