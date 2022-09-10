import {pool} from "../db";

import {Request,Response,NextFunction} from 'express'

const checkUserLogin = async(req: Request,res: Response,next: NextFunction)=>{
    const {email} = req.body as {email: string};
    try{
        const isUser = await pool.query('SELECT is_user FROM users WHERE email = $1 AND archived_at IS NULL',[email]);
        if(isUser.rows[0].is_user){
            next()
        } else{
            res.status(403).send('You are not a user');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const checkSellerLogin = async(req: Request,res: Response,next: NextFunction)=>{
    const {email} = req.body as {email: string};
    try{
        const isSeller = await pool.query('SELECT is_seller FROM users WHERE email = $1 AND archived_at IS NULL',[email]);
        if(isSeller.rows[0].is_seller){
            next()
        } else{
            res.status(403).send('You are not a seller');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const checkAdminLogin = async(req: Request,res: Response,next: NextFunction)=>{
    const {email} = req.body as {email: string};
    try{
        const isAdmin = await pool.query('SELECT is_admin FROM users WHERE email = $1 AND archived_at IS NULL',[email]);
        if(isAdmin.rows[0].is_admin){
            next()
        } else{
            res.status(403).send('You are not an admin');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

export {
    checkUserLogin,
    checkSellerLogin,
    checkAdminLogin
}

