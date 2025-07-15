import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize =  new Sequelize(process.env.DB_NAME, process.env.DB_USER,process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT)
});

async function connectWithRetry() {
    let retries = 5;
    while (retries) {
        try {
            await sequelize.authenticate();
            console.log("DB connected successfully!");
            break;
        } catch (err) {
            console.log("DB Connection Error:", err.message);
            retries--;
            console.log(`Retrying... (${5 - retries}/5)`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

connectWithRetry();

export default sequelize;