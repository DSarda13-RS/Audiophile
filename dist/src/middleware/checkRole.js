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
exports.checkAdmin = exports.checkSeller = exports.checkUser = void 0;
const db_1 = require("../db");
const checkUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const isUser = yield db_1.pool.query('SELECT is_user FROM users WHERE user_id = $1 AND archived_at IS NULL', [userId]);
    if (isUser.rows[0].is_user) {
        next();
    }
    else {
        res.status(403).send('You are not a user');
    }
});
exports.checkUser = checkUser;
const checkSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const isSeller = yield db_1.pool.query('SELECT is_seller FROM users WHERE user_id = $1 AND archived_at IS NULL', [userId]);
    if (isSeller.rows[0].is_seller) {
        next();
    }
    else {
        res.status(403).send('You are not a seller');
    }
});
exports.checkSeller = checkSeller;
const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const isAdmin = yield db_1.pool.query('SELECT is_admin FROM users WHERE user_id = $1 AND archived_at IS NULL', [userId]);
    if (isAdmin.rows[0].is_admin) {
        next();
    }
    else {
        res.status(403).send('You are not an admin');
    }
});
exports.checkAdmin = checkAdmin;
