import { Router } from "express";
import { checkMe, signin, signup } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/checkMe", checkMe);

export default router;
