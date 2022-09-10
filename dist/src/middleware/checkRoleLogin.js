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
exports.checkAdminLogin = exports.checkSellerLogin = exports.checkUserLogin = void 0;
const db_1 = require("../db");
const checkUserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const isUser = yield db_1.pool.query('SELECT is_user FROM users WHERE email = $1 AND archived_at IS NULL', [email]);
        if (isUser.rows[0].is_user) {
            next();
        }
        else {
            res.status(403).send('You are not a user');
        }
    }
    catch (err) {
        res.sendStatus(500);
        console.error(err);
    }
});
exports.checkUserLogin = checkUserLogin;
const checkSellerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const isSeller = yield db_1.pool.query('SELECT is_seller FROM users WHERE email = $1 AND archived_at IS NULL', [email]);
        if (isSeller.rows[0].is_seller) {
            next();
        }
        else {
            res.status(403).send('You are not a seller');
        }
    }
    catch (err) {
        res.sendStatus(500);
        console.error(err);
    }
});
exports.checkSellerLogin = checkSellerLogin;
const checkAdminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const isAdmin = yield db_1.pool.query('SELECT is_admin FROM users WHERE email = $1 AND archived_at IS NULL', [email]);
        if (isAdmin.rows[0].is_admin) {
            next();
        }
        else {
            res.status(403).send('You are not an admin');
        }
    }
    catch (err) {
        res.sendStatus(500);
        console.error(err);
    }
});
exports.checkAdminLogin = checkAdminLogin;
