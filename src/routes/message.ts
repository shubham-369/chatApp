import { Router } from "express";
const router = Router();
import { Server as ServerSocket } from "socket.io";
import * as messageController from "../controllers/message";
import authenticate from "../middleware/authenticate";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({storage: storage});


export default function MessageRoutes(io: ServerSocket) {
        
    router.post('/message', authenticate, upload.single('file'), messageController.addMessage(io));

    router.get('/getMessages', authenticate, messageController.getMessages);

    router.get('/searchUser', authenticate, messageController.getByEmail);

    router.get('/showGroupUsers', authenticate, messageController.showGroupUsers);

    return router;
}
