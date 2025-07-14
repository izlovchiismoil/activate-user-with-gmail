import jwt from "jsonwebtoken";
import models from "../models/indexModel.js";

export const checkRegistrUser = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body.user, { abortEarly: true });
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map((err) => err.message)
            });
        }
        next();
    }
}

export const authenticate = async (req, res, next) => {
    const requestData = req.headers.authorization;
    if (!requestData) {
        return res.status(401).json({
            success: false,
            error: "Not authorized"
        });
    }
    const isValidAccessToken = jwt.verify(requestData.accessToken, process.env.JWT_SECRET);
    if(!isValidAccessToken) {
        return res.status(401).json({
            success: false,
            error: "Not authorized"
        });
    }
    const decodedAccessToken = jwt.decode(requestData.accessToken, process.env.JWT_SECRET);
    if (!decodedAccessToken.userId) {
        return res.status(401).json({
            success: false,
            error: "Not authorized"
        });
    }
    const user = await models.user.findByPk(decodedAccessToken.userId, {
        raw: true
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            error: "No user found"
        });
    }
    req.user = user;
    next();
};