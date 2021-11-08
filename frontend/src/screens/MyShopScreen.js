
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';


import './MyShopScreen.css';



const MyShopScreen = () => {

  return (

        <div className="myshopscreen">
      
        <h3>Start a streaming</h3>
        <Link to={`/myshop/createmyshop`} className="">
          <p>Create MyShop!</p>
        </Link>

        </div>

  )

}

export default MyShopScreen
