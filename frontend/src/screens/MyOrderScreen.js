import './MyOrderScreen.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/order/CartItem';
import HistoryItem from '../components/order/HistoryItem';
import AuctionItem from '../components/order/AuctionItem';

const userData = JSON.parse(localStorage.getItem("userData"));

const MyOrderScreen = () => {

  const [loading, setLoading] = useState(true);
  const [ploading, setPloading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);

  const [porders, setPorders] = useState([]);

  const fetchData = async () => {
    try {

      const response = await fetch(`http://localhost:5000/orders/unpaid/${userData.userId}`);
      const result = await response.json();

      setOrders(result);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  }

  const fetchPdata = async () => {
    try {
      const response = await fetch(`http://localhost:5000/orders/paid/${userData.userId}`);
      const result = await response.json();

      setPorders(result);
      setPloading(false);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchPdata();
  }, []);

  const removeOrder = (id) => {
    const newOrders = orders.filter((order) => order._id !== id)
    setOrders(newOrders)
  }

  const calculateTotalPrice = (subTotal) => {
    var newTotal = totalPrice + subTotal;
    settotalPrice(newTotal);
  }


  if (loading && ploading) {
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
          orders.filter(order => order.isAuctionItem === false).map((order) => {
            return <CartItem key={order._id} {...order} removeOrder={removeOrder} calculateTotalPrice={calculateTotalPrice} />
          })
        }
      </div>
      <div className="cartscreen-right">
        <div className="cartscreen-info">
          <p>Grand Total:</p>
          <p>RM{totalPrice}</p>
        </div>
        <div className="cartscreen-info">
          <p className='center'><Link to="/checkout" className="uwu-btn">Proceed to Checkout</Link></p>
        </div>
      </div>
    </div>

    <h2 className="cartscreen-header">Auction Cart</h2>
    <div className="cartscreen-content">
      <div className="cartscreen-left">
        {
          orders.filter(order => order.isAuctionItem === true).map((order) => {
            return <AuctionItem key={order._id} {...order} />
          })
        }
      </div>
    </div>

    <h2 className="cartscreen-header2">Order History</h2>
    <div className="cartscreen-content">
      <div className="cartscreen-left">
        {
          porders.map((order) => {
            return <HistoryItem key={order._id} {...order} />
          })
        }
      </div>
    </div>
  </div>
}

export default MyOrderScreen
