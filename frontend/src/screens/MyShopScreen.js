
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import './MyShopScreen.css';

const userData = JSON.parse(localStorage.getItem("userData"));



const MyShopScreen = () => {

  const userId = useState (userData.userId);

  const [shop, setShop] = useState([]);
  let url = `http://localhost:5000/shops/${userId}`;

  const fetchData = async () =>{
    try{
      const response = await fetch(url);
      const result = await response.json();

      setShop(result);
      //setLoading(false);

      //checkInStock();

    } catch(error){
      console.log(error);
    }
  }

  return (

        <div className="myshopscreen">

        <h1>{shop.shopName}</h1>

        <Link to={`/myshop/createmyshop`} className="Link" type="button" >
          <h1>Create MyShop!</h1>
        </Link>

        </div>

  )

}

export default MyShopScreen
