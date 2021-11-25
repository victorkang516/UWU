import './CreateMyShopScreen.css';
import { useState} from 'react';
import axios from 'axios';

const userData = JSON.parse(localStorage.getItem("userData"));


const CreateMyShopScreen = (props) => {
        
        const [userId] = useState(userData.userId);
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

        const phoneregex = /^\+60\d{2}(\d{7}|\d{8})$/;
          if (phoneregex.test(shopPhone)){

        
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
          props.history.push("/myshop");
					//window.location.reload(false);
          console.log(res);
        }).catch(error => {
          console.log(error);
        });

          } else {
            alert("Your phone number should have this format -> +60123456789")
          } 
      
        } else {
          alert("Please insert valid email");
        }
    } else {
      alert("Please fill in the blanks");
    }


  }

	return (
        <div className="createmyshopscreen">

          <h1 className="title">Create your shop!</h1>

          <form className="register-form">
            <div className="form-input">
              <label>Shop Name: </label>
              <input name="shopName" value={shopName} onChange={onShopNameChange} required />
            </div>
              
            <div className="form-input">
              <label>Shop Email: </label>
              <input type="email" name="shopEmail" value={shopEmail} onChange={onShopEmailChange} required />
            </div>
  
            <div className="form-input">
              <label>Shop Description: </label>
              <input name="shopDescription" value={shopDescription} onChange={onShopDescChange} required />
            </div>
  
            <div className="form-input">
              <label>Shop Address: </label>
              <input name="shopAddress" value={shopAddress} onChange={onShopAddressChange} required />
            </div>
  
            <div className="form-input">
              <label>Shop Phone: </label>
              <input name="shopPhone" value={shopPhone} onChange={onShopPhoneChange} required />
            </div>
  
            <div className="form-input">
              <button type="submit" onClick={onSubmit}>Register</button>
            </div>
          </form>
      </div>
	)
	
	
}

export default CreateMyShopScreen