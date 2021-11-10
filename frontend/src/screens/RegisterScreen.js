import './LoginScreen.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from './uwupic.png';
import auth from '../authentication/auth';


const RegisterScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

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

  const onSubmit = (event) => {
    event.preventDefault();
    if (email !== "" && password !== "" && name !== "" && address !== "" && phone !== "") {
      const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (email && regex.test(email) !== false) {

        const user = {
          email: email,
          password: password,
          name: name,
          address: address,
          phone: phone
        };

        axios.post('http://localhost:5000/users', user)
          .then(res => {
            console.log(res);
            alert ("you have successfully registered!");
            props.history.push("/login", {success:true});
            // auth.login(() => {
            //   props.history.push("/");
            //   window.location.reload(false);
            // }, user)
          }).catch(error => {
            console.log(error);
          })
        } else {
          alert("please insert valid email");
        }
    } else {
      alert("Please fill in the blanks");
    }


  }

  return (
    <div className="loginscreen">

      <div className="sidebar">
        <img src={logo}></img>
        <h2>Welcome to UWU Shopping Site!!</h2>
      </div>

      <div className="login">
        <h1>Register</h1>
        <form className="login-form">
          <div className="form-input">
            <label>Email: </label>
            <input type="email" name="email" value={email} onChange={onEmailChange} required />
          </div>

          <div className="form-input">
            <label>Password: </label>
            <input type="password" name="password" value={password} onChange={onPasswordChange} required />
          </div>

          <div className="form-input">
            <label>Name: </label>
            <input name="name" value={name} onChange={onNameChange} required />
          </div>

          <div className="form-input">
            <label>Address: </label>
            <input name="address" value={address} onChange={onAddressChange} required />
          </div>

          <div className="form-input">
            <label>Phone: </label>
            <input name="phone" value={phone} onChange={onPhoneChange} required />
          </div>

          <div className="form-input">
            <button type="submit" onClick={onSubmit}>Register</button>
          </div>
          <Link to="/login">Already have an account? Login here.</Link>
        </form>
      </div>
    </div>
  )
}

export default RegisterScreen;