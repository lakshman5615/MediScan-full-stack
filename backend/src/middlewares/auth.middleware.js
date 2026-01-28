const joi = require('joi');

const signupValidation = (req, resp, next) => {

    const schema = joi.object({
        name: joi.string().min(2).max(100).required(),
        age: joi.number().integer().min(1).max(150).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).required(),
        phone: joi.string().length(10).pattern(/^[0-9]+$/).required()

    });// .unknown(true);
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error);
        return resp.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}

const loginValidation = (req, resp, next) => {

    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return resp.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
module.exports = { signupValidation, loginValidation };


