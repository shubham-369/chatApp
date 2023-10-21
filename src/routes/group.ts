import { Router } from "express";
const router = Router();
import * as groupController from "../controllers/group";
import authenticate from "../middleware/authenticate";

router.post('/addGroup', authenticate, groupController.createGroup);

router.get('/getGroup', authenticate, groupController.getGroups);

router.post('/addGroupUser', authenticate, groupController.addGroupUser);

router.delete('/removeUser', authenticate, groupController.removeUser);

router.delete('/removeAdmin', authenticate, groupController.removeAdmin);

router.get('/makeAdmin', authenticate, groupController.makeAdmin);

export default router;