import './CheckOutScreen.css';
import { useState,useEffect } from 'react';

const userData = JSON.parse(localStorage.getItem("userData"));

const CheckOutScreen = () => {
    
    const [loading, setLoading] = useState(true);

    const [checkOut, setCheckOut] = useState([]);

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

      if (loading) {
        return <div className="loadingscreen">
          <div className="loading"></div>
        </div>
      }
    
      return <div className="cartscreen">
    
        {/* Header */}
        <h2 className="cartscreen-header">Checkout</h2>
        
        {/* Content */}
        <div className="cartscreen-content">
          <div className="cartscreen-left">
          </div>
          </div>
          </div>
}


export default CheckOutScreen