import './MyOrderScreen.css';
import CartItem from '../components/CartItem';
import { useState,useEffect } from 'react';
const userData = JSON.parse(localStorage.getItem("userData"));

const MyOrderScreen = () => {

  const [orders, setOrders] = useState([]);

  const fetchData = async () =>{
    try{
      const response = await fetch(`http://localhost:5000/orders/${userData.userId}`);
      const result = await response.json();
      
      console.log(result);
      setOrders(result);

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

  return <div className="cartscreen">

    {/* Header */}
    <h2 className="cartscreen-header">Shopping Cart</h2>
    
    {/* Content */}
    <div className="cartscreen-content">
      <div className="cartscreen-left">
        {
          orders.map((order)=>{

            return <CartItem key={order._id} {...order} removeOrder = {removeOrder} /> 
            //console.log("quantity:"+order.quantity)
          })
        }
      </div>
      <div className="cartscreen-right">
        <div className="cartscreen-info">
          <p>Subtotal (0) item</p>
          <p>RM499.99</p>
        </div>
        <div>
          <button>Proceed To Checkout</button>
        </div>
      </div>
    </div>
    
  </div>
}

export default MyOrderScreen
