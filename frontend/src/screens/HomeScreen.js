import './HomeScreen.css';
import { useState, useEffect } from 'react';
import Product from '../components/Product';
import {Link} from 'react-router-dom';

import ReactPaginate from 'react-paginate';


const HomeScreen = () => {
  const [loading,setLoading] = useState(true);

  const [categories, setCategories] = useState(["All"]);
  const [currentCategory, setCurrentCategory] = useState("All");

  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);

  const [streamings, setStreamings] = useState([]);

  // We start with an empty list of products.
  const [itemsPerPage] = useState(8);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);


  // ------------------------- Fetch data -------------------------
  useEffect(() => {
    fetchData();
  }, []);

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


  // --------------------- Filter Categories ---------------------------
  useEffect(() => {
    if (products != null) {
      getUniqueCategories();
      filterProductsByCategory();
    }
  }, [products]);

  useEffect(() => {
    filterProductsByCategory();
  }, [currentCategory]);

  const getUniqueCategories = () => {
    let newCategories = [];
    products.map(product => {
      newCategories.push(product.category);
    });
    newCategories = Array.from(new Set(newCategories));
    setCategories(categories => [...categories, ...newCategories]);
  }

  const filterProductsByCategory = () => {
    let newProducts = products.filter( product => currentCategory === product.category || currentCategory === "All" );
    setProductsByCategory(newProducts);
  }


  //------------------ Pagination -----------------------
  useEffect(() => {
    if (productsByCategory !== [])
    {
      // Fetch productsByCategory from another resources.
      const endOffset = itemOffset + itemsPerPage;
      console.log(`Loading productsByCategory from ${itemOffset} to ${endOffset}`);
      setCurrentItems(productsByCategory.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(productsByCategory.length / itemsPerPage));
    }
  }, [itemOffset, itemsPerPage, productsByCategory]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  useEffect(()=> {
    console.log("Current Items done load");
  }, [currentItems]);


  // ------------------- Render Contents --------------------
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
            {currentItems.map( product =>{
              if (product.countInStock > 0)
                return <Product key={product._id} {...product}/>
              
            })}
          
          </div>

          <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          className="homescreen-pagination"
          />

        </div>

      </div>
      
    </div>
  )
}

export default HomeScreen
