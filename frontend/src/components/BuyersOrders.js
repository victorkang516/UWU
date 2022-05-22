import './BuyerOrders.css';
import { useEffect, useState } from 'react';

import backendUrl from '../service/backendUrl';

const Orders = ({ _id, userId, productId, quantity, isPaid }) => {

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);

  var orderPaid;
  if (isPaid) {
    orderPaid = "Order paid";
  } else {
    orderPaid = "Order not paid";
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${backendUrl}/users/account/${userId}`);
        const result = await response.json();
        setUser(result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, [userId])

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${backendUrl}/products/${productId}`);
        const result = await response.json();
        setProduct(result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProductData();
  }, [productId])


  return (
    <div className="shoporders">
      <div className="orders-info">
        <p>Order ID : {_id}</p>

        {user ? // Some userId's account have been deleted, so thats sometimes why we will get null
          <div>
            {/* <p className="info-name">User ID = {userId}</p> */}
            <p className='info-name'>Buyer's name : {user.name}</p>
            {product ?
              <div>
                      <p className="info-name">Product Name : {product.name}</p>
                      <p className="info-name">Product Quantity : {quantity}</p>
                      <p className="info-price">Total Price : RM{quantity*product.price}</p>


              </div>
              :
              <div>
                      <p className="info-name">Product has been deleted</p>

                </div>
            }
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