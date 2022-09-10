"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProductDetailsUpdate = void 0;
const Joi = require('@hapi/joi');
const authProductDetailsUpdate = Joi.object({
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required()
});
exports.authProductDetailsUpdate = authProductDetailsUpdate;
