import './CheckOutScreen.css';
import { useState,useEffect } from 'react';
import CheckOutItem from '../components/CheckOutItem';

const userData = JSON.parse(localStorage.getItem("userData"));

const CheckOutScreen = () => {
    
    const [loading, setLoading] = useState(true);

    const [userInfo, setUserInfo] = useState([]);

    const [userId, setUserId] = useState(userData.userId);

    const [checkOutItems, setCheckOutItems] = useState([]);

    const [totalPrice, settotalPrice] = useState(0);

    const fetchUserData = async () =>{
        try{
          
          const response = await fetch(`http://localhost:5000/users/account/${userId}`);
          const result = await response.json();
    
          setUserInfo(result);
          setLoading(false);
    
        } catch(error){
          console.log(error);
        }
      }

      const fetchCheckOut = async () =>{
        try{
          
          const response = await fetch(`http://localhost:5000/orders/unpaid/${userData.userId}`);
          const result = await response.json();
          console.log(result)
    
          setCheckOutItems(result);
          setLoading(false);
    
        } catch(error){
          console.log(error);
        }
      }  

      const calculateTotalPrice = (subTotal) => {
        var newTotal = totalPrice + subTotal;
        settotalPrice(newTotal);
      }

      useEffect(() => {
        fetchUserData();
      }, [userId]);

      useEffect(() => {
        fetchCheckOut();
      }, []);

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

        <button className="cartscreen-btn">Make Payment</button>
        </div>
      </div>
      <div className="cartscreen-right1">
        <div className="cartscreen-info">
          {
            checkOutItems.map((checkOutItem)=> {
              return <CheckOutItem key={checkOutItem._id} {...checkOutItem} calculateTotalPrice={calculateTotalPrice}></CheckOutItem>
            })
          }
          <p>Grand Total:</p>
          <p>RM{totalPrice}</p>
        </div>
        </div>
        </div>
        </div>
}


export default CheckOutScreen