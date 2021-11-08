
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';


import './MyShopScreen.css';



const MyShopScreen = () => {

  return (

        <div className="myshopscreen">

        <Link to={`/myshop/createmyshop`} className="Link" type="button" >
          <h1>Create MyShop!</h1>
        </Link>

        </div>

  )

}

export default MyShopScreen
