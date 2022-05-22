import './CreateMyShopScreen.css';
import { useState} from 'react';
import axios from 'axios';

import backendUrl from '../service/backendUrl';

const userData = JSON.parse(localStorage.getItem("userData"));


const CreateMyShopScreen = (props) => {
        
        const [userId] = useState(userData.userId);
        const [shopName, setShopName] = useState('');
        const [shopDescription, setShopDescription] = useState('');
        const [shopImageUrl, setShopImageUrl] = useState('');
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
          shopImageUrl: "https://p.kindpng.com/picc/s/9-94468_shop-clipart-hd-png-download.png",
          shopDescription: shopDescription,
          shopAddress: shopAddress,
          shopPhone: shopPhone
        };

        axios.post(`${backendUrl}/shops`, shop)
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
            <div className="account-information1">
                

                <div className="container1" >
                    <div className="column-1 box1" >
                        <form className="form" method="POST" encType="multipart/form-data">
                            <h1 className="text-center">Create My Shop</h1>
                            
                            <div className="form-input" type="Shop Name:">              
                            <label>Shop Name: </label>
                                <input type="text" name="name" value={shopName} onChange={onShopNameChange}
                                    placeholder="Shop name" required />
                            </div>
                            <div className="form-input" type="Shop Email:">
                            <label>Shop Email: </label>

                                <input type="text" name="email" value={shopEmail} onChange={onShopEmailChange}
                                    placeholder="Shop Email" required />
                            </div>
                            <div className="form-input" type="Shop Description:">
                            <label>Shop Description: </label>

                                <input type="text" name="description" value={shopDescription} onChange={onShopDescChange}
                                    placeholder="Shop Description" required />
                            </div>

                            <div className="form-input" type="Shop Address:">
                            <label>Shop Address: </label>

                                <input type="text" name="address" value={shopAddress} onChange={onShopAddressChange}
                                    placeholder="Shop Address" required />
                            </div>
                            <div className="form-input" type="Shop Phone:">
                            <label>Shop Phone: </label>

                                <input type="text" name="phone" value={shopPhone} onChange={onShopPhoneChange}
                                    placeholder="Shop Phone" required />
                            </div>
                            

                            <center>
                                <button type="submit" className="button" onClick={onSubmit}>Create</button>
                            </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
	)
	
	
}

export default CreateMyShopScreen