import express from "express";
import cors from "cors";
import helmet from "helmet";
import {sequelize} from "./models/indexModel.js";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = YAML.load("./swagger.yaml");

import authRouter from "./routes/authRoute.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}));

sequelize.sync({alter: true}).then(() => {
    console.log("Connected to database successfully!");
}).catch(err => {
    console.log("Connection error: ", err);
});


// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(parseInt(process.env.PORT), () => {
    console.log("Listening on port: " + parseInt(process.env.PORT));
});