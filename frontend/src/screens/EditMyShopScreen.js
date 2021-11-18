import './EditMyShopScreen.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const userData = JSON.parse(localStorage.getItem("userData"));


const EditMyShopScreen = (props) => {
        
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  //const [shopImageUrl, setShopImageUrl] = useState('');
  const [shopAddress, setShopAdress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [shopEmail, setShopEmail] = useState('');

  const [loading, setLoading] = useState(true);


  // Get Shop detail by user Id

  const fetchData = async () =>{
    try{
      const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
      const result = await response.json();

      setShopData(result);
      setLoading(false);

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const setShopData = (result) => {
    setShopId(result._id);
    setShopName(result.shopName);
    setShopDescription(result.shopDescription);
    setShopAdress(result.shopAddress);
    setShopPhone(result.shopPhone);
    setShopEmail(result.shopEmail);
  }


  // On Data Change
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


  // Edit Shop details by Shop Id

  const editShop = (event) => {
    event.preventDefault();
    if (shopName !== "" && shopDescription !== "" && shopAddress !== "" && shopPhone !== "" && shopEmail !== "") {
      const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (shopEmail && regex.test(shopEmail) !== false) {
        const phoneregex = /^\+60\d{2}(\d{7}|\d{8})$/;
          if (phoneregex.test(shopPhone)){

        const shop = {
          shopName: shopName,
          shopEmail: shopEmail,
          shopDescription: shopDescription,
          shopAddress: shopAddress,
          shopPhone: shopPhone
        };

        axios.put(`http://localhost:5000/shops/${shopId}`, shop)
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


  // Delete Shop by Shop Id

  // const deleteShop = () => {
  //   try {
  //     axios.delete(`http://localhost:5000/shops/${shopId}`)
  //     .then(res => {
  //       props.history.push("/myshop");
  //       //window.location.reload(false);
  //       console.log(res);
  //     }).catch(error => {
  //       console.log(error);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }



  // If data not loaded yet, display empty page/loading sign
  if (loading)
  {
    return <div className="loadingscreen">
    <div className="loading"></div>
  </div>
  } 


	return (
    <div className="editmyshopscreen">

      <h1 className="title">Update your shop!</h1>

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
          <button type="submit" onClick={editShop}>Update</button>
        </div>

        {/* <div className="form-input">
          <button onClick={deleteShop}>Delete</button>
        </div> */}

      </form>
  </div>
	)
	
	
}

export default EditMyShopScreen