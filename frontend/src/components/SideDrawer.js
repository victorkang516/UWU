import './SideDrawer.css';
import { Link } from 'react-router-dom';

const SideDrawer = ({show, click}) => {
  const sideDrawerClass = ["sidedrawer"];

  if(show) {
    sideDrawerClass.push("show");
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
          <Link to="/order">
            <i className="fas fa-shopping-cart"></i>
            <span>
              MyOrder
              <span className="sidedrawer-cartbadge">0</span>
            </span>
          </Link>
        </li>
        
      </ul>
    </div>
  )
}

export default SideDrawer
