import {authUser} from "../validations/validationUser";
import {authUserLogin} from "../validations/validationUserLogin";
import {authAddress} from "../validations/validationAddress";
import {authDetailsUpdate} from "../validations/validationDetailsUpdate";
import {authProductDetails} from "../validations/validationProductDetails";
import {authProductDetailsUpdate} from "../validations/validationProductDetailsUpdate";
import {authCart} from "../validations/validationCart";
import {authOrder} from "../validations/validationOrder";

import {Request,Response,NextFunction} from 'express'

const authenticateUser = async(req: Request,res: Response,next: NextFunction)=>{
    const {name,email,password,address} = req.body as {name: string,email: string,password: string,address: string};
    if(authUser.validate({name,email,password,address}).error == null){
        next()
    } else{
        res.status(400).json(authUser.validate({name,email,password,address}).error.message);
    }
}

const authenticateUserLogin = async(req: Request,res: Response,next: NextFunction)=>{
    const {email,password} = req.body as {email: string,password: string};
    if(authUserLogin.validate({email,password}).error == null){
        next()
    } else{
        res.status(403).json(authUserLogin.validate({email,password}).error.message);
    }
}

const authenticateAddress = async(req: Request,res: Response,next: NextFunction)=>{
    const {address} = req.body as {address: string};
    if(authAddress.validate({address}).error == null){
        next()
    } else{
        res.status(400).json(authAddress.validate({address}).error.message);
    }
}

const authenticateDetailsUpdate = async(req: Request,res: Response,next: NextFunction)=>{
    const {name,email,newPassword,password} = req.body as {name: string,email: string,newPassword: string,password: string};
    if(authDetailsUpdate.validate({name,email,newPassword,password}).error == null){
        next()
    } else{
        res.status(403).json(authDetailsUpdate.validate({name,email,newPassword,password}).error.message);
    }
}

const authenticateProductDetails = async(req: Request,res: Response,next: NextFunction)=>{
    const {name,category,colour,quantity,price,address} = req.body as {name: string,category: string,colour: string,quantity: number,price: number,address: string};
    if(authProductDetails.validate({name,category,colour,quantity,price,address}).error == null){
        next()
    } else{
        res.status(403).json(authProductDetails.validate({name,category,colour,quantity,price,address}).error.message);
    }
}

const authenticateProductDetailsUpdate = async(req: Request,res: Response,next: NextFunction)=>{
    const {quantity,price} = req.body as {quantity: number,price: number};
    if(authProductDetailsUpdate.validate({quantity,price}).error == null){
        next()
    } else{
        res.status(403).json(authProductDetailsUpdate.validate({quantity,price}).error.message);
    }
}

const authenticateCart = async(req: Request,res: Response,next: NextFunction)=>{
    const {quantity} = req.body as {quantity: number};
    if(authCart.validate({quantity}).error == null){
        next()
    } else{
        res.status(403).json(authCart.validate({quantity}).error.message);
    }
}

const authenticateOrder = async(req: Request,res: Response,next: NextFunction)=>{
    const {paymentMethod} = req.body as {paymentMethod: string};
    if(authOrder.validate({paymentMethod}).error == null){
        next()
    } else{
        res.status(403).json(authOrder.validate({paymentMethod}).error.message);
    }
}

export {
    authenticateUser,
    authenticateUserLogin,
    authenticateAddress,
    authenticateDetailsUpdate,
    authenticateProductDetails,
    authenticateProductDetailsUpdate,
    authenticateCart,
    authenticateOrder
}

