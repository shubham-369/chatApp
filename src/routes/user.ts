import { Router } from "express";
const router = Router();
import * as userControllers from "../controllers/user";

router.post('/signup', userControllers.signup);

router.post('/login', userControllers.login);

export default router;