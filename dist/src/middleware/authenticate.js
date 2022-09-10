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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, (process.env.SIGN_IN_KEY), (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.sendStatus(403);
        }
        req.userId = user.userId;
        req.sessionId = user.sessionId;
        const isEnded = yield db_1.pool.query('SELECT is_ended FROM sessions WHERE session_id = $1', [req.sessionId]);
        if (isEnded.rows[0].is_ended === true) {
            res.status(440).send('Session Expired!!!');
        }
        else {
            next();
        }
    }));
});
exports.authenticateToken = authenticateToken;
