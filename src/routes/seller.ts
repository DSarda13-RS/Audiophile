import express from "express";
const router = express.Router();

import multer from "multer"
const upload = multer({storage: multer.memoryStorage()});

import {authenticateToken} from '../middleware/authenticate';

import {checkSeller} from '../middleware/checkRole';

import {checkSellerLogin} from '../middleware/checkRoleLogin';

import {
    authenticateUser,
    authenticateUserLogin,
    authenticateAddress,
    authenticateProductDetails,
    authenticateProductDetailsUpdate
} from '../middleware/authBody';

import {
    login,
    registerSeller,
    addProduct,
    addProductImage,
    addProductAddress,
    updateProduct,
    removeProductAddress,
    getSellerProducts
} from '../controllers/allUser';

router.post('/register',upload.single('file'),authenticateUser,registerSeller);
router.post('/login',[authenticateUserLogin,checkSellerLogin],login);
router.use(authenticateToken) // login check
router.use(checkSeller) // seller check
router.post('/add-product',authenticateProductDetails,addProduct);
router.post('/add-product-images/:pdId',upload.single('file'),addProductImage);
router.post('/add-product-address/:pdId',authenticateAddress,addProductAddress);
router.put('/update-product/:pdId/:pId',authenticateProductDetailsUpdate,updateProduct);
router.delete('/delete-product-address/:pdId/:pId/:paId',removeProductAddress);
router.get('/products',getSellerProducts);

export default router

