import express from "express";
import userController from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";


const userRouter = express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

export { userRouter };
