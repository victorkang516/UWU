import './MyShopAddProductScreen.css';
import React from 'react';
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import Loading from '../components/Loading';

const userData = JSON.parse(localStorage.getItem("userData"));

const MyShopAddProductScreen = (props) => {

    const inputFileRef = useState(null);
    const [photo, setPhoto] = useState('');

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [category, setCategory] = useState('');
    const [shopId, setShopId] = useState('');
    const [shopName, setShopName] = useState('');

    const [loading, setLoading] = useState(true);


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

    const onPhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
                const result = await response.json();

                setShopId(result._id); // _id NOT id
                setShopName(result.shopName);
                setLoading(false);

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        console.log("Fetch Data");
    }, []);

    if (loading) {
        return <Loading />
    }


    const onSubmit = (event) => {
        event.preventDefault();

        if (productName !== "" && productDescription !== "" && price !== "" && countInStock !== "" && category !== "" && shopId !== "" && shopName !== "") {
            if (price > 0 && countInStock > 0) {

                const formData = new FormData();

                formData.append('name', productName);
                formData.append('description', productDescription);
                formData.append('price', price);
                formData.append('countInStock', countInStock); // Capital Error (countinstock should be countInStock)
                formData.append('category', category);
                formData.append('profile_pic', photo);
                formData.append('shopId', shopId); // shopId is required
                formData.append('shopName', shopName); // shopName is required

                axios.post(`http://localhost:5000/products`, formData, { // only submit 1 data object
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    alert("Product added successfully.");
                    props.history.push("/myshop");
                    
                }).catch(error => {
                    console.log(error);
                    alert("error occured");
                })

                setPhoto(null);
                document.getElementById("imgFile").value = "";

            } else {
                alert("Product Price and Count In Stock must not be 0");
            }
        } else {
            alert("Please fill in the blank");
        }
    }



    return (
        <div className="addproductmyshopscreen">
            <div className="account-information1">

                <div className="container" >
                    <div className="column-1 box1" >
                        
                        <form className="form" method="POST" encType="multipart/form-data">
                        <h1 className='title'>Add Product </h1>

                            <div className="form-input" type="Product Name:">              
                                <label>Product Name: </label>
                                    <input type="text" name="name" value={productName} onChange={onProductNameChange}
                                        placeholder="Product name" required />
                                </div>
                                <div className="form-input" type="Product Description:">
                                <label>Product Description: </label>

                                    <input type="text" name="description" value={productDescription} onChange={onProductDescChange}
                                        placeholder="Product Description" required />
                                </div>

                                <div className="form-input" type="Product Price:">
                                <label>Product Price: </label>
                                    <input type="number" name="price" value={price} onChange={onPriceChange}
                                        placeholder="Price" required />
                                </div>

                                <div className="form-input" type="Product Category:">
                                <label>Product Category: </label>
                                    <select type="text" name="category" value={category} onChange={onCategoryChange} 
                                    placeholder='Product Category' required>
                                        <option value="Headphones">Headphones</option>
                                        <option value="Speakers">Speaker</option>
                                        <option value="Smart Device">Smart Device</option>
                                        <option value="Mobile Phone">Mobile Phone</option>
                                        <option value="Camera">Camera</option>
                                        <option value="Smart Watch">Smart Watch</option>
                                    </select>
                                </div>

                                <div className="form-input" type="Product Count In Stock:">
                                <label>Product Count In Stock: </label>
                                    <input type="number" name="countinstock" placeholder='Count In Stock'
                                        value={countInStock}
                                        onChange={onCountInStockChange}
                                        min="1"
                                        max="100" required />
                                </div>

                                <div className="form-input" type="Product Picture">
                                <label>Product Image: </label>
                                    <input ref={inputFileRef} id="imgFile" type="file" accept=".png, .jpg, .jpeg"
                                        name="photo"
                                        onChange={onPhotoChange} />
                                </div>

                                <br />

                                <center>
                                    <button type="submit" className="button" onClick={onSubmit}>Create</button>
                                </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyShopAddProductScreen
