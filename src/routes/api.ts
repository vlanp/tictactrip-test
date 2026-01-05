import express from "express";
import { getToken } from "../controllers/api.js";

const router = express.Router();

router.post("/token", getToken);

export default router;
