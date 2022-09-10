"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const Joi = require('@hapi/joi');
const authUser = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().alphanum().min(8).required(),
    address: Joi.string().required()
});
exports.authUser = authUser;
