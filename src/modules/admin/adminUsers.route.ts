import { Router } from "express";
import { adminUsersController } from "./adminUsers.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { adminUpdateUserSchema } from "../../validation/requestSchemas";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), adminUsersController.getUsers);
router.get("/:id", checkAuth(Role.ADMIN), adminUsersController.getUserById);
router.patch("/:id", checkAuth(Role.ADMIN), validateRequest(adminUpdateUserSchema), adminUsersController.updateUser);
router.delete("/:id", checkAuth(Role.ADMIN), adminUsersController.deactivateUser);
router.post("/:id/reset-password", checkAuth(Role.ADMIN), adminUsersController.resetPassword);
router.post("/:id/impersonate", checkAuth(Role.ADMIN), adminUsersController.impersonateUser);

export const adminUsersRouter = router;
