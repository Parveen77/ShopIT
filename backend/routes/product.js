import express from 'express';
import { 
        deleteProduct,
        getProducts,
        newProduct,
        getProductDetails,
        updateProduct,
        createProductReview,
        getProductReviews,
        deleteReview,
        canUserReview,      
} from '../controllers/productControllers.js';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js'

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(isAuthenticatedUser,authorizeRoles("admin"), newProduct);

router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct);
router.route("/products/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProduct);

router.route("/reviews")
.put(isAuthenticatedUser, createProductReview)
.get(isAuthenticatedUser, getProductReviews);

router.route("/admin/reviews").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

router.route("/can_review").get(isAuthenticatedUser, canUserReview)

export default router; 
