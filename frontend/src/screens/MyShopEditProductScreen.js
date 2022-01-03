import { Link } from 'react-router-dom'
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import './MyShopEditProductScreen.css';
import FileUpload from '../components/FileUpload';
import Loading from '../components/Loading';


const userData = JSON.parse(localStorage.getItem("userData"));


const MyShopEditProductScreen = (props) => {
        let { id } = useParams();
        let url = `http://localhost:5000/myshop/editproduct/${id}`; 

        const [userId] = useState(userData.userId);
        const [productId, setProductId] = useState('');

        const [shopProduct, setShopProduct]= useState(null);


        const [productName, setProductName] = useState('');
        const [productDescription, setProductDescription] = useState('');
        const [price, setPrice] = useState('');
        const [countInStock, setCountInStock] = useState('');
        const [category, setCategory] = useState('');
        const [imageUrl, setImageUrl] = useState([])

        const [shop, setShop] = useState();
        const [shopId, setShopId] = useState('');
        const [shopName, setShopName] = useState('');
        
        const [productLoading, setProductLoading] = useState(true);
        const [shopLoading, setShopLoading] = useState(true);
        
        const fetchProductInfo = async () => {
          try {
                  const response = await fetch(`http://localhost:5000/products/${id}`);
                  const result = await response.json();
  
                  if (result) {
                      setProductName(result.name);
                      setProductDescription(result.description);
                      setPrice(result.price);
                      setCountInStock(result.countInStock);
                      setCategory(result.category);

                  } else {
                      throw "Data error";
                  }
                  setProductLoading(false);
              
          } catch (error) {
              alert("An error has been occurred while trying to fetch product data... Please check console.");
              console.log(error);
          }
      }

      useEffect(() => {
        fetchProductInfo();
    }, []);

    const fetchShopInfo = async () => {
          try{
                const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
                const result = await response.json();
          
                if (result) {
                  setShopId(result._id);
                  setShopName(result.shopName);

              } else {
                  throw "Data error";
              }
              setShopLoading(false);
          
      } catch (error) {
          alert("An error has been occurred while trying to fetch shop data... Please check console.");
          console.log(error);
      }
  }

  useEffect(() => {
    fetchShopInfo();
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
            if (productName !== "" && productDescription !== "" && price !== "" && countInStock !== "" && imageUrl !== "" && category !== "" && shopId !== "" && shopName !== "") {
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
              
        
              axios.put(`http://localhost:5000/products/${id}`, product)
                .then(res => {
                  alert("Successfully edited product!");
                props.history.push("/myshop");
                console.log(res);
                }).catch(error => {
                console.log(error);
                });
              }else{
                alert("Product Price and Count In Stock must not be 0");
              }

            } else {
              alert("Please fill in the blanks");
            }
        }

        const onDelete = (event) => {
          axios.delete(`http://localhost:5000/products/${id}`)
            .then(res => {
              alert("Successfully deleted product!");
              props.history.push("/myshop");
              console.log(res);
            }).catch(error => {
              console.log(error);
            });
          }
          



           
        // If data not loaded yet, display loading sign
        if (shopLoading || productLoading) {
          return <Loading />
        }


    return (

        <div className="editproductmyshopscreen">
            
            <div className="title">
                <h2>Edit Product</h2>
            </div>

            <form className="register-form">

            {/* Product Image
            <div className="form-input">
              <FileUpload refreshFunction={onImageUrlChange} />
            </div> */}
            

            <div className="form-input">
              <label>Product Name: </label>
              <input name="productName" value={productName} onChange={onProductNameChange} required />
            </div>
              
            <div className="form-input">
              <label>Product Description: </label>
              <input name="productDesc" value={productDescription} onChange={onProductDescChange}  required />
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
              <button type="submit" onClick={onSubmit}>Edit Product</button>
              <button type="submit" onClick={onDelete}>Delete Product</button>

            </div>
          </form>
            
        </div>

    )

}


export default MyShopEditProductScreen
