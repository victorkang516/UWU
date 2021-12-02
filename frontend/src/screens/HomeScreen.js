import './HomeScreen.css';
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

// React Paginate
import ReactPaginate from 'react-paginate';
// React Slick
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Components
import Loading from '../components/Loading';
import Streaming from '../components/Streaming';
import Product from '../components/Product';


const HomeScreen = (props) => {
  const [loadingProducts,setLoadingProducts] = useState(true);
  const [loadingStreaming, setLoadingStreamings] = useState(true);

  const [categories, setCategories] = useState(["All"]);
  const [currentCategory, setCurrentCategory] = useState("All");

  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);

  // We start with an empty list of products.
  const [itemsPerPage] = useState(8);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  
  // Streaming
  const [streamings, setStreamings] = useState([]);


  // ------------------------- Fetch data -------------------------
  useEffect(() => {
    const fetchData = async () =>{
      try{
        const response = await fetch("http://localhost:5000/products");
        const result = await response.json();
  
        setProducts(result);
        setLoadingProducts(false);
  
      } catch(error){
        console.log(error);
      }
  
      try{
        const response = await fetch("http://localhost:5000/streamings");
        const result = await response.json();
  
        setStreamings(result);
        setLoadingStreamings(false);
  
      } catch(error){
        console.log(error);
      }
    }
    fetchData();
  }, []);


  // --------------------- Filter Categories ---------------------------
  useEffect(() => {
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
    if (products != null) {
      getUniqueCategories();
      filterProductsByCategory();
    }
  }, [products]);

  

  useEffect(() => {
    const filterProductsByCategory = () => {
      let newProducts = products.filter( product => currentCategory === product.category || currentCategory === "All" );
      setProductsByCategory(newProducts);
    }
    filterProductsByCategory();
  }, [currentCategory]);
  


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


  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "slick",
    autoplay: true,
    centerMode: true,
    centerPadding: '100px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      }
    ]
  };


  // ------------------- Render Contents --------------------
  if (loadingProducts || loadingStreaming) {
    return <Loading />
  }

  return (
    <div className="homescreen">

      <h2 className="label">Featured Streamings</h2>

      <div className="homescreen-streaming">
        <Slider {...settings}>
          {streamings.length !== 0 ? streamings.map( streaming => {
            return <Streaming key={streaming._id} {...streaming}/>
          })
          :
          <div className="no-streaming">No Live streaming</div>
          }
        </Slider>
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
                return <Link to={`/product/${product._id}`} key={product._id} className="products">
                  <Product {...product}/>
                </Link>
              
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
