import './EditMyShopScreen2.css';
import { useEffect, useState, useRef } from "react";
import auth from "../authentication/auth";
import axios from 'axios';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom'

const userData = JSON.parse(localStorage.getItem("userData"));

const EditMyShopScreen2 = (props) => {
    const inputFileRef = useState(null);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState('');
    const [shop, setShop] = useState('');
    const [shopName, setShopName] = useState('');
    const [shopDescription, setShopDescription] = useState('');
    const [shopImageUrl, setShopImageUrl] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopPhone, setShopPhone] = useState('');
    const [shopEmail, setShopEmail] = useState('');

    const onShopNameChange = (event) => {
        setShopName(event.currentTarget.value);
    }


    const onShopDescChange = (event) => {
        setShopDescription(event.currentTarget.value);
    }

    const onShopAddressChange = (event) => {
        setShopAddress(event.currentTarget.value);
    }

    const onShopPhoneChange = (event) => {
        setShopPhone(event.currentTarget.value);
    }

    const onShopEmailChange = (event) => {
        setShopEmail(event.currentTarget.value);
    }


    const onPhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
            const result = await response.json();

            setShop(result);
            setShopName(result.shopName);
            setShopEmail(result.shopEmail);
            setShopPhone(result.shopPhone);
            setShopAddress(result.shopAddress);
            setShopDescription(result.shopDescription);
            setShopImageUrl(result.shopImageUrl);
            setLoading(false);

        } catch (error) {
            alert("An error has been occurred while trying to fetch data... Please check console.");
            console.log(error);
            props.history.push("/myshop");
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (shopEmail !== "" && shopName !== "" && shopDescription !== "" && shopAddress !== "" && shopPhone !== "") {
            const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (shopEmail && regex.test(shopEmail) !== false) {
                const phoneregex = /^\+60\d{2}(\d{7}|\d{8})$/;
                if (phoneregex.test(shopPhone)) {
                    const formData = new FormData();

                    formData.append('email', shopEmail);
                    formData.append('description', shopDescription);
                    formData.append('name', shopName);
                    formData.append('address', shopAddress);
                    formData.append('phone', shopPhone);
                    formData.append('profile_pic', photo);

                    axios.put(`http://localhost:5000/shops/${shop._id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
                        if (res.data.img) {
                            setShopImageUrl(res.data.img);
                        }
                        props.history.push("/myshop");

                        alert("your information has been updated!");
                    }).catch(error => {
                        console.log(error);
                    })

                    setPhoto(null);
                    document.getElementById("imgFile").value = "";
                } else {
                    alert("your phone number should have this format -> +60123456789");
                }
            } else {
                alert("please insert a valid email");
            }
        } else {
            alert("Please fill in the blank");
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading)
        {
          return <Loading />
        }

    return (
        <div className="profile">
            <div className="account-information">
                <h1 className="text-center">Edit My Shop</h1>

                <div className="container" >
                    <div className="column-1 box" >
                        <form className="form" method="POST" encType="multipart/form-data">
                            <p type="Shop Name:">
                                <input type="text" name="name" value={shopName} onChange={onShopNameChange}
                                    placeholder="Full name" required />
                            </p>
                            <p type="Shop Email:">
                                <input type="email" name="email" value={shopEmail} onChange={onShopEmailChange}
                                    placeholder="Email address" required />
                            </p>

                            <p type="Shop Description:">
                                <input type="text" name="description" value={shopDescription} onChange={onShopDescChange}
                                    placeholder="Description" required />
                            </p>

                            <p type="Shop Address:">
                                <input type="text" name="address" value={shopAddress} onChange={onShopAddressChange}
                                    placeholder="Address" required />
                            </p>

                            <p type="Shop Phone:">
                                <input type="text" name="phone" value={shopPhone} onChange={onShopPhoneChange}
                                    placeholder="Phone" required />
                            </p>

                            <p type="Shop Picture">
                                <input ref={inputFileRef} id="imgFile" type="file" accept=".png, .jpg, .jpeg"
                                    name="shopphoto"
                                    onChange={onPhotoChange} />
                            </p>

                            <br />

                            <center>
                                <button type="submit" className="button3" onClick={onSubmit}>Update</button>
                            </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditMyShopScreen2
