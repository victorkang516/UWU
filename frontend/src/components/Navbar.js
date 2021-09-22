import './Navbar.css'
import {Link} from 'react-router-dom';

const Navbar = ({click}) => {
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
          <Link to="/">
            MyShop
          </Link>
        </li>
        <li>
          <Link to="/order" className="order-link">
            <i className="fas fa-shopping-cart"></i>
            <span>
              MyOrder
              <span className="navbar-cartbadge">0</span>
            </span>
          </Link>
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

export default Navbar
