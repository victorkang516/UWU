import './LoginScreen.css';
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import auth from '../authentication/auth';
import logo from './uwupic.png';
// import sidebar from './sidebar.js';
// const new_component = NewHOC (sidebar);
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
    if (email !== "" && password !== "") {
      const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (email && regex.test(email) !== false) {
        axios.get(`http://localhost:5000/users/${email}`)
			.then(res => {
				
        if (res.data&&res.data.email === email&&res.data.password === password){
					

						let userData = {
							userId: res.data._id,
							name: res.data.name
						}
						
						auth.login(()=>{
							props.history.push("/");
							window.location.reload(false);
						}, userData)

					
				} else {
          alert("Please key in the right info");
        }
			}).catch(error => {
				console.log(error);
			})
		
      }else {
        alert("Please key in the right email format");}
    }else {
      alert("Fill in the blanks");}
		
	}

	useEffect(() => {
		console.log(email);
	}, [email])

	useEffect(() => {
		console.log(password);
	}, [password])

	return (
		<div className="loginscreen">

			<div className="sidebar">
				<img src={logo}></img>
				<h2>Welcome to UWU Shopping Site!!</h2>
			</div>

			<div className = "login">
				<h2>Welcome to Login page.</h2>
				<form className="login-form">

					<h2>Log In</h2>

					<div className="form-input">
						<input name="email" value={email} onChange={onEmailChange} placeholder="Email"/>
					</div>
					
					<div className="form-input">
						<input type="password" name="password" value={password} onChange={onPasswordChange} placeholder="Password"/>
					</div>

					<div className="form-input">
						<button type="submit" onClick={onSubmit}>Login</button>
					</div>

					<Link to="/register">Did not have an account? <span>Register Here</span></Link>

				</form>
			</div>
		</div>
	)
	
	
}

export default LoginScreen;