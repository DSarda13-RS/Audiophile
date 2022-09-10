"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAddress = void 0;
const Joi = require('@hapi/joi');
const authAddress = Joi.object({
    address: Joi.string().min(1).required()
});
exports.authAddress = authAddress;
