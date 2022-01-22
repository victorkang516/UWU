import './CartItem.css';
import {Link} from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';


const CartItem = ({_id, userId, productId, quantity, isPaid, removeOrder, calculateTotalPrice}) => {

  const [qty, setQty] = useState(quantity);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const onquantityChange = (event) =>{
    setQty(event.target.value)
  }

  const deleteData = () => {
    axios.delete(`http://localhost:5000/orders/${_id}`).then(res => 
    {
    console.log(res);
    removeOrder(_id);
  }).catch(error => {
    console.log(error);
  });

  }

  const calculateSubTotal = () => {
   const subTotal = qty*parseFloat(product.price);
   console.log(product.price);
   calculateTotalPrice(subTotal);
  }

  const updateData = () => {
    const order = {
      quantity: qty
    };

    axios.put(`http://localhost:5000/orders/${_id}`, order).then(res =>
    {
      console.log(res);
    }).catch(error=> {
      console.log(error);
    });
  }

  const fetchData = async () =>{
    try{

      const response = await fetch(`http://localhost:5000/products/${productId}`);
      const result = await response.json();

      setProduct(result);
      setImageUrl(result.imageUrl);

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [productId]);

  useEffect(() => {
    updateData();
    if (product != null)
      calculateSubTotal();
  }, [qty]);

  useEffect(() => {
    if (product != null)
      calculateSubTotal();
  }, [product]);

  useEffect(() => {
    if (imageUrl!='')
      setLoading(false);
  },[imageUrl]);


  if (loading){
    return <div></div>
  }

  return (
    <div className="cartitem">
      <div className="cartitem-image">
      <img
        src={`${process.env.PUBLIC_URL}/images/${imageUrl}?${Date.now()}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/945/593/non_2x/empty-price-tag-icon-shopping-product-label-sign-and-symbol-free-vector.jpg'
        }} alt="" />
      </div>

      <Link to={`/product/${productId}`} className="cartitem-name">
        <p>{product.name}</p>
      </Link>

      <p className="cartitem-price">RM{product.price}</p>

      <input 
            type="number" 
            value={qty} 
            onChange={onquantityChange} 
            min="1" 
            max={product.countInStock}
          />

      <p className="cartitem-price">RM{qty*product.price}</p>
      
      <button className="cartitem-deletebtn" onClick={deleteData}>
        <i className="fas fa-trash"></i>
      </button>
    </div>
  )
}

export default CartItem
