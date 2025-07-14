import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./routes/authRoute.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        `default-src "self"; img-src "self" ${process.env.CLIENT_URL}; script-src "self"; style-src "self";`
    );
    next();
});
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}));


import {sequelize} from "./models/indexModel.js";

sequelize.sync({alter: true}).then(() => {
    console.log("Connected to database successfully!");
}).catch(err => {
    console.log("Connection error: ", err);
});



// Routes
app.use("/api/v1/auth", authRouter);


app.listen(parseInt(process.env.PORT), () => {
    console.log("Listening on port: " + parseInt(process.env.PORT));
});