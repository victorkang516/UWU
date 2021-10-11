import './LoginScreen.css';
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import auth from '../authentication/auth';

const LoginScreen = (props) => {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const onEmailChange = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmit = (event) => {
    event.preventDefault();

    axios.get(`http://localhost:5000/users/${email}`)
      .then(res => {
        if (res.data.email === email){
          if (res.data.password === password){

            let userData = {
              email: email,
              name: res.data.name,
              shopId: res.data.shopId
            }
            
            auth.login(()=>{
              props.history.push("/");
              window.location.reload(false);
            }, userData)

          }
        }
      }).catch(error => {
        console.log(error);
      })
    
  }

  useEffect(() => {
    console.log(email);
  }, [email])

  useEffect(() => {
    console.log(password);
  }, [password])

  return (
    <div className="loginscreen">
      <h2>Welcome to UWU Shopping Site! Please Login.</h2>
      <form className="login-form">

        <h2>Log In</h2>

        <div className="form-input">
          <input name="email" value={email} onChange={onEmailChange} placeholder="Email"/>
        </div>
        
        <div className="form-input">
          <input name="password" value={password} onChange={onPasswordChange} placeholder="Password"/>
        </div>

        <div className="form-input">
          <button type="submit" onClick={onSubmit}>Login</button>
        </div>

        <Link to="/register">Did not have an account? <span>Register Here</span></Link>

      </form>
      
    </div>
  )
  
  
}

export default LoginScreen;
