import './HomeScreen.css';
import { useState, useEffect } from 'react';
import Product from '../components/Product';
const url = "http://localhost:5000/products";

const HomeScreen = () => {
  const [loading,setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchData = async () =>{
    try{
      const response = await fetch(url);
      const result = await response.json();

      setProducts(result);
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

  return (
    <div className="homescreen">
      <h2 className="homesreen-title">Latest Products </h2>
      
      <div className="homescreen-products">
        {products.map((product) =>{
          if (product.countInStock > 0)
            return <Product key={product._id} {...product}/>
          
        })}
        
      </div>
    </div>
  )
}

export default HomeScreen
