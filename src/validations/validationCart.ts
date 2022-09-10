const Joi = require('@hapi/joi')

const authCart = Joi.object({
    quantity: Joi.number().min(1).required()
})

export {authCart};

