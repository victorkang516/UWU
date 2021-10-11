import './RegisterScreen.css';
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const RegisterScreen = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const [address,setAddress] = useState('');
  const [phone,setPhone] = useState('');

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
        //this.props.history.push('/home');
      }).catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="registerscreen">
      <h1>Register</h1>
      <form className="register-form">

        <div className="form-input">
          <label>Email: </label>
          <input name="email" value={email} onChange={onEmailChange}/>
        </div>

        <div className="form-input">
          <label>Password: </label>
          <input name="password" value={password} onChange={onPasswordChange}/>
        </div>

        <div className="form-input">
          <label>Name: </label>
          <input name="name" value={name} onChange={onNameChange}/>
        </div>

        <div className="form-input">
          <label>Address: </label>
          <input name="address" value={address} onChange={onAddressChange}/>
        </div>

        <div className="form-input">
          <label>Phone: </label>
          <input name="phone" value={phone} onChange={onPhoneChange}/>
        </div>

        <div className="form-input">
          <button type="submit" onClick={onSubmit}>Register</button>
        </div>
        
      </form>
      <Link to="/login">Already have an account? Login here.</Link>
    </div>
  )
}

export default RegisterScreen;
