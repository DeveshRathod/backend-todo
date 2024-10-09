import { Router } from "express";
import {
  checkMe,
  location,
  signin,
  signup,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/checkMe", checkMe);
router.get("/location", location);

export default router;
