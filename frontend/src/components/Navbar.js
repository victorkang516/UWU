import './Navbar.css'
import {Link} from 'react-router-dom';
import auth from '../authentication/auth';

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
        <h2>UWU Shopping Site</h2>
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
        <li>
          <Link to="/streamingseller" className="streaming-link">
            <i class="fa fa-video-camera" aria-hidden="true"></i>
            <span>
              Start Streaming
            </span>
          </Link>
        </li>
        <li>
          {auth.isAuthenticated() ? (
            <Link to="/myprofile">
              MyProfile
            </Link>
          ) : (
            <div></div>
          )}
        </li>
        <li>
          {auth.isAuthenticated() ? (
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          ) : (
            <Link to="/login">
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
