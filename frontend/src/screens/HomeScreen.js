import './HomeScreen.css';
import { useState, useEffect } from 'react';
import Product from '../components/Product';
import {Link} from 'react-router-dom';


const HomeScreen = () => {
  const [loading,setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [products, setProducts] = useState([]);
  const [streamings, setStreamings] = useState([]);

  const [currentCategory, setCurrentCategory] = useState("All");

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

  const getUniqueCategories = () => {
    let newCategories = [];
    products.map(product => {
      newCategories.push(product.category);
    });
    newCategories = Array.from(new Set(newCategories));
    setCategories(categories => [...categories, ...newCategories]);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getUniqueCategories();
  }, [products]);



  if (loading) {
    return <div className="loadingscreen">
      <div className="loading"></div>
    </div>
  }

  return (
    <div className="homescreen">

      <div className="homescreen-streaming">
        <h2>Featured Streamings</h2>
          <div>
            {streamings.map(streaming => {
              return <Link key={streaming._id} to={`/streamingbuyer/${streaming._id}`} className="">
              <p>{streaming.title}</p>
            </Link>
            })}
            
          </div>
      </div>


      <h2 className="homesreen-title">Latest Products </h2>

      <div className="homescreen-main">
        <div className="homescreen-categories">
          <h3>
            <i className="fa fa-list" aria-hidden="true"></i>
            Categories
          </h3>
          {categories.map(category => {
            return <button key={category} onClick={()=> setCurrentCategory(category)}>{category}</button>
          })}
        </div>

        <div className="homescreen-catalog">
          
          <div className="homescreen-products">
            {products.filter( product => 
              currentCategory === product.category || currentCategory === "All"
            ).map( product =>{
              if (product.countInStock > 0)
                return <Product key={product._id} {...product}/>
              
            })}
            
          </div>
        </div>

      </div>
      
    </div>
  )
}

export default HomeScreen
