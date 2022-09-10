const Joi = require('@hapi/joi')

const authUserLogin = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().alphanum().min(8).required()
})

export {authUserLogin};

