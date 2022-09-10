import express from "express";
const router = express.Router();

import multer from "multer"
const upload = multer({storage: multer.memoryStorage()});

import {authenticateToken} from '../middleware/authenticate';

import {checkAdmin} from '../middleware/checkRole';

import {checkAdminLogin} from '../middleware/checkRoleLogin';

import {
    authenticateUserLogin,
    authenticateAddress,
    authenticateDetailsUpdate,
    authenticateProductDetails,
    authenticateProductDetailsUpdate
} from '../middleware/authBody';

import {
    login,
    addUserAddress,
    getDetails,
    updateDetails,
    updateAddress,
    deleteAddress,
    getProducts,
    addProduct,
    addProductImage,
    addProductAddress,
    updateProduct,
    removeProductAddress,
    getSellerProducts,
    getAllUsers,
    getAllSellers
} from '../controllers/allUser';

router.post('/login',[authenticateUserLogin,checkAdminLogin],login);
router.use(authenticateToken);
router.use(checkAdmin);
router.post('/add-address',authenticateAddress,addUserAddress);
router.put('/update',authenticateDetailsUpdate,updateDetails);
router.put('/update-address/:uaId',authenticateAddress,updateAddress);
router.delete('/delete-address/:uaId',deleteAddress);
router.get('/products',getProducts);
router.post('/add-product',authenticateProductDetails,addProduct);
router.post('/add-product-address/:pdId',authenticateAddress,addProductAddress);
router.post('/add-product-images/:pdId',upload.single('file'),addProductImage);
router.put('/update-product/:pdId/:pId',authenticateProductDetailsUpdate,updateProduct);
router.delete('/delete-product-address/:pdId/:pId/:paId',removeProductAddress);
router.get('/seller-products',getSellerProducts);
router.get('/all-users',getAllUsers);
router.get('/all-sellers',getAllSellers);

export default router

