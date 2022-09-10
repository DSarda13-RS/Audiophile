const Joi = require('@hapi/joi')

const authAddress = Joi.object({
    address: Joi.string().min(1).required()
})

export {authAddress};

