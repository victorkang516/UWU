import './CheckOutItem.css';
import {Link} from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';

import backendUrl from '../service/backendUrl';


const CheckOutItem = ({_id, userId, productId, quantity, isPaid, calculateTotalPrice}) => {

  const [qty, setQty] = useState(quantity);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateSubTotal = () => {
   const subTotal = qty*parseFloat(product.price);
   console.log(product.price);
   calculateTotalPrice(subTotal);
  }

  const fetchData = async () =>{
    try{
      const response = await fetch(`${backendUrl}/products/${productId}`)
      const result = await response.json();

      setProduct(result);
      setLoading(false);

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (product != null)
      calculateSubTotal();
  }, [product]);


  if (loading){
    return <div></div>
  }

  return (
    <div className="checkoutitem">

      <p>{_id} </p>

      <p>{product.name}</p>

      <p className="checkoutitem-price">RM{product.price}</p>

      <p >{qty} </p>

      <p className="checkoutitem-price">RM{qty*product.price}</p>
    </div>
  )
}

export default CheckOutItem