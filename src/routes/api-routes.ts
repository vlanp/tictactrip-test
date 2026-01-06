import express from "express";
import { getJustifiedText, getToken } from "../controllers/api-controllers.js";
import { isAuthenticated } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/token", getToken);

router.post("/justify", isAuthenticated, getJustifiedText);

export default router;
