import './SideDrawer.css';
import { Link } from 'react-router-dom';
import auth from '../authentication/auth';

const userData = JSON.parse(localStorage.getItem("userData"));


const SideDrawer = ({show, click}) => {
  const sideDrawerClass = ["sidedrawer"];

  if(show) {
    sideDrawerClass.push("show");
  }

  const logout = () => {
    auth.logout(()=>{
      window.location.reload(false);
    })
  }

  return (
    <div className={sideDrawerClass.join(" ")}>
      <ul className="sidedrawer-links" onClick={click}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/myshop">MyShop</Link>
        </li>
        <li>
          <Link to="/myorder">
            <i className="fas fa-shopping-cart"></i>
            <span>
              MyOrder
              <span className="sidedrawer-cartbadge">0</span>
            </span>
          </Link>
        </li>
        <li>
          {auth.isAuthenticated() ? (
            <Link to="/myprofile">
              {userData.name}
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
    </div>
  )
}

export default SideDrawer
