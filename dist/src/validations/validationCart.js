"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCart = void 0;
const Joi = require('@hapi/joi');
const authCart = Joi.object({
    quantity: Joi.number().min(1).required()
});
exports.authCart = authCart;
