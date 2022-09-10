"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProductDetails = void 0;
const Joi = require('@hapi/joi');
const authProductDetails = Joi.object({
    name: Joi.string().trim().min(1).required(),
    category: Joi.string().trim().lowercase().min(7).required(),
    colour: Joi.string().trim().min(1).required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
    address: Joi.string().min(1).required()
});
exports.authProductDetails = authProductDetails;
