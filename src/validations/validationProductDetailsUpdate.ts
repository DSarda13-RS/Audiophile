const Joi = require('@hapi/joi')

const authProductDetailsUpdate = Joi.object({
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required()
})

export {authProductDetailsUpdate};

