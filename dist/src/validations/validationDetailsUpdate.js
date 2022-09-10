"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authDetailsUpdate = void 0;
const Joi = require('@hapi/joi');
const authDetailsUpdate = Joi.object({
    name: Joi.string().trim().min(1),
    email: Joi.string().email().lowercase(),
    newPassword: Joi.string().min(8),
    password: Joi.string().min(8).required()
});
exports.authDetailsUpdate = authDetailsUpdate;
