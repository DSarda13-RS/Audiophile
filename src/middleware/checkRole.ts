import {pool} from "../db";

import {Request,Response,NextFunction} from 'express'

const checkUser = async(req: Request,res: Response,next: NextFunction)=>{
    const userId: number = req.userId;
    const isUser = await pool.query(
        'SELECT is_user FROM users WHERE user_id = $1 AND archived_at IS NULL',[userId]);
    if(isUser.rows[0].is_user){
        next()
    } else{
        res.status(403).send('You are not a user');
    }
}

const checkSeller = async(req: Request,res: Response,next: NextFunction)=>{
    const userId: number = req.userId;
    const isSeller = await pool.query(
        'SELECT is_seller FROM users WHERE user_id = $1 AND archived_at IS NULL',[userId]);
    if(isSeller.rows[0].is_seller){
        next()
    } else{
        res.status(403).send('You are not a seller');
    }
}

const checkAdmin = async(req: Request,res: Response,next: NextFunction)=>{
    const userId: number = req.userId;
    const isAdmin = await pool.query(
        'SELECT is_admin FROM users WHERE user_id = $1 AND archived_at IS NULL',[userId]);
    if(isAdmin.rows[0].is_admin){
        next()
    } else{
        res.status(403).send('You are not an admin');
    }
}

export {
    checkUser,
    checkSeller,
    checkAdmin
}

