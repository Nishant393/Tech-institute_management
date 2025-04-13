import express from "express";
import {  getMyProfile, getUserById, login, logout, newUser } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router()

app.post("/login", login);

app.use(isAuthenticated)

app.post("/logout", logout);
app.get("/me",getMyProfile);
app.get("/byid",getUserById)

export default app;