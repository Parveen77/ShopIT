import React from "react";

const Footer = () => {
    let year = new Date().getFullYear()
    
    return (
        <footer className="py-1 pt-5">
            <p className="text-center mt-1 fw-bold">
                ShopIT - {year}, All Rights Reserved
            </p>
        </footer>
    )
}

export default Footer