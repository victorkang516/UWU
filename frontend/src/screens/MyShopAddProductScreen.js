import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import './MyShopScreen.css';

const userData = JSON.parse(localStorage.getItem("userData"));


const MyShopAddProductScreen = () => {


    return (

        <div className="myshopscreen">
            <h2>Add Product</h2>
        </div>

    )

}


export default MyShopAddProductScreen
