
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
        <div>
          <h1>{shop.shopName}</h1>
          <p>{shop.shopDescription}</p>
        </div>
        :
        <div>
          <h1>Welcome to MyShop</h1>
          <p>Become a seller and start selling products, streaming on our platform!</p>
        </div>
      }

      {!shop ? 
      <Link to={`/myshop/createmyshop`} className="Link" type="button" >
        <h1>Create MyShop!</h1>
      </Link>
      :
      <div>
        <Link>
          <h1>Edit Shop</h1>
        </Link>
        <div>
          <h2>Product List</h2>
        </div>
      </div>
      }

    </div>

  )
  
  

}

export default MyShopScreen
