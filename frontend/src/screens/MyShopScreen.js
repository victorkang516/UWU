
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import './MyShopScreen.css';

const userData = JSON.parse(localStorage.getItem("userData"));



const MyShopScreen = () => {

  const [shop, setShop] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () =>{
    try{
      const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
      const result = await response.json();

      console.log(result);
      setShop(result);
      setLoading(false);

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])


  // If data not loaded yet, display empty page/loading sign
  if (loading)
  {
    return <div className="loadingscreen">
    <div className="loading"></div>
  </div>
  } 

  return (

    <div className="myshopscreen">

      <h1>{shop.shopName}</h1>
      <p>{shop.shopDescription}</p>

  
      <Link to={`/myshop/createmyshop`} className="Link" type="button" >
        <h1>Create MyShop!</h1>
      </Link>

    </div>

  )
  
  

}

export default MyShopScreen
