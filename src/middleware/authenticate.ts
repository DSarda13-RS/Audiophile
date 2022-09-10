import jwt from "jsonwebtoken";
import {pool} from "../db";

import {Request,Response,NextFunction} from 'express'

declare global {
    namespace Express {
        // tslint:disable-next-line:interface-name
        interface Request {
            userId: number,
            sessionId: number
        }
    }
}

const authenticateToken = async(req: Request,res: Response,next: NextFunction)=>{
    const authHeader = req.headers['authorization']
    const token: string|undefined = authHeader && authHeader.split(' ')[1]
    if(token === null){
        return res.sendStatus(401);
    }
    jwt.verify(token as string, (process.env.SIGN_IN_KEY) as string, async (err, user:any) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.userId = user.userId;
        req.sessionId = user.sessionId;
        const isEnded = await pool.query('SELECT is_ended FROM sessions WHERE session_id = $1', [req.sessionId]);
        if(isEnded.rows[0].is_ended === true){
            res.status(440).send('Session Expired!!!');
        } else{
            next()
        }
    })
}

export {
    authenticateToken
}

