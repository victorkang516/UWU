import './MyOrderScreen.css';
import CartItem from '../components/CartItem';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

const userData = JSON.parse(localStorage.getItem("userData"));

const MyOrderScreen = () => {

  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);

  const fetchData = async () =>{
    try{
      
      const response = await fetch(`http://localhost:5000/orders/unpaid/${userData.userId}`);
      const result = await response.json();

      setOrders(result);
      setLoading(false);

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const removeOrder = (id) => {
    const newOrders = orders.filter((order) => order._id !== id)
    setOrders(newOrders)
  }

  const calculateTotalPrice = (subTotal) => {
    var newTotal = totalPrice + subTotal;
    settotalPrice(newTotal);
  }

  
  if (loading) {
    return <div className="loadingscreen">
      <div className="loading"></div>
    </div>
  }

  return <div className="cartscreen">

    {/* Header */}
    <h2 className="cartscreen-header">Shopping Cart</h2>
    
    {/* Content */}
    <div className="cartscreen-content">
      <div className="cartscreen-left">
        {
          orders.map((order)=>{

            return <CartItem key={order._id} {...order} removeOrder = {removeOrder} calculateTotalPrice={calculateTotalPrice} /> 
            //console.log("quantity:"+order.quantity)
          })
        }
      </div>
      <div className="cartscreen-right">
        <div className="cartscreen-info">
          <p>Grand Total:</p>
          <p>RM{totalPrice}</p>
        </div>
        <div>
          <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
    
  </div>
}

export default MyOrderScreen
