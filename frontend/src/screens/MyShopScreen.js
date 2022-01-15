
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';

import './MyShopScreen.css';
import Product from '../components/Product';
import Loading from '../components/Loading';


const userData = JSON.parse(localStorage.getItem("userData"));


const MyShopScreen = (props) => {

  const [shop, setShop] = useState();
  const [shopProducts, setShopProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
        const result = await response.json();

        setShop(result);
        setLoading(false);

      } catch (error) {
        console.log("failed fetch shop data");
        console.log(error);
        props.history.push("/");
      }
    }
    fetchShopData();
    console.log("Fetch Data");
  }, []); // This UseEffect run when the page first time load


  useEffect(() => {
    const fetchShopProducts = async () => { 
      try {
        const response = await fetch(`http://localhost:5000/products/seller/${shop._id}`); //Add ${} to get variable
        const result = await response.json();

        setShopProducts(result);

      } catch (error) {
        console.log("failed fetch shop's products data");
        console.log(error);
        props.history.push("/");
      }
    }
    if (shop != null) // Check if the shopData Null
      fetchShopProducts();
  }, [shop]); // This UseEffect run when the shopData loaded




  // If data not loaded yet, display loading sign
  if (loading) {
    return <Loading />
  }

  return (

    <div className="myshopscreen">

      {shop ?
        <div className="welcomeshop">

              <img
              src={`${process.env.PUBLIC_URL}/images/${shop.shopImageUrl}`}
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://bootdey.com/img/Content/avatar/avatar3.png'
              }} alt=""/>
          <p><b>{shop.shopName}</b></p>
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
          
          <div className="edit-stream-button">

          {/* Edit Product */}

          <Link to={'/myshop/editmyshop'} className="Link" type="button">
            <span>Edit your MyShop!</span>
          </Link>
          &nbsp;

          {/* Streaming */}

          <Link to="/streamingseller" className="Link" type="button">
            <i className="fa fa-video-camera" aria-hidden="true"></i>
            <span>
              Start Streaming
            </span>
          </Link>
          &nbsp;

          {/* View Buyers orders */}

          <Link to="/myshop/orders" className="Link" type="button">
            <span>
              View Buyers' Orders
            </span>
          </Link>

          </div>

          
          {/* Product List */}
            
                {shopProducts.length != 0 ?
                  <div>
                      <div className="productscreen">
                      <h2 align="center" className="label">Product List</h2>

                      <div className="productlist">

                        {shopProducts.map((shopProduct) => (
                          <Link to={`/myshop/editproduct/${shopProduct._id}`} key={shopProduct._id} className="products"> {/* The Link "to" should go to your edit product page. */}
                            <Product {...shopProduct} />                             {/* Reuse Product componenet from HomePage */}
                          </Link>
                        ))} 

                        </div>

                    <div className="edit-stream-button">
                      <Link to={'/myshop/addproduct'} className="Link" type="button">
                        <span>Add a product!</span>
                      </Link>
                    </div>

                     
                    </div>
                        
                  </div>
                  :
                  <div className="welcomeshop" >
                    <h1 align="center">You have no products yet!</h1><br></br>
                      <div className="edit-stream-button">
                      <Link to={'/myshop/addproduct'} className="Link" type="button">
                        <span>Add a product!</span>
                      </Link>
                    </div>
                  </div>
                }


        </div>
      }

    </div>

  )



}

export default MyShopScreen
