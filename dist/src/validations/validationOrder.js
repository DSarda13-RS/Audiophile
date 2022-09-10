"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOrder = void 0;
const Joi = require('@hapi/joi');
const authOrder = Joi.object({
    paymentMethod: Joi.string().trim().min(1).required()
});
exports.authOrder = authOrder;
