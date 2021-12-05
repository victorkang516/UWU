import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import './MyShopEditProductScreen.css';
import FileUpload from '../components/FileUpload';
import Loading from '../components/Loading';


const userData = JSON.parse(localStorage.getItem("userData"));


const MyShopAddProductScreen = (props) => {

        const [userId] = useState(userData.userId);
        const [productId, setProductId] = useState('');
        const [productName, setProductName] = useState('');
        const [productDescription, setProductDescription] = useState('');
        const [price, setPrice] = useState('');
        const [countInStock, setCountInStock] = useState('');
        const [category, setCategory] = useState('');
        const [imageUrl, setImageUrl] = useState([])

        const [shop, setShop] = useState();
        const [shopId, setShopId] = useState('');
        const [shopName, setShopName] = useState('');
        
        const [loading, setLoading] = useState(true);
        
        useEffect(() => {
            const fetchData = async () =>{
              try{
                const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
                const result = await response.json();
          
                setShop(result);
                setLoading(false);
          
              } catch(error){
                console.log(error);
              }
              
              try {
                const response = await fetch(`http://localhost:5000/products/seller/shop._id`);
                const result = await response.json();
                
                setShopProducts(result);
                setLoading(false);

                } catch (error){
                console.log(error);
                }
                

            }
            fetchData();
            console.log("Fetch Data");
          }, []);

          // const setShop = (result) => {
          //   setShopId(result._id);
          //   setShopName(result.shopName);
          // }

          const setShopProducts = (result) => {
            setProductId(result._id);
            setProductName(result.name);
            setProductDescription(result.description);
            setPrice(result.price);
            setCountInStock(result.countInStock);
            setCategory(result.category);
            setImageUrl(result.imageUrl);
            setShopId(result.shopId);
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
    
              const product = {
                name: productName,
                description: productDescription,
                price: price,
                countInStock: countInStock,
                category: category,
                imageUrl: imageUrl,
                shopId: shop._id,
                shopName: shop.shopName
              };
              
        
              axios.put('http://localhost:5000/products/:productid', product)
                .then(res => {
                console.log(res);
                }).catch(error => {
                console.log(error);
                });
            
            } else {
              alert("Please fill in the blanks");
            }
        }

        const onDelete = () => {
          axios.delete('http://localhost:5000/products/:productid')
            .then(res => {
              console.log(res);
            }).catch(error => {
              console.log(error);
            });
          }
          



           
        if (loading)
        {
          return <Loading />
        }



    return (

        <div className="editproductmyshopscreen">
            Not complete yet
            <div className="title">
                <h2>Edit Product</h2>
            </div>

            <form className="register-form">

            Product Image
            <div className="form-input">
              <FileUpload refreshFunction={onImageUrlChange} />
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
              <label>Product Count In Stock: </label>
              <input type="number" 
                value={countInStock} 
                onChange={onCountInStockChange} 
                min="1" 
                max="100" required />
            </div>

            <div className="form-input">
              <label>Product Price: </label>
              <input name="productPrice" value={price} onChange={onPriceChange} required />
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
              <button type="submit" onClick={onSubmit}>Edit Product</button>
              <button type="submit" onClick={onDelete}>Delete Product</button>

            </div>
          </form>
            
        </div>

    )

}


export default MyShopAddProductScreen
