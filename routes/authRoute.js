import { Router } from "express";
import {
    activateUser,
    loginUser,
    registerUser,
    resendActivation
} from "../controllers/authController.js";
import {checkRegistrUser} from "../middlewares/authMiddleware.js";
import {registrUserSchema} from "../middlewares/schemas.js";
const authRouter = Router();


authRouter.post("/login", loginUser);
authRouter.post("/register", checkRegistrUser(registrUserSchema), registerUser);
authRouter.get("/activate/:token", activateUser);
authRouter.post("/resend-activation", resendActivation);

export default authRouter;