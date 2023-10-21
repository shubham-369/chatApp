import { UserAttributes } from "../models/user";
import { Request } from "express";

declare global {
    namespace Express {
        interface RequestWithUser extends Request {
            user?: UserAttributes;
            file?: any;
        }
    }
}

export default RequestWithUser;
