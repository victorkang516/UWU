import { Router } from 'express';
import { Link } from 'react-router-dom'

import './MyShopScreen.css';



const MyShopScreen = () => {

  return (
        <div className="myshopscreen">
      
        <h3>Start a streaming</h3>
        <Link to={`/createshop`} className="">
          <p>Create MyShop!</p>
        </Link>

        </div>
  )

}

export default MyShopScreen
