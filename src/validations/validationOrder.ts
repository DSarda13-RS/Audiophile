const Joi = require('@hapi/joi')

const authOrder = Joi.object({
    paymentMethod: Joi.string().trim().min(1).required()
})

export {authOrder};

