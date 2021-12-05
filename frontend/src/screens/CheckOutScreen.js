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
}


export default CheckOutScreen