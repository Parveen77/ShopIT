import React, { useEffect, useState } from 'react';
import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';
import { useSelector } from 'react-redux';
import { calculateOrderCost } from "../../helper.js";
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from '../../redux/api/orderApi.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
  
  const PaymentMethod = () =>  {

	const [method, setMethod] = useState("");
	const navigate = useNavigate();

	const { shippingInfo, cartItems} = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth)

	const [createNewOrder, { error, isSuccess}] = useCreateNewOrderMutation();

	const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateOrderCost(cartItems);

	const [stripeCheckoutSession, { data: checkoutData, error: checkoutError, isLoading}] = useStripeCheckoutSessionMutation();

	useEffect(() => {
		if(checkoutData) {
			window.location.href = checkoutData?.url;
			//console.log(checkoutData);
			
		}
		if (checkoutError) {
			toast.error(error?.data?.message)
		}
	}, [checkoutData])
	
	useEffect(() => {
		if(error) {
			toast.error(error?.data?.message);
		}
		if(isSuccess) {
			toast.success("Order Placed Successfully");
			navigate("/")
		}
	}, [error, isSuccess])

	const submitHandler = (e) => {
		e.preventDefault();

		console.log(method)

		if( method === "COD") {
			//create COD order
			const orderData = {
				shippingInfo,
				orderItems: cartItems,
				itemsPrice,
				shippingAmount: shippingPrice,
      			taxAmount: taxPrice,
      			totalAmount: totalPrice,
				paymentInfo: {
					status: "Not Paid",
				},
				paymentMethod:"COD"
			};

			createNewOrder(orderData)
		}
		if(method === "Card") {
			//Stripe checkout
			const orderData = {
				shippingInfo,
				orderItems: cartItems,
				itemsPrice,
				shippingAmount: shippingPrice,
      			taxAmount: taxPrice,
      			totalAmount: totalPrice,
			};
			stripeCheckoutSession(orderData)
		}

	}
	return (
		<>
		<MetaData title={"Payment Method"} />
	  <CheckoutSteps shipping confirmOrder payment/>

		<div class="row wrapper">
		<div class="col-10 col-lg-5">
		  <form
			class="shadow rounded bg-body"
			onSubmit={submitHandler}
		  >
			<h2 class="mb-4">Select Payment Method</h2>
  
			<div class="form-check">
			  <input
				class="form-check-input"
				type="radio"
				name="payment_mode"
				id="codradio"
				value="COD"
				onChange={(e) => setMethod("COD")}
			  />
			  <label class="form-check-label" for="codradio">
				Cash on Delivery
			  </label>
			</div>
			<div class="form-check">
			  <input
				class="form-check-input"
				type="radio"
				name="payment_mode"
				id="cardradio"
				value="Card"
				onChange={(e) => setMethod("Card")}
			  />
			  <label class="form-check-label" for="cardradio">
				Card - VISA, MasterCard
			  </label>
			</div>
  
			<button id="shipping_btn" type="submit" class="btn py-2 w-100" disabled= {isLoading}>
			  CONTINUE
			</button>
		  </form>
		</div>
	  </div>
	  </>
	);
  }
  
  export default PaymentMethod;

  