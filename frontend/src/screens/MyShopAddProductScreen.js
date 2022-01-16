import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import './MyShopAddProductScreen.css';
import FileUpload from '../components/FileUpload';
import Loading from '../components/Loading';
import Product from '../components/Product';



const userData = JSON.parse(localStorage.getItem("userData"));


const MyShopAddProductScreen = (props) => {

        const [categories, setCategories] = useState(["All"]);


        const [userId] = useState(userData.userId);
        const [productName, setProductName] = useState('');
        const [productDescription, setProductDescription] = useState('');
        const [price, setPrice] = useState('');
        const [countInStock, setCountInStock] = useState('');
        const [category, setCategory] = useState('');
        const [imageUrl, setImageUrl] = useState([])

        const [shopId, setShopId] = useState('');
        const [shopName, setShopName] = useState('');
        
        const [loading, setLoading] = useState(true);
        
        useEffect(() => {
            const fetchData = async () =>{
              try{
                const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
                const result = await response.json();
          
                setShopData(result);
                setLoading(false);
          
              } catch(error){
                alert("An error has been occurred while trying fetch shop data... Please check console.");
                console.log(error);
                props.history.push("/myshop");
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

          const onPriceChange = (event) => {
            setPrice(event.currentTarget.value);
          }
        
          const onCountInStockChange = (event) => {
            setCountInStock(event.currentTarget.value);
          }
        
          const onCategoryChange = (event) => {
            setCategory(event.currentTarget.value);
          }
        
          // const onProductImageChange = (event) => {
          //   setProductImage(event.currentTarget.value);
          // }

          const onImageUrlChange = (newImageUrl) => {
            setImageUrl(newImageUrl)
        }

      //   router.post("/uploadImage", auth, (req, res) => {

      //     upload(req, res, err => {
      //         if (err) {
      //             return res.json({ success: false, err })
      //         }
      //         return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
      //     })
      
      // });

          

          const onSubmit = (event) => {
            event.preventDefault();
            if (productName !== "" && productDescription !== "" && price !== "" && countInStock !== "" && category !== "" && imageUrl !== "" && shopId !== "" && shopName !== "") {
              if (price > 0 && countInStock > 0) {
    
              const product = {
                name: productName,
                description: productDescription,
                price: price,
                countInStock: countInStock,
                category: category,
                imageUrl: "https://mpama.com/wp-content/uploads/2017/04/default-image.jpg",
                shopId: shopId,
                shopName: shopName
              };
              
        
              axios.post('http://localhost:5000/products', product)
              .then(res => {
                alert("Successfully added product!");
                props.history.push("/myshop");
                console.log(res);
              }).catch(error => {
                alert("An error has been occurred while trying add product... Please check console.");
                console.log(error);
                props.history.push("/myshop");
              });
            }else{
              alert("Product Price and Count In Stock must not be 0");
            }
            
            } else {
              alert("Please fill in the blanks");
            }
        }

           
        if (loading)
        {
          return <Loading />
        }


    return (

        <div className="addproductmyshopscreen">
            <div className="title">
                <h2>Add Product</h2>
            </div>

            <form className="register-form">

            {/* Product Image
            <div className="form-input">
              <input type="file" name="myImage" accept="image/*" />

               <FileUpload refreshFunction={onImageUrlChange} /> 
            </div> */}
            

            <div className="form-input">
              <label>Product Name: </label>
              <input name="productName" value={productName} onChange={onProductNameChange} required />
            </div>
              
            <div className="form-input">
              <label>Product Description: </label>
              <input name="productDesc" value={productDescription} onChange={onProductDescChange} required />
            </div>
  
            <div className="form-input">
              <label>Product Count In Stock: </label>
              <input type="number" 
                value={countInStock} 
                onChange={onCountInStockChange} 
                min="1" 
                max="100" required />
            </div>

            <div className="form-input">
              <label>Product Price: </label>
              <input type="number" name="productPrice" value={price} onChange={onPriceChange} required />
            </div>
  
            <div className="form-input">
              <label>Product Category: </label>
              <label>
                <select type="text" name="category" value={category} onChange={onCategoryChange} required> 
                <option value selected>Select</option>
                <option value="Headphones">Headphones</option>
                <option value="Speakers">Speaker</option>
                <option value="Smart Device">Smart Device</option>
                <option value="Mobile Phone">Mobile Phone</option>
                <option value="Camera">Camera</option>
                <option value="Smart Watch">Smart Watch</option>
                </select>
              </label>
                
              
            </div>

            <div className="form-input">
              <button type="submit" onClick={onSubmit}>Add Product</button>
            </div>
          </form>
            
        </div>

    )

}


export default MyShopAddProductScreen
