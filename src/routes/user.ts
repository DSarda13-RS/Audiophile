import express from "express";
const router = express.Router();

import multer from "multer"
const upload = multer({storage: multer.memoryStorage()});
// const upload = multer({dest:'uploads/'});

const {authenticateToken} = require('../middleware/authenticate')

import {
    authenticateUser,
    authenticateUserLogin,
    authenticateAddress,
    authenticateDetailsUpdate,
    authenticateCart,
    authenticateOrder
} from '../middleware/authBody'

import {checkUserLogin} from '../middleware/checkRoleLogin'

import {checkUser} from '../middleware/checkRole'

import {
    registerUser,
    login,
    addUserAddress,
    getDetails,
    updateDetails,
    deleteAddress,
    updateAddress,
    getProducts,
    addToCart,
    viewCart,
    removeFromCart,
    updateCart,
    order,
    viewOrder
} from '../controllers/allUser';

router.post('/register',upload.single('file'),authenticateUser,registerUser)
router.post('/login',[authenticateUserLogin,checkUserLogin],login)
router.use(authenticateToken)
router.use(checkUser)
router.post('/add-address',authenticateAddress,addUserAddress)
router.get('/details',getDetails)
router.put('/update',authenticateDetailsUpdate,updateDetails)
router.put('/update-address/:uaId',authenticateAddress,updateAddress);
router.delete('/delete-address/:uaId',deleteAddress);
router.get('/products',getProducts);
router.post('/product/add-to-cart/:pdId',authenticateCart,addToCart);
router.get('/view-cart',viewCart);
router.put('/product/remove-from-cart/:pdId',removeFromCart);
router.put('/update-cart/:pdId',authenticateCart,updateCart);
router.post('/order',authenticateOrder,order);
router.get('/view-order',viewOrder);

export default router

