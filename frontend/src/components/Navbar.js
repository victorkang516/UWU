import './Navbar.css'
import {Link} from 'react-router-dom';
import auth from '../authentication/auth';

import logo from '../screens/uwupic.png';

const userData = JSON.parse(localStorage.getItem("userData"));

const Navbar = ({click}) => {

  const logout = () => {
    auth.logout(()=>{
      window.location.reload(false);
    })
  }

  return (
    <nav className="navbar">
      {/* logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="logo"/>
          UWU Shopping Site
        </Link>
      </div>

      {/* Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/myshop">
            MyShop
          </Link>
        </li>
        <li>
          <Link to="/myorder" className="order-link">
            <i className="fas fa-shopping-cart"></i>
            <span>
              MyOrder
              <span className="navbar-cartbadge">0</span>
            </span>
          </Link>
        </li>
        <li className="space">
          <div></div>
        </li>
        <li>
          {auth.isAuthenticated() ? (
            <Link to="/myprofile" className="username">
              {userData.name}
            </Link>
          ) : (
            <div></div>
          )}
        </li>
        <li>
          {auth.isAuthenticated() ? (
            <Link to="/" onClick={logout} className="signup">
              Logout
            </Link>
          ) : (
            <Link to="/login" className="signup">
              Sign In
            </Link>
          )}
          
        </li>

      </ul>

      {/* Hamburger menu */}
      <div className="hamburger-menu" onClick={click}>
        <div></div>
        <div></div>
        <div></div>
      </div>

    </nav>
  )
  
}

export default Navbar;
