const Joi = require('@hapi/joi')

const authUser = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z]+$/).min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().alphanum().min(8).required(),
    address: Joi.string().required()
})

export {authUser};

