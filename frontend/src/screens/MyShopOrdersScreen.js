
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';

import './MyShopOrdersScreen.css';
import Product from '../components/Product';
import Loading from '../components/Loading';


const userData = JSON.parse(localStorage.getItem("userData"));
const MyShopOrdersScreen = () => {

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
  
        
  
      </div>
  
    )
  
  
  
  }
  
  export default MyShopOrdersScreen
  