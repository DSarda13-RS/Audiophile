"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateOrder = exports.authenticateCart = exports.authenticateProductDetailsUpdate = exports.authenticateProductDetails = exports.authenticateDetailsUpdate = exports.authenticateAddress = exports.authenticateUserLogin = exports.authenticateUser = void 0;
const validationUser_1 = require("../validations/validationUser");
const validationUserLogin_1 = require("../validations/validationUserLogin");
const validationAddress_1 = require("../validations/validationAddress");
const validationDetailsUpdate_1 = require("../validations/validationDetailsUpdate");
const validationProductDetails_1 = require("../validations/validationProductDetails");
const validationProductDetailsUpdate_1 = require("../validations/validationProductDetailsUpdate");
const validationCart_1 = require("../validations/validationCart");
const validationOrder_1 = require("../validations/validationOrder");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, address } = req.body;
    if (validationUser_1.authUser.validate({ name, email, password, address }).error == null) {
        next();
    }
    else {
        res.status(400).json(validationUser_1.authUser.validate({ name, email, password, address }).error.message);
    }
});
exports.authenticateUser = authenticateUser;
const authenticateUserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (validationUserLogin_1.authUserLogin.validate({ email, password }).error == null) {
        next();
    }
    else {
        res.status(403).json(validationUserLogin_1.authUserLogin.validate({ email, password }).error.message);
    }
});
exports.authenticateUserLogin = authenticateUserLogin;
const authenticateAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.body;
    if (validationAddress_1.authAddress.validate({ address }).error == null) {
        next();
    }
    else {
        res.status(400).json(validationAddress_1.authAddress.validate({ address }).error.message);
    }
});
exports.authenticateAddress = authenticateAddress;
const authenticateDetailsUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, newPassword, password } = req.body;
    if (validationDetailsUpdate_1.authDetailsUpdate.validate({ name, email, newPassword, password }).error == null) {
        next();
    }
    else {
        res.status(403).json(validationDetailsUpdate_1.authDetailsUpdate.validate({ name, email, newPassword, password }).error.message);
    }
});
exports.authenticateDetailsUpdate = authenticateDetailsUpdate;
const authenticateProductDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, colour, quantity, price, address } = req.body;
    if (validationProductDetails_1.authProductDetails.validate({ name, category, colour, quantity, price, address }).error == null) {
        next();
    }
    else {
        res.status(403).json(validationProductDetails_1.authProductDetails.validate({ name, category, colour, quantity, price, address }).error.message);
    }
});
exports.authenticateProductDetails = authenticateProductDetails;
const authenticateProductDetailsUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity, price } = req.body;
    if (validationProductDetailsUpdate_1.authProductDetailsUpdate.validate({ quantity, price }).error == null) {
        next();
    }
    else {
        res.status(403).json(validationProductDetailsUpdate_1.authProductDetailsUpdate.validate({ quantity, price }).error.message);
    }
});
exports.authenticateProductDetailsUpdate = authenticateProductDetailsUpdate;
const authenticateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity } = req.body;
    if (validationCart_1.authCart.validate({ quantity }).error == null) {
        next();
    }
    else {
        res.status(403).json(validationCart_1.authCart.validate({ quantity }).error.message);
    }
});
exports.authenticateCart = authenticateCart;
const authenticateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethod } = req.body;
    if (validationOrder_1.authOrder.validate({ paymentMethod }).error == null) {
        next();
    }
    else {
        res.status(403).json(validationOrder_1.authOrder.validate({ paymentMethod }).error.message);
    }
});
exports.authenticateOrder = authenticateOrder;
