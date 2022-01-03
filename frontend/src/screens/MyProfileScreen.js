import './MyProfileScreen.css';
import {useEffect, useState, useRef} from "react";
import auth from "../authentication/auth";
import axios from 'axios';
import {Link} from 'react-router-dom'

const MyProfileScreen = () => {
    const inputFileRef = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [photo, setPhoto] = useState('');
    const [imageHash, setImageHash] = useState('');

    const onEmailChange = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordChange = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onNameChange = (event) => {
        setName(event.currentTarget.value);
    }

    const onAddressChange = (event) => {
        setAddress(event.currentTarget.value);
    }

    const onPhoneChange = (event) => {
        setPhone(event.currentTarget.value);
    }

    const onPhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    }

    const fetchAccountInformation = async () => {
        try {
            if (auth.isAuthenticated()) {
                const response = await fetch(`http://localhost:5000/users/account/${auth.getUserData().userId}`);
                const result = await response.json();

                if (result) {
                    setName(result.name);
                    setEmail(result.email);
                    setPhone(result.phone);
                    setAddress(result.address);
                    setProfilePhoto(result.imgUrl);
                    setImageHash(Date.now());
                } else {
                    throw "Data error";
                }
                setLoading(false);
            } else {
                throw "Not authenticated";
            }
        } catch (error) {
            alert("An error has been occurred while trying to fetch data... Please check console.");
            console.log(error);
        }
    }
    const onSubmit = (event) => {
        event.preventDefault();

        if (email !== "" && name !== "" && address !== "" && phone !== "") {
            const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (email && regex.test(email) !== false) {
                const phoneregex = /^\+60\d{2}(\d{7}|\d{8})$/;
                if (phoneregex.test(phone)) {
                    const formData = new FormData();
                    console.log(name);

                    formData.append('email', email);
                    formData.append('password', password);
                    formData.append('name', name);
                    formData.append('address', address);
                    formData.append('phone', phone);
                    formData.append('profile_pic', photo);

                    axios.put(`http://localhost:5000/users/${auth.getUserData().userId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
                        if (res.data.img) {
                            setImageHash(Date.now());
                            setProfilePhoto(res.data.img);
                        }

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

    const onImgClick = () => {
        inputFileRef.current.click();
    }

    useEffect(() => {
        fetchAccountInformation();
    }, []);

    if (loading) {
        return <div className="loadingscreen">
            <div className="loading"></div>
        </div>
    }

    return (
        <div className="profile">
            <div className="profile-nav">
                <div className="user-heading round">
                    <a href="#" onClick={onImgClick}>
                        <img
                            src={`${process.env.PUBLIC_URL}/images/${profilePhoto}?${imageHash}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://bootdey.com/img/Content/avatar/avatar3.png'
                            }} alt=""/>
                    </a>
                    <h1>{name}</h1>
                    <p>{email}</p>
                </div>
            </div>

            <div className="account-information">
                <h1 className="text-center">My Profile</h1>

                <div className="container">
                    <div className="column-1 box">
                        <form className="form" method="POST" encType="multipart/form-data">
                            <p type="Name:">
                                <input type="text" name="name" value={name} onChange={onNameChange}
                                       placeholder="Full name" required/>
                            </p>
                            <p type="Email:">
                                <input type="email" name="email" value={email} onChange={onEmailChange}
                                       placeholder="Email address" required/>
                            </p>

                            <p type="Password:">
                                <input type="password" name="password" value={password} onChange={onPasswordChange}
                                       placeholder="Password" required/>
                            </p>

                            <p type="Address:">
                                <input type="text" name="address" value={address} onChange={onAddressChange}
                                       placeholder="Address" required/>
                            </p>

                            <p type="Phone:">
                                <input type="text" name="phone" value={phone} onChange={onPhoneChange}
                                       placeholder="Phone" required/>
                            </p>

                            <p type="Profile Picture">
                                <input ref={inputFileRef} id="imgFile" type="file" accept=".png, .jpg, .jpeg"
                                       name="photo"
                                       onChange={onPhotoChange}/>
                            </p>

                            <br/>

                            <center>
                                <button type="submit" className="button3" onClick={onSubmit}>Update</button>
                            </center>
                        </form>
                    </div>

                    <div className="column-2 box">
                        <h1>Membership</h1>
                        <p>
                            Uwu shopping site membership is an important element of a marketing program designed to
                            build customer loyalty. By applying membership, you can get discounts and offers from us. So
                            apply now!
                            <br/><br/>
                            <div className="text-center">
                                <Link to={'/membership'} className="Link" type="button">
                                    <span><b>Apply Membership!</b></span>
                                </Link>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfileScreen
