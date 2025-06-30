import express from "express";
import userController from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";


const userRouter = express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);

export { userRouter };
