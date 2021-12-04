import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import './MyShopAddProductScreen.css';
import FileUpload from '../components/FileUpload';

const userData = JSON.parse(localStorage.getItem("userData"));


const MyShopAddProductScreen = (props) => {

        const [userId] = useState(userData.userId);
        const [productName, setProductName] = useState('');
        const [productDescription, setProductDescription] = useState('');
        const [productImage, setProductImage] = useState('');
        const [productQuantity, setProductQuantity] = useState('');
        const [productCategory, setProductCategory] = useState('');
        const [shopId, setShopId] = useState('');
        const [shopName, setShopName] = useState('');
        const [Images, setImages] = useState([])

        const [loading, setLoading] = useState(true);
        
        useEffect(() => {
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
            fetchData();
            console.log("Fetch Data");
          }, []);

          const setShopData = (result) => {
            setShopId(result._id);
            setShopName(result.shopName);
          }


        const onProductNameChange = (event) => {
            setProductName(event.currentTarget.value);
          }  
             
          const onProductDescChange = (event) => {
            setProductDescription(event.currentTarget.value);
          }
        
          const onProductQuantityChange = (event) => {
            setProductQuantity(event.currentTarget.value);
          }
        
          const onProductCategoryChange = (event) => {
            setProductCategory(event.currentTarget.value);
          }
        
          const onProductImageChange = (event) => {
            setProductImage(event.currentTarget.value);
          }

          const updateImages = (newImages) => {
            setImages(newImages)
        }

          

          const onSubmit = (event) => {
            event.preventDefault();
            if (productName !== "" && productDescription !== "" && productQuantity !== "" && productCategory !== "" && shopId !== "" && shopName !== "") {
    
                const product = {
                  shopId: shopId,
                  shopName: shopName,
                  productName: productName,
                  productDescription: productDescription,
                  //productImage: productImage,
                  productQuantity: productQuantity,
                  productCategory: productCategory
                };
        
                axios.post('http://localhost:5000/products', product)
                .then(res => {
                  props.history.push("/product");
                            //window.location.reload(false);
                  console.log(res);
                }).catch(error => {
                  console.log(error);
                });
            
            } else {
              alert("Please fill in the blanks");
            }
        }

           
        if (loading)
        {
          return <div className="loadingscreen">
          <div className="loading"></div>
        </div>
        } 


    return (

        <div className="addproductmyshopscreen">
            Not complete yet
            <div className="title">
                <h2>Add Product</h2>
            </div>

            <form className="register-form">

            Product Image
            <div className="form-input">
              <FileUpload refreshFunction={onProductImageChange} />
            </div>
            

            <div className="form-input">
              <label>Product Name: </label>
              <input name="productName" value={productName} onChange={onProductNameChange} required />
            </div>
              
            <div className="form-input">
              <label>Product Description: </label>
              <input name="productDesc" value={productDescription} onChange={onProductDescChange} required />
            </div>
  
            <div className="form-input">
              <label>Product Quantity: </label>
              <input type="number" 
                value={productQuantity} 
                onChange={onProductQuantityChange} 
                min="1" 
                max="100" required />
            </div>
  
            <div className="form-input">
              <label>Product Category: </label>
              <input name="productCategory" value={productCategory} onChange={onProductCategoryChange} required />
            </div>

            <div className="form-input">
              <button type="submit" onClick={onSubmit}>Add Product</button>
            </div>
          </form>
            
        </div>

    )

}


export default MyShopAddProductScreen
