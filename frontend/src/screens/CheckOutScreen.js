import './CheckOutScreen.css';
import CartItem from '../components/CartItem';
import { useState,useEffect } from 'react';

const userData = JSON.parse(localStorage.getItem("userData"));

const CheckOutScreen = () => {
    
    const [loading, setLoading] = useState(true);

    const [userInfo, setUserInfo] = useState([]);

    const [userId, setUserId] = useState(userData.userId);

    const fetchData = async () =>{
        try{
          
          const response = await fetch(`http://localhost:5000/users/account/${userId}`);
          const result = await response.json();
          console.log(result)
    
          setUserInfo(result);
          setLoading(false);
    
        } catch(error){
          console.log(error);
        }
      }

      useEffect(() => {
        fetchData();
        console.log(userId)
      }, [userId]);

      if (loading) {
        return <div className="loadingscreen">
          <div className="loading"></div>
        </div>
      }
    
      return <div className="cartscreen">

    {/* Header */}
    <h2 className="cartscreen-header">Invoice</h2>

    <h3 className="cartscreen-header">Basic Information</h3>
        <div>
        
        </div>
    
    {/* Content */}
    <div className="cartscreen-content">
      <div className="cartscreen-left1">
        
      </div>
      <div className="cartscreen-right1">
        <div className="cartscreen-info">
          <p>Grand Total:</p>
          <p>RM</p>
        </div>
        </div>
        </div>
        </div>
}


export default CheckOutScreen