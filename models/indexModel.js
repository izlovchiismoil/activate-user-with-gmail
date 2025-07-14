import sequelize from "../config/db.js";
import {Sequelize} from "sequelize";
import userModel from "./userModel.js";

const models = {
    user: userModel(sequelize, Sequelize)
};

export { sequelize };
export default models;