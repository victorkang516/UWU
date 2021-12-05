
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';
import ReactPaginate from 'react-paginate';

import axios from 'axios';
import './MyShopScreen.css';
import Product from '../components/Product';
import Loading from '../components/Loading';



const userData = JSON.parse(localStorage.getItem("userData"));



const MyShopScreen = () => {

  const [shop, setShop] = useState();
  const [shopProducts, setShopProducts] = useState([]);
  const length = shopProducts.length;


  const [loading, setLoading] = useState(true);
  const [loadingProducts,setLoadingProducts] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState([]);
  
  


  useEffect(() => {
    const fetchData = async () =>{
      try{
        const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
        const result = await response.json();
  
        setShop(result);
        setLoading(false);
  
      } catch(error){
        console.log("failed fetch shop data");
        console.log(error);
      }
      
      try {
        const response = await fetch(`http://localhost:5000/products/seller/shop._id`);
        const result = await response.json();
        
        setShopProducts(result);
        setLoadingProducts(false);

        } catch (error){
          console.log("failed fetch shop's products data");
          console.log(error);
          }
        

    }
    fetchData();
    console.log("Fetch Data");
  }, []);


  const Card = (props) =>{
    return(
      <div className="card">
        <div className="card__body">
          <img src={props.img} />
          <h2 className="card__title">{props.title}</h2>
          <p className="card__description">{props.description}</p>
        </div>
        <Link to={'/myshop/editproduct/:id'} className="Link" type="button" align="center"> 
          <button className="card__btn">Edit</button>
        </Link>
        

      </div>

    )
  }

  

  // If data not loaded yet, display empty page/loading sign
  if (loading || loadingProducts)
  {
    return <Loading />
  }





  
  return (

    <div className="myshopscreen">

      {shop ?
        <div className="welcomeshop">
          <p>{shop.shopName}</p>
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
          <span>Edit your MyShop!</span>
        </Link>


        {/* Streaming */}

        <Link to="/streamingseller" className="Link" type="button">
          <i className="fa fa-video-camera" aria-hidden="true"></i>
          <span>
            Start Streaming
          </span>
        </Link>


        {/* Product List */}

        <div className="Product">
          <h2 align="center">Product List</h2>

          <div className="productList">

          </div>
            
          <Link to={'/myshop/addproduct'} className="Link" type="button"> 
          <h2>Add product</h2>
          </Link>

        </div>


        

      </div>
      }

    </div>

  )
  
  

}

export default MyShopScreen
