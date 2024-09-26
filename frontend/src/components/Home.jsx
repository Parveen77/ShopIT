import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productApi.js";
import ProductItem from "./product/productItem.jsx";
import Loader from "./layout/Loader.jsx";
import toast from "react-hot-toast";

const Home = () => {

    const { data, isLoading, error, isError } = useGetProductsQuery();
    //console.log(data, isLoading);
    //console.log(useGetProductsQuery());
    useEffect(() => {
      if(isError) {
        toast.error(error?.data?.message);
      }
    }, [isError])

    if(isLoading) return <Loader />
    
    return (
      <>
      <MetaData title={"Buy Best Products Online"} />
      <div class="row">
        <div class="col-12 col-sm-6 col-md-12">
          <h1 id="products_heading" class="text-secondary">Latest Products</h1>

          <section id="products" class="mt-5">
            <div class="row">
            {data?.products?.map((product) => (
                <ProductItem product={product} />
              ))}
              
            </div>
          </section>
        </div>
      </div>
      </>
    )
  };
  
  export default Home
