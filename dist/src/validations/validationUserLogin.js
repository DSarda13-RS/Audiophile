"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserLogin = void 0;
const Joi = require('@hapi/joi');
const authUserLogin = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().alphanum().min(8).required()
});
exports.authUserLogin = authUserLogin;
