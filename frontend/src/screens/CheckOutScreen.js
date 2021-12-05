import './CheckOutScreen.css';
import { useState,useEffect } from 'react';

const userData = JSON.parse(localStorage.getItem("userData"));

const CheckOutScreen = () => {
    
    const [loading, setLoading] = useState(true);

    const [checkOut, setCheckOut] = useState([]);

    const fetchData = async () =>{
        try{
          
          const response = await fetch(`http://localhost:5000/orders/unpaid/${userData.userId}`);
          const result = await response.json();
    
          setCheckOut(result);
          setLoading(false);
    
        } catch(error){
          console.log(error);
        }
      }

      useEffect(() => {
        fetchData();
      }, []);

      if (loading) {
        return <div className="loadingscreen">
          <div className="loading"></div>
        </div>
      }
    
      return <div className="cartscreen">
                <div className="py-3 bg-warning">
                    <div className="container">
                        <h6>Checkout</h6>
                    </div>
                </div>

                <div className="py-4">
                    <div className="container">
                        <div className="row">

                            <div className="col-md-7">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Basic Information</h4>
                                    </div>
                                    <div className="card-body">

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Name </label>
                                                    <input type="text" name="name" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Email </label>
                                                    <input type="text" name="name" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Address </label>
                                                    <input type="text" name="name" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Phone </label>
                                                    <input type="text" name="name" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <table>
                                    <thead>
                                        <tr>
                                            <th width="50%" >Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>adaewdd</td>
                                            <td>600</td>
                                            <td>2</td>
                                            <td>1200</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </div>
                    </div>
                </div>

          </div>
}


export default CheckOutScreen