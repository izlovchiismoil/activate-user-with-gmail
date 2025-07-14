import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import models from "../models/indexModel.js";
import {sendEmail} from "../utils/sendEmail.js";

export async function loginUser (req, res) {
    try {
        const requestData = req.body.user;
        if (!requestData.email || !requestData.password) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials"
            });
        }
        const user = await models.user.findOne({
            where: {
                email: requestData.email
            },
            raw: true
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Invalid credentials"
            });
        }
        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                error: "Account not activated. Please check your email."
            });
        }
        const isMatch = await bcrypt.compare(requestData.password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials"
            });
        }
        const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
        });
        return res.status(200).json({
            success: true,
            accessToken
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

export async function registerUser (req, res) {
    try {
        const requestData = req.body.user;
        if (!requestData) {
            return res.status(400).json({
                success: false,
                error: "User params invalid"
            });
        }
        const user = await models.user.findOne({
            where: {
                email: requestData.email
            },
            raw: true
        });
        if (user) {
            return res.status(409).json({
                success: false,
                error: "User already exist"
            });
        }
        requestData.password = await bcrypt.hash(requestData.password, 10);
        const createdUser = await models.user.create(requestData);
        const activationToken = jwt.sign({userId: createdUser.id}, process.env.JWT_ACTIVATION_SECRET, {
            expiresIn: process.env.JWT_ACTIVATION_EXPIRE
        });
        const activationLink = `${process.env.CLIENT_URL}/auth/activate/${activationToken}`;
        await sendEmail(requestData.email, "Activate your account", `
          <p>Click to activate: <a href="${activationLink}">Activate</a></p>
        `);
        return res.status(201).json({
            success: true,
            message: "Registered! Please check your email to activate your account.",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: `Server Error: ${err.message}`
        });
    }
}

export async function activateUser (req, res) {
    try {
        const requestData = req.params.token;
        if (!requestData) {
            return res.status(400).json({
                success: false,
                error: "This link not valid"
            });
        }
        let decoded;
        try {
            decoded = jwt.verify(requestData, process.env.JWT_ACTIVATION_SECRET);
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(410).json({
                    success: false,
                    error: "Activation link has expired",
                });
            }
            return res.status(400).json({
                success: false,
                error: "Invalid token",
            });
        }

        const user = await models.user.findByPk(decoded.userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found"
            });
        }
        if (user.isActive) {
            return res.status(409).json({
                success: false,
                error: "This user already activated"
            });
        }
        await models.user.update({ isActive: true },{
            where: {
                id: user.id
            }
        });
        return res.status(200).json({
            success: true,
            message: "User has been activated successfully"
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: `Internal server Error: ${err.message}`
        });
    }
}

export async function resendActivation(req, res) {
    const { email } = req.body;

    const user = await models.user.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.isActive) {
        return res.status(400).json({ success: false, error: "User already activated" });
    }

    const activationToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_ACTIVATION_SECRET,
        { expiresIn: process.env.JWT_ACTIVATION_EXPIRE }
    );

    const activationLink = `${process.env.CLIENT_URL}/auth/activate/${activationToken}`;

    await sendEmail(user.email, "New Activation Link", `
    <p>Your old link expired. Click the new link below to activate your account:</p>
    <a href="${activationLink}">Activate</a>
  `);

    return res.status(200).json({
        success: true,
        message: "New activation link sent to your email.",
    });
}
