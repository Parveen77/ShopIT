import React from "react";
import MetaData from "./layout/MetaData";

const Home = () => {
    return (
      <>
      <MetaData title={"Buy Best Products Online"} />
      <div class="row">
        <div class="col-12 col-sm-6 col-md-12">
          <h1 id="products_heading" class="text-secondary">Latest Products</h1>

          <section id="products" class="mt-5">
            <div class="row">
              
              <div class="col-sm-12 col-md-6 col-lg-3 my-3">
                <div class="card p-3 rounded">
                  <img
                    class="card-img-top mx-auto"
                    src="./images/default_product.png"
                    alt=""
                  />
                  <div
                    class="card-body ps-3 d-flex justify-content-center flex-column"
                  >
                    <h5 class="card-title">
                      <a href="">Product Name 1</a>
                    </h5>
                    <div class="ratings mt-auto d-flex">
                      <div class="star-ratings">
                        <i class="fa fa-star star-active"></i>
                        <i class="fa fa-star star-active"></i>
                        <i class="fa fa-star star-active"></i>
                        <i class="fa fa-star star-active"></i>
                        <i class="fa fa-star star-active"></i>
                      </div>
                      <span id="no_of_reviews" class="pt-2 ps-2"> (0) </span>
                    </div>
                    <p class="card-text mt-2">$100</p>
                    <a href="" id="view_btn" class="btn btn-block">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
              
            </div>
          </section>
        </div>
      </div>
      </>
    )
  }
  
  export default Home
