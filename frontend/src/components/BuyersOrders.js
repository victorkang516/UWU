import './BuyerOrders.css';
import { useEffect, useState } from 'react';

const Orders = ({ _id, userId, productId, quantity, isPaid }) => {

  const [user, setUser] = useState(null);

  var orderPaid;
  if (isPaid) {
    orderPaid = "Order paid";
  } else {
    orderPaid = "Order not paid";
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/account/${userId}`);
        const result = await response.json();
        setUser(result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, [userId])


  return (
    <div className="shoporders">
      <div className="orders-info">
        <p className="info-name">Order ID : {_id}</p>

        {user ? // Some userId's account have been deleted, so thats sometimes why we will get null
          <div>
            {/* <p className="info-name">User ID = {userId}</p> */}
            <p className='info-name'>Buyer's name : {user.name}</p>
          </div>
          :
          <div>
            {/* <p className="info-description"></p> */}
            <p className="info-name">User has been deleted</p>
            <p></p>
            
          </div>
        }
        
        <p className="info-price">{orderPaid}</p>
        


      </div>
    </div>
  )
}

export default Orders