import './CheckOutScreen.css';
import { useState, useEffect } from 'react';
import CheckOutItem from '../components/CheckOutItem';
import axios from 'axios';

const userData = JSON.parse(localStorage.getItem("userData"));

const CheckOutScreen = (props) => {

  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState([]);

  const [userId, setUserId] = useState(userData.userId);

  const [checkOutItems, setCheckOutItems] = useState([]);

  const [totalPrice, settotalPrice] = useState(0);

  const [showMessage, setShowMessage] = useState(false);

  const [totalSpent, settotalSpent] = useState();

  const returnMyOrderScreen = async () => {
    props.history.push("/myorder");
  }

  const makePayment = async () => {
    updateOrderIsPaid()
    calculateTotalSpent()
  }

  const fetchUserData = async () => {
    try {

      const response = await fetch(`http://localhost:5000/users/account/${userId}`);
      const result = await response.json();

      setUserInfo(result);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  }

  const fetchCheckOut = async () => {
    try {

      const response = await fetch(`http://localhost:5000/orders/unpaid/${userData.userId}`);
      const result = await response.json();
      console.log(result)

      setCheckOutItems(result);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  }

  const updateOrderIsPaid = () => {
    const order = {
      isPaid: true
    };

    axios.put(`http://localhost:5000/orders/paid/${userData.userId}`, order)
      .then(res => {setShowMessage(true)
        console.log(res);
      }).catch(error => {
        console.log(error);
      });
  }

  const updateUserTotalSpent = () => {
    const user = {
      totalSpent: totalSpent
    };
      
    axios.put(`http://localhost:5000/users/totalSpent/${userData.userId}`, user)
      .then(res => {
        console.log(res);
      }).catch(error => {
        console.log(error);
      });
    }    

  const calculateTotalPrice = (subTotal) => {
    var newTotal = totalPrice + subTotal;
    settotalPrice(newTotal);
  }

  const calculateTotalSpent = () => {
    var newTotalSpent = totalPrice + userInfo.totalSpent;
    settotalSpent(newTotalSpent);
  }

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    fetchCheckOut();
  }, []);

  useEffect(() => {
    updateUserTotalSpent();
  }, [totalSpent]);

  if (loading) {
    return <div className="loadingscreen">
      <div className="loading"></div>
    </div>
  }

  return <div className="cartscreen">

    {/* Header */}
    <h2 className="cartscreen-header">Invoice</h2>

    <h3 className="cartscreen-header">Basic Information</h3>

    {/* Content */}
    <div className="cartscreen-content">
      <div className="cartscreen-left1">
        <div>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <p>Address: {userInfo.address}</p>
          <p>Phone Number: {userInfo.phone}</p>

          <button className="cartscreen-btn" onClick={makePayment} >Make Payment</button>
        </div>
      </div>
      <div className="cartscreen-right1">
        <div className="cartscreen-info">
          {
            checkOutItems.map((checkOutItem) => {
              return <CheckOutItem key={checkOutItem._id} {...checkOutItem} calculateTotalPrice={calculateTotalPrice}></CheckOutItem>
            })
          }
          <p>Grand Total:</p>
          <p>RM{totalPrice}</p>
        </div>
      </div>
    </div>
    {showMessage ? 
    <div className="message">
      <div className="message-content">
        <h2>Thank You!</h2>
        <p>Your payment is made</p>
        <p>You can view your order history in MyOrder.</p>
        <button onClick={returnMyOrderScreen}>OK</button>
      </div>
    </div>
    : 
    <div></div>
    }
  </div>
}


export default CheckOutScreen