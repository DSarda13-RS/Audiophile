"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const authenticate_1 = require("../middleware/authenticate");
const checkRole_1 = require("../middleware/checkRole");
const checkRoleLogin_1 = require("../middleware/checkRoleLogin");
const authBody_1 = require("../middleware/authBody");
const allUser_1 = require("../controllers/allUser");
router.post('/register', upload.single('file'), authBody_1.authenticateUser, allUser_1.registerSeller);
router.post('/login', [authBody_1.authenticateUserLogin, checkRoleLogin_1.checkSellerLogin], allUser_1.login);
router.use(authenticate_1.authenticateToken); // login check
router.use(checkRole_1.checkSeller); // seller check
router.post('/add-product', authBody_1.authenticateProductDetails, allUser_1.addProduct);
router.post('/add-product-images/:pdId', upload.single('file'), allUser_1.addProductImage);
router.post('/add-product-address/:pdId', authBody_1.authenticateAddress, allUser_1.addProductAddress);
router.put('/update-product/:pdId/:pId', authBody_1.authenticateProductDetailsUpdate, allUser_1.updateProduct);
router.delete('/delete-product-address/:pdId/:pId/:paId', allUser_1.removeProductAddress);
router.get('/products', allUser_1.getSellerProducts);
exports.default = router;
