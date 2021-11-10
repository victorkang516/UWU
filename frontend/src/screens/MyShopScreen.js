
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

      {shop ?
        <div className="welcomeshop">
          <h1>{shop.shopName}</h1>
          <p>{shop.shopDescription}</p>
          <p>{shop.shopAddress}</p>
          <p>{shop.shopPhone}</p>
          <p>{shop.shopEmail}</p>

        </div>
        :
        <div className="welcomeshop" >
          <h1 align="center">Welcome to MyShop</h1><br></br> 
          <p align="center">Become a seller and start selling products, streaming on our platform!</p>
        </div>
      }

      {!shop ? 
      <Link to={`/myshop/createmyshop`} className="Link" type="button" >
        <h2>Create your MyShop!</h2>
      </Link>
      :
      <div>

        {/* Edit Product */}

        <Link to={'/myshop/editmyshop'} className="Link" type="button"> 
          <h2>Edit your MyShop!</h2>
        </Link>


        {/* Product List */}

        <div className="Product">
          <h2 align="center">Product List</h2>
        </div>


        {/* Streaming */}

        {/* <Link to="/streamingseller" className="streaming-link">
          <i className="fa fa-video-camera" aria-hidden="true"></i>
          <span>
            Start Streaming
          </span>
        </Link> */}

      </div>
      }

    </div>

  )
  
  

}

export default MyShopScreen
