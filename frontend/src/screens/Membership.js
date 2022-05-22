import './membership.css';
import {useEffect, useState, useRef} from "react";
import auth from "../authentication/auth";

import backendUrl from '../service/backendUrl';

const Membership=()=>{
	const [rank, setRank] = useState('');
	const onRankChange = (event) => {
        setRank(event.currentTarget.value);
    }
	const [label, setLabel] = useState('');
	const onLabelChange = (event) => {
        setLabel(event.currentTarget.value);
	}
// }
const fetchData = async () =>{
    try{
      const response = await fetch(`${backendUrl}/users/account/${auth.getUserData().userId}`);
      const result = await response.json();
	//   console.log(result);

	  if(result){
	

		if(result.totalSpent<100){
			console.log(result.totalSpent)
			setRank("basic")
			setLabel("basic")
		} else if(result.totalSpent>=100&&result.totalSpent<500){
			setRank("Bronze")
			setLabel("Bronze")

		}else if(result.totalSpent>=500&&result.totalSpent<2000){
			setRank("Silver")
			setLabel("Silver")
			
		}else if(result.totalSpent>=2000){
			setRank("Gold")
			setLabel("Gold")
	  }}

    //   setProduct(result);
    //   setLoading(false);

    } catch(error){
      console.log(error);
    }
  }

// const Membership = () => {
	
    useEffect(() => {
        fetchData();
    }, []);

    return (
		<div className="profile">
		<div className="account-information">
			<h1 className="title mem">Membership</h1>
			<h2 class="member"name="label"onChange={onLabelChange}>{label}</h2>
			<div className="column-1 box memberbox">
				<b name="rank" onChange={onRankChange}>Congratulations! You just recieved a {rank} membership.</b>
				<b > Contact 0185721698 for more info from our customer service</b>
			</div>
		</div>
	</div>
    )
}

export default Membership