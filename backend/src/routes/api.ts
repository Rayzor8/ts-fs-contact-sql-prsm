import express from "express";
import userController from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import contactController from "../controllers/contact-controller";

const userRouter = express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// Contact API
userRouter.post("/api/contacts", contactController.create);
userRouter.get("/api/contacts/:id", contactController.get);
userRouter.put("/api/contacts/:id", contactController.update);

export { userRouter };
