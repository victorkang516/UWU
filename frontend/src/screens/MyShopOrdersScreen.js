
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';

import './MyShopOrdersScreen.css';
import Product from '../components/Product';
import Loading from '../components/Loading';
import Orders from '../components/BuyersOrders';


const userData = JSON.parse(localStorage.getItem("userData"));
const MyShopOrdersScreen = () => {

    const [shop, setShop] = useState();
    const [shopOrders , setShopOrders] = useState([]);
  
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
        }
      }
      fetchShopData();
      console.log("Fetch Data");
    }, []); // This UseEffect run when the page first time load
  
  
    useEffect(() => {
      const fetchShopOrders = async () => { 
        try {
          const response = await fetch(`http://localhost:5000/orders/seller/${shop._id}`); //Add ${} to get variable
          const result = await response.json();
  
          setShopOrders(result);
          alert("Success!");
  
        } catch (error) {
          console.log("failed fetch orders data");
          console.log(error);
        }
      }
      if (shop != null) // Check if the shopData Null
        fetchShopOrders();
    }, [shop]); // This UseEffect run when the shopData loaded
  
  
  
  
    // If data not loaded yet, display loading sign
    if (loading) {
      return <Loading />
    }
  
    return (
  
      <div className="myshoporderscreen">
  
        TEST
        {/* Order List */}

          <div className="order-content">
            <h2 align="center" className="label">Order List</h2>

            <div className="productlist">

              {shopOrders.map((shopOrders) => (
                  <Orders {...shopOrders} />                             
              ))}

            </div>

          </div>

      </div>
  
    )
  
  
  
  }
  
  export default MyShopOrdersScreen
  