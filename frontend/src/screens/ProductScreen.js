import './ProductScreen.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';

import auth from '../authentication/auth';
import Loading from "../components/Loading";

import backendUrl from '../service/backendUrl';


const userData = JSON.parse(localStorage.getItem("userData"));


const ProductScreen = (props) => {
  let { id } = useParams();
  let url = `${backendUrl}/products/${id}`;

  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);



  const fetchData = async () =>{
    try{
      const response = await fetch(url);
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
    if (product!=null)
      checkInStock();
  }, [product])

  const checkInStock = () => {
    if (product.countInStock>0){
      setInStock(true);
    }
  }

  const makeOrder = () => {

    const order = {
      userId: userData.userId,
      productId: product._id,
      quantity: quantity,
      shopId: product.shopId
    };

    axios.post(`${backendUrl}/orders`, order)
      .then(res => {
        console.log(res);
        setShowMessage(true);
      }).catch(error => {
        console.log(error);
      });
  }


  if (loading) {
    return <Loading />
  }
  return <div className="productscreen">
    <div className="productscreen-left">
      <div className="left-image">
      <img
        src={`${process.env.PUBLIC_URL}/images/${product.imageUrl}?${Date.now()}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/945/593/non_2x/empty-price-tag-icon-shopping-product-label-sign-and-symbol-free-vector.jpg'
        }} alt="" />
      </div>

      <div className="left-info">
        <p className="left-name">{product.name}</p>
        <p>RM{product.price}</p>
        <p>{product.description}</p>
        <p>Seller: {product.shopName}</p>
        <p>Category: {product.category}</p>
      </div>
    </div>
    <div className="productscreen-right">
      <div className="right-info">
        <p>
          Price: <span>RM{product.price}</span>
        </p>
        <p>
          Stock left: <span>{product.countInStock}</span>
        </p>
        <p>
          Qty
          <input 
            type="number" 
            value={quantity} 
            onChange={(event)=>{setQuantity(event.target.value)}} 
            min="1" 
            max={product.countInStock}
          />
        </p>
        <p>
          {auth.isAuthenticated() ? 
          <button 
            type="button" 
            disabled={inStock ? false : true} 
            onClick={makeOrder}
          >Order
          </button>
          :
          <Link to="/login">Order</Link>
          }
        </p>
      </div>
    </div>

    {showMessage ? 
    <div className="message">
      <div className="message-content">
        <h2>Your Order on {quantity} quantity of {product.name} is successfully placed</h2>
        <p>View your orders in Myorder.</p>
        <button onClick={()=>setShowMessage(false)}>OK</button>
      </div>
    </div>
    : 
    <div></div>
    }
  </div>
}

export default ProductScreen
