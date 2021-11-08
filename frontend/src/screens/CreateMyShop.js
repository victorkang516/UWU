import './CreateMyShop.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './uwupic.png';

//const userData = JSON.parse(localStorage.getItem("userData"));


const CreateShopScreen = (props) => {
        
        const [userId, setUserId] = useState('');
        const [shopName, setShopName] = useState('');
        const [shopDescription, setShopDescription] = useState('');
        //const [shopImageUrl, setShopImageUrl] = useState('');
        const [shopAddress, setShopAdress] = useState('');
        const [shopPhone, setShopPhone] = useState('');
        const [shopEmail, setShopEmail] = useState('');   

     
    
   const onShopNameChange = (event) => {
    setShopName(event.currentTarget.value);
  }  
     
  const onShopDescChange = (event) => {
    setShopDescription(event.currentTarget.value);
  }

  const onShopAddressChange = (event) => {
    setShopAdress(event.currentTarget.value);
  }

  const onShopPhoneChange = (event) => {
    setShopPhone(event.currentTarget.value);
  }

  const onShopEmailChange = (event) => {
    setShopEmail(event.currentTarget.value);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (userId !== "" && shopName !== "" && shopDescription !== "" && shopAddress !== "" && shopPhone !== "" && shopEmail !== "") {
      const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (shopEmail && regex.test(shopEmail) !== false) {

        //const response = await fetch(`http://localhost:5000/orders/${userData.userId}`);
        //const result = await response.json();

        const shop = {
          userId: userId,
          shopName: shopName,
          shopEmail: shopEmail,
          shopDescription: shopDescription,
          shopAddress: shopAddress,
          shopPhone: shopPhone
        };

        axios.post('http://localhost:5000/shops', shop)
        .then(res => {
          console.log(res);
        }).catch(error => {
          console.log(error);
        });
      
        } else {
          alert("please insert valid email");
        }
    } else {
      alert("Please fill in the blanks");
    }


  }

	return (
        <div className="createshopscreen">


        <div className="login">
          <h1>Create your shop</h1>
          <form className="login-form">
            <div className="form-input">
              <label>Shop Name: </label>
              <input name="shopName" value={shopName} onChange={onShopNameChange} required />
            </div>
              
            <div className="form-input">
              <label>Email: </label>
              <input type="email" name="shopEmail" value={shopEmail} onChange={onShopEmailChange} required />
            </div>
  
            <div className="form-input">
              <label>Description: </label>
              <input name="shopDescription" value={shopDescription} onChange={onShopDescChange} required />
            </div>
  
            <div className="form-input">
              <label>Address: </label>
              <input name="shopAddress" value={shopAddress} onChange={onShopAddressChange} required />
            </div>
  
            <div className="form-input">
              <label>Phone: </label>
              <input name="shopPhone" value={shopPhone} onChange={onShopPhoneChange} required />
            </div>
  
            <div className="form-input">
              <button type="submit" onClick={onSubmit}>Register</button>
            </div>
          </form>
        </div>
      </div>
	)
	
	
}

export default CreateShopScreen