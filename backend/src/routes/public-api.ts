import express from "express";
import userController from "../controllers/user-controller";

const publicRouter = express.Router();

publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);

export { publicRouter };
