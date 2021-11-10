import './HomeScreen.css';
import { useState, useEffect } from 'react';
import Product from '../components/Product';
import {Link} from 'react-router-dom';


const HomeScreen = () => {
  const [loading,setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [streamings, setStreamings] = useState([]);

  const fetchData = async () =>{
    try{
      const response = await fetch("http://localhost:5000/products");
      const result = await response.json();

      setProducts(result);
      setLoading(false);

    } catch(error){
      console.log(error);
    }

    try{
      const response = await fetch("http://localhost:5000/streamings");
      const result = await response.json();

      setStreamings(result);

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


      {/* <h2>Featured Streamings</h2> */}
      <div>
        {streamings.map(streaming => {
          return <Link key={streaming._id} to={`/streamingbuyer/${streaming._id}`} className="">
          <p>{streaming.title}</p>
        </Link>
        })}
        
      </div>


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
