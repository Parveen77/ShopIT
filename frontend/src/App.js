import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home.jsx";

import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";

import { Toaster } from "react-hot-toast";
import ProductDetails from "./components/product/productDetails.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Profile from "./components/user/Profile.jsx";
//import Profile from "./components/auth/Register.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center"/>
        <Header />

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;