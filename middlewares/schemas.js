import Joi from "joi";

export const registrUserSchema = Joi.object({
    firstName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});