import {pool} from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {Request,Response} from 'express';
import storage from "../../firebase/storage";

const registerUser = async(req: Request,res: Response)=>{
    const {name,email,password,address} = req.body as {name: string,email: string,password: string,address: string};
    const file = req.file;
    console.log(file);
    const emails = await pool.query(
        'SELECT email FROM users WHERE email = $1 AND archived_at is null',[email]);
    if(emails.rowCount === 0){
        const fileType = file?.originalname.split('.')[1];
        if(fileType!=='jpeg' && fileType!== 'jpg' && fileType!=='png'){
            res.status(400).send(`uploaded file is of type ${fileType}. File should be .jpg .jpeg .png`);
            return;
        }
        const salt: string = await bcrypt.genSalt()
        const hashedPassword: string = await bcrypt.hash(password,salt)
        const client = await pool.connect()
        try{
            await client.query('BEGIN');
            const insertUser = 'INSERT INTO users (name,email,password,is_user) VALUES ($1,$2,$3,$4) RETURNING user_id';
            const insertUserValues = [name,email,hashedPassword,true];
            const userId = await client.query(insertUser,insertUserValues);
            const path = 'users/' + userId.rows[0].user_id + '/profile/';
            const fileName = file?.originalname.split('.')[0] + '-' + Date.now() + `.${fileType}`;
            const firebaseFileName = path + fileName;
            storage.file(firebaseFileName).createWriteStream().end(file?.buffer);
            const addImage = 'INSERT INTO images (name,path,category) VALUES ($1,$2,$3) RETURNING image_id';
            const addImageValues = [fileName,path,'user'];
            const imageId = await client.query(addImage,addImageValues);
            const insertUserImage = 'INSERT INTO user_images (user_id,image_id) VALUES ($1,$2)';
            const insertUserImageValues = [userId.rows[0].user_id,imageId.rows[0].image_id];
            await client.query(insertUserImage,insertUserImageValues);
            const insertAddress = 'INSERT INTO user_address (user_id,address) VALUES ($1,$2)';
            const insertAddressValues = [userId.rows[0].user_id,address];
            await client.query(insertAddress,insertAddressValues);
            await client.query('COMMIT');
            res.status(200).json('User registered');
            return;
        } catch(err){
            await client.query('ROLLBACK');
            res.sendStatus(500);
            console.error(err);
        } finally{
            client.release();
        }
    } else{
        res.status(409).send('email already used');
        return;
    }
}

const registerSeller = async(req: Request,res: Response)=>{
    const {name,email,password,address} = req.body as {name: string,email: string,password: string,address: string};
    const file = req.file;
    const emails = await pool.query(
        'SELECT email FROM users WHERE email = $1 AND archived_at is null',[email]);
    if(emails.rowCount === 0){
        const fileType = file?.originalname.split('.')[1];
        if(fileType!=='jpeg' && fileType!== 'jpg' && fileType!=='png'){
            res.status(400).send(`uploaded file is of type ${fileType}. File should be .jpg .jpeg .png`);
        }
        const salt: string = await bcrypt.genSalt()
        const hashedPassword: string = await bcrypt.hash(password,salt)
        const client = await pool.connect()
        try{
            await client.query('BEGIN');
            const insertSeller = 'INSERT INTO users (name,email,password,is_seller) VALUES ($1,$2,$3,$4) RETURNING user_id';
            const insertSellerValues = [name,email,hashedPassword,true];
            const userId = await client.query(insertSeller,insertSellerValues);
            const path = 'sellers/' + userId.rows[0].user_id + '/profile/';
            const fileName = file?.originalname.split('.')[0] + '-' + Date.now() + `.${fileType}`;
            const firebaseFileName = path + fileName;
            storage.file(firebaseFileName).createWriteStream().end(file?.buffer);
            const addImage = 'INSERT INTO images (name,path,category) VALUES ($1,$2,$3) RETURNING image_id';
            const addImageValues = [fileName,path,'user'];
            const imageId = await client.query(addImage,addImageValues);
            const insertSellerImage = 'INSERT INTO user_images (user_id,image_id) VALUES ($1,$2)';
            const insertSellerImageValues = [userId.rows[0].user_id,imageId.rows[0].image_id];
            await client.query(insertSellerImage,insertSellerImageValues);
            const insertAddress = 'INSERT INTO user_address (user_id,address) VALUES ($1,$2)';
            const insertAddressValues = [userId.rows[0].user_id,address];
            await client.query(insertAddress,insertAddressValues);
            await client.query('COMMIT');
            res.status(200).json('Seller registered');
        } catch(err){
            await client.query('ROLLBACK');
            res.sendStatus(500);
            console.error(err);
        } finally{
            client.release();
        }
    } else{
        res.status(409).send('email already used');
    }
}

const login = async(req: Request,res: Response)=>{
    const {email,password} = req.body as {email: string,password: string};
    try{
        const details = await pool.query('SELECT user_id,password FROM users WHERE email = $1 AND archived_at is null',[email]);
        if(details.rowCount === 0){
            res.status(400).send('User not found');
        } else{
            if(await bcrypt.compare(password, details.rows[0].password)){
                const sessionId = await pool.query('INSERT INTO sessions (user_id) VALUES ($1) RETURNING session_id',[details.rows[0].user_id]);
                const user = { userId: details.rows[0].user_id, sessionId: sessionId.rows[0].session_id } as { userId: number, sessionId: number };
                const accessToken = jwt.sign(user, (process.env.SIGN_IN_KEY) as string,{ expiresIn: '30m'});
                res.status(200).json({accessToken: accessToken})
            } else{
                res.status(401).send('Incorrect Password');
            }
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const addUserAddress = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    const {address} = req.body as {address: string};
    try{
        await pool.query('INSERT INTO user_address (user_id,address) VALUES ($1,$2)',[userId,address]);
        res.status(200).send('Address added');
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const getDetails = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    try{
        const details = await pool.query('SELECT name,email FROM users WHERE user_id = $1 AND is_user = $2 AND archived_at is null',
        [userId,true]);
        const addresses = await pool.query('SELECT address FROM user_address WHERE user_id = $1 AND archived_at is null',[userId]);
        details.rows[0].addresses = [];
        for(let i = 0; i < addresses.rows.length; i++){
            details.rows[0].addresses[i] = addresses.rows[i].address;
        }
        const image = await pool.query('SELECT u.image_id,name,path FROM images i JOIN user_images u ON i.image_id = u.image_id WHERE user_id = $1 AND category = $2 AND i.archived_at is null',[userId,'user']);
        const expTime = new Date(new Date().getTime() + 10 * 60000)
        const result = await storage.file(image.rows[0].path + image.rows[0].name).getSignedUrl({
            action: "read",
            expires: expTime
        })
        details.rows[0].image = result[0];
        res.status(200).json(details.rows);
    }catch (err){
        res.sendStatus(500);
        console.error(err);
    }
}

const updateDetails = async(req: Request,res: Response)=>{
    try{
        const userId: number = req.userId;
        let {name,email,newPassword,password} = req.body as {name: string,email: string,newPassword: string,password: string};
        const details = await pool.query(
            'SELECT name,email,password FROM users WHERE user_id = $1 AND archived_at is null',[userId]);
        const registeredPassword: string = details.rows[0].password;
        const registeredName: string = details.rows[0].name;
        const registeredEmail: string = details.rows[0].email;
        if(await bcrypt.compare(password, registeredPassword)){
            if(name === undefined){
                name = registeredName;
            }
            if(email === undefined){
                email = registeredEmail;
            }
            if(newPassword === undefined){
                newPassword = registeredPassword;
            } else{
                const salt: string = await bcrypt.genSalt()
                const hashedPassword: string = await bcrypt.hash(newPassword,salt)
                newPassword = hashedPassword;
            }
            await pool.query(
                'UPDATE users SET name = $1 , email = $2 , password = $3 , updated_at = NOW() WHERE user_id = $4 AND archived_at is null', [name,email,newPassword,userId]);
            res.status(200).json('Updated');
        } else{
            res.status(401).send('Incorrect Password');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const updateAddress = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    const {address} = req.body as {address: string};
    const {uaId} = req.params as unknown as {uaId: number};
    try{
        await pool.query(
            'UPDATE user_address SET address = $1, updated_at = NOW() WHERE user_id = $2 AND address_id = $3 AND archived_at is null', [address,userId,uaId]);
        res.status(200).json('Updated address');
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const deleteAddress = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    const {uaId} = req.params as unknown as {uaId: number};
    try{
        await pool.query(
            'UPDATE user_address SET archived_at = NOW() WHERE user_id = $1 AND address_id = $2 AND archived_at is null', [userId,uaId]);
        res.status(200).json('Deleted address');
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const addProduct = async(req: Request,res: Response)=>{
    const sellerId: number = req.userId;
    const {name,category,colour,quantity,price,address} = req.body as {name: string,category: string,colour: string,quantity: number,price: number,address: string};
    const productName = await pool.query('SELECT name FROM products p JOIN product_details pd ON p.product_id = pd.product_id WHERE name = $1 AND seller_id = $2 AND colour = $3 AND category = $4 AND p.archived_at is null AND pd.archived_at is null',[name,sellerId,colour,category])
    if(productName.rowCount === 0){
        const productId = await pool.query('SELECT product_id FROM products WHERE name = $1 AND seller_id = $2 AND category = $3 AND archived_at is null',[name,sellerId,category]);
        if(productId.rowCount === 0){
            const client = await pool.connect()
            try{
                await client.query('BEGIN');
                const insertProduct = 'INSERT INTO products (name,seller_id,category) VALUES ($1,$2,$3) RETURNING product_id';
                const insertProductValues = [name,sellerId,category];
                const productId = await client.query(insertProduct,insertProductValues);
                const insertProductDetails = 'INSERT INTO product_details (product_id,colour,stock_quantity,price) VALUES ($1,$2,$3,$4) RETURNING product_detail_id';
                const insertProductDetailsValues = [productId.rows[0].product_id,colour,quantity,price];
                const productDetailId = await client.query(insertProductDetails,insertProductDetailsValues);
                const insertProductAddress = 'INSERT INTO product_address (product_detail_id,address) VALUES ($1,$2)';
                const insertProductAddressValues = [productDetailId.rows[0].product_detail_id,address];
                await client.query(insertProductAddress,insertProductAddressValues);
                await client.query('COMMIT');
                res.status(200).json('Product Added');
            } catch(err){
                await client.query('ROLLBACK');
                res.sendStatus(500);
                console.error(err);
            } finally{
                client.release();
            }
        } else{
            const client = await pool.connect()
            try{
                await client.query('BEGIN');
                const insertProductDetails = 'INSERT INTO product_details (product_id,colour,stock_quantity,price) VALUES ($1,$2,$3,$4) RETURNING product_detail_id';
                const insertProductDetailsValues = [productId.rows[0].product_id,colour,quantity,price];
                const productDetailId = await client.query(insertProductDetails,insertProductDetailsValues);
                const insertProductAddress = 'INSERT INTO product_address (product_detail_id,address) VALUES ($1,$2)';
                const insertProductAddressValues = [productDetailId.rows[0].product_detail_id,address];
                await client.query(insertProductAddress,insertProductAddressValues);
                await client.query('COMMIT');
                res.status(200).json('Product Added');
            } catch(err){
                await client.query('ROLLBACK');
                res.sendStatus(500);
                console.error(err);
            } finally{
                client.release();
            }
        }
    } else{
        res.status(409).send('product already exists');
    }
}

const addProductImage = async(req: Request,res: Response)=>{
    const {pdId} = req.params as unknown as {pdId: number};
    const sellerId: number = req.userId;
    const sellersId = await pool.query('SELECT seller_id FROM products p JOIN product_details pd ON p.product_id = pd.product_id WHERE product_detail_id = $1 AND p.archived_at is null AND pd.archived_at is null',[pdId]);
    if(sellersId.rows[0].seller_id === sellerId){
        const file = req.file;
        const fileType = file?.originalname.split('.')[1];
        if(fileType!=='jpeg' && fileType!== 'jpg' && fileType!=='png'){
            res.status(400).send(`uploaded file is of type ${fileType}. File should be .jpg .jpeg .png`);
        }
        const client = await pool.connect()
        try{
            await client.query('BEGIN');
            const path = 'products/' + pdId + '/images/';
            const fileName = file?.originalname.split('.')[0] + '-' + Date.now() + `.${fileType}`;
            const firebaseFileName = path + fileName;
            storage.file(firebaseFileName).createWriteStream().end(file?.buffer);
            const addImage = 'INSERT INTO images (name,path,category) VALUES ($1,$2,$3) RETURNING image_id';
            const addImageValues = [fileName,path,'product'];
            const imageId = await client.query(addImage,addImageValues);
            const insertProductImage = 'INSERT INTO product_images (product_detail_id,image_id) VALUES ($1,$2)';
            const insertProductImageValues = [pdId,imageId.rows[0].image_id];
            await client.query(insertProductImage,insertProductImageValues);
            await client.query('COMMIT');
            res.status(200).json('Image Added');
        } catch(err){
            await client.query('ROLLBACK');
            res.sendStatus(500);
            console.error(err);
        } finally{
            client.release();
        }
    } else{
        res.status(400).json('You are not seller for this product');
    }
}

const addProductAddress = async(req: Request,res: Response)=>{
    const {pdId} = req.params as unknown as {pdId: number};
    const {address} = req.body as {address: string};
    const sellerId: number = req.userId;
    const sellersId = await pool.query('SELECT seller_id FROM products p JOIN product_details pd ON p.product_id = pd.product_id WHERE product_detail_id = $1 AND p.archived_at is null AND pd.archived_at is null',[pdId]);
    if(sellersId.rows[0].seller_id === sellerId){
        try{
            await pool.query('INSERT INTO product_address (product_detail_id,address) VALUES ($1,$2)',[pdId,address]);
            res.status(200).send('Address added');
        } catch(err){
            res.sendStatus(500);
            console.error(err);
        }
    } else{
        res.status(400).json('You are not seller for this product');
    }
}

const updateProduct = async(req: Request,res: Response)=>{
    const sellerId: number = req.userId;
    const {pdId,pId} = req.params as unknown as {pdId: number,pId: number};
    let {quantity,price} = req.body as {quantity: number,price: number};
    try{
        const seller_id = await pool.query('SELECT seller_id FROM products WHERE product_id = $1 AND archived_at is null',[pId]);
        if(sellerId === seller_id.rows[0].seller_id){
            const details = await pool.query('SELECT stock_quantity,price FROM product_details WHERE product_detail_id = $1 AND archived_at is null',[pdId]);
            const availableQuantity: number = details.rows[0].stock_quantity;
            const oldPrice: number = details.rows[0].price;
            if(quantity === undefined){
                quantity = availableQuantity;
            }
            if(price === undefined){
                price = oldPrice;
            }
            await pool.query(
                'UPDATE product_details SET stock_quantity = $1 , price = $2 WHERE product_detail_id = $3 AND archived_at is null', [quantity,price,pdId]);
            res.status(200).json('Updated product details');
        } else{
            res.status(400).send('You are not seller for this product');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const removeProductAddress = async(req: Request,res: Response)=>{
    const sellerId: number = req.userId;
    const {pdId,pId,paId} = req.params as unknown as {pdId: number,pId: number,paId: number};
    try{
        const seller_id = await pool.query('SELECT seller_id FROM products WHERE product_id = $1 AND archived_at is null',[pId]);
        if(sellerId === seller_id.rows[0].seller_id){
            await pool.query(
                'UPDATE product_address SET archived_at = NOW() WHERE product_detail_id = $1 AND address_id = $2 AND archived_at is null', [pdId,paId]);
            res.status(200).json('Removed product address');
        } else{
            res.status(400).send('You are not seller for this product');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const getSellerProducts = async(req: Request,res: Response)=>{
    const sellerId: number = req.userId;
    try{
        const productId = await pool.query('SELECT product_id,name,category FROM products WHERE seller_id = $1 AND archived_at is null',[sellerId]);
        if(productId.rowCount === 0){
            res.status(400).send(`You don't have any products`);
        }
        const productsId: number[] = [];
        productId.rows.forEach(product=>{
            productsId[productsId.length] = product.product_id
        });
        const details = await pool.query('SELECT product_id,colour,stock_quantity,price FROM product_details WHERE product_id = ANY($1) AND archived_at is null',[productsId]);
        const detailMap = new Map();
        details.rows.forEach(detail=>{
            if(!detailMap.has(detail.product_id)){
                detailMap.set(detail.product_id,[{colour: detail.colour, quantity: detail.stock_quantity, price: detail.price}])
            } else{
                detailMap.get(detail.product_id).push({colour: detail.colour, quantity: detail.stock_quantity, price: detail.price})
            }
        });
        productId.rows.forEach(product=>{
            if(!detailMap.has(product.product_id)){
                product.details = [];
            } else{
                product.details = detailMap.get(product.product_id);
            }
        });
        res.status(200).json(productId.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const getProducts = async(req: Request,res: Response)=>{
    const {category} = req.body as {category: string};
    const page = req.query.page as unknown as number;
    const limit = req.query.limit as unknown as number;
    const offset = (page - 1)*limit;
    if(page <= 0){
        res.sendStatus(400);
    } else{
        try{
            let productId;
            if(category === undefined){
                productId = await pool.query('SELECT product_id,name,category FROM products WHERE archived_at is null LIMIT $1 OFFSET $2',[limit,offset]);
            } else{
                productId = await pool.query('SELECT product_id,name,category FROM products WHERE category = $1 AND archived_at is null LIMIT $2 OFFSET $3',[category,limit,offset]);
            }
            const productsId: number[] = [];
            productId.rows.forEach(product=>{
                productsId[productsId.length] = product.product_id
            });
            const details = await pool.query('SELECT product_id,colour,stock_quantity,price FROM product_details WHERE product_id = ANY($1) AND archived_at is null',[productsId]);
            const detailsMap = new Map();
            details.rows.forEach(detail=>{
                if(!detailsMap.has(detail.product_id)){
                    detailsMap.set(detail.product_id,[{colour: detail.colour, quantity: detail.stock_quantity, price: detail.price}])
                } else{
                    detailsMap.get(detail.product_id).push({colour: detail.colour, quantity: detail.stock_quantity, price: detail.price})
                }
            });
            productId.rows.forEach(product=>{
                if(!detailsMap.has(product.product_id)){
                    product.details = [];
                } else{
                    product.details = detailsMap.get(product.product_id);
                }
            });
            res.status(200).json(productId.rows);
        } catch(err){
            res.sendStatus(500);
            console.error(err);
        }
    }
}

const addToCart = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    const {pdId} = req.params as unknown as {pdId: number};
    const {quantity} = req.body as {quantity: number};
    try{
        const cartId = await pool.query('SELECT cart_id FROM cart WHERE user_id = $1 AND product_detail_id = $2 AND archived_at is null',[userId,pdId]);
        if(cartId.rowCount === 0){
            const productQuantity = await pool.query('SELECT stock_quantity FROM product_details WHERE product_detail_id = $1 AND archived_at is null',[pdId]);
            if(quantity > productQuantity.rows[0].stock_quantity){
                res.status(400).send(`Only ${productQuantity.rows[0].stock_quantity} are available in stock`);
            } else{
                await pool.query('INSERT INTO cart (user_id,product_detail_id,quantity) VALUES ($1,$2,$3)',[userId,pdId,quantity]);
                res.status(200).json('Added To Cart');
            }
        } else{
            res.status(409).send('product already in cart');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const viewCart = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    try{
        const cart = await pool.query('SELECT product_detail_id,quantity FROM cart WHERE user_id = $1 AND archived_at is null',[userId]);
        const pdId: number[] = [];
        cart.rows.forEach(product=>{
            pdId[pdId.length] = product.product_detail_id
        });
        const details = await pool.query('SELECT pd.product_detail_id,name,category,pd.product_id,colour,price FROM products p JOIN product_details pd ON p.product_id = pd.product_id WHERE pd.product_detail_id = ANY($1) AND p.archived_at is null AND pd.archived_at is null',[pdId]);
        const detailMap = new Map();
        details.rows.forEach(detail=>{
            if(!detailMap.has(detail.product_detail_id)){
                detailMap.set(detail.product_detail_id,[{name: detail.name, category: detail.category, colour: detail.colour, price: detail.price, productId: detail.product_id}])
            } else{
                detailMap.get(detail.product_detail_id).push({name: detail.name, category: detail.category, colour: detail.colour, price: detail.price, productId: detail.product_id})
            }
        });
        cart.rows.forEach(product=>{
            if(!detailMap.has(product.product_detail_id)){
                product.details = [];
            } else{
                product.details = detailMap.get(product.product_detail_id);
            }
        });
        res.status(200).json(cart.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const removeFromCart = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    const {pdId} = req.params as unknown as {pdId: number};
    try{
        const cartId = await pool.query('SELECT cart_id FROM cart WHERE product_detail_id = $1 AND user_id = $2 AND archived_at is null',[pdId,userId]);
        if(cartId.rowCount === 0){
            res.status(400).send('Product not in Cart');
        } else{
            await pool.query('UPDATE cart SET archived_at = NOW() WHERE product_detail_id = $1 AND user_id = $2 AND archived_at is null', [pdId,userId]);
            res.status(200).json('Product Removed from Cart');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const updateCart = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    const {pdId} = req.params as unknown as {pdId: number};
    const {quantity} = req.body as {quantity: number};
    try{
        const cartId = await pool.query('SELECT cart_id FROM cart WHERE product_detail_id = $1 AND user_id = $2 AND archived_at is null',[pdId,userId]);
        if(cartId.rowCount === 0){
            res.status(400).send('Product not in Cart');
        } else{
            if(quantity === 0){
                await pool.query('UPDATE cart SET archived_at = NOW() WHERE product_detail_id = $1 AND user_id = $2 AND archived_at is null', [pdId,userId]);
            } else{
                const productQuantity = await pool.query('SELECT stock_quantity FROM product_details WHERE product_detail_id = $1 AND archived_at is null',[pdId]);
                if(quantity > productQuantity.rows[0].stock_quantity){
                    res.status(400).send(`Only ${productQuantity.rows[0].stock_quantity} are available in stock`);
                } else{
                    await pool.query('UPDATE cart SET quantity = $1 WHERE product_detail_id = $2 AND user_id = $3 AND archived_at is null', [quantity,pdId,userId]);
                }
            }
            res.status(200).json('Cart Updated');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const order = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    const {paymentMethod} = req.body as {paymentMethod: string};
    const client = await pool.connect()
    try{
        const details = await pool.query('SELECT product_detail_id,quantity FROM cart WHERE user_id = $1 AND archived_at is null',[userId]);
        if(details.rowCount === 0){
            res.status(400).json('Cart is Empty');
        } else{
            const pdId: number[] = [];
            const quantity: number[] = [];
            details.rows.forEach(product=>{
                pdId[pdId.length] = product.product_detail_id;
                quantity[quantity.length] = product.quantity;
            });
            const prices = await pool.query('SELECT price FROM product_details WHERE product_detail_id = ANY($1) AND archived_at is null',[pdId]);
            const price: number[] = [];
            prices.rows.forEach(product=>{
                price[price.length] = product.price;
            });
            let amount: number = 0;
            for(let i = 0; i < details.rows.length; i++){
                amount = amount + (quantity[i] * price[i]);
            }
            await client.query('BEGIN');
            const insertOrder = 'INSERT INTO orders (user_id,payment_method,total_amount) VALUES ($1,$2,$3) RETURNING order_id';
            const insertOrderValues = [userId,paymentMethod,amount];
            const orderId = await client.query(insertOrder,insertOrderValues);
            let insertOrderDetails = `INSERT INTO order_details (order_id,product_detail_id,quantity) VALUES`;
            for(let i = 0; i < details.rows.length - 1; i++){
                insertOrderDetails = insertOrderDetails + ` (` + orderId.rows[0].order_id + `,` + pdId[i] + `,` + quantity[i] + `),`
            }
            insertOrderDetails = insertOrderDetails + ` (` + orderId.rows[0].order_id + `,` + pdId[details.rows.length - 1] + `,` + quantity[details.rows.length - 1] + `)`;
            await client.query(insertOrderDetails);
            const updateCart = 'UPDATE cart SET archived_at = NOW() WHERE user_id = $1 AND archived_at is null';
            const updateCartValues = [userId];
            await client.query(updateCart,updateCartValues);
            const productDetails = await pool.query('SELECT stock_quantity FROM product_details WHERE product_detail_id = ANY($1) AND archived_at is null',[pdId]);
            const oldQuantity: number[] = [];
            productDetails.rows.forEach(product=>{
                oldQuantity[oldQuantity.length] = product.stock_quantity;
            });
            const newQuantity: number[] = [];
            for(let i = 0; i < productDetails.rows.length; i++){
                newQuantity[i] = oldQuantity[i] - quantity[i];
            }
            let updateProduct = `UPDATE product_details SET stock_quantity = CASE product_detail_id`;
            for(let i = 0; i < productDetails.rows.length - 1; i++){
                updateProduct = updateProduct + ` WHEN ` + pdId[i] + ` THEN ` + newQuantity[i]
            }
            updateProduct = updateProduct + ` WHEN ` + pdId[productDetails.rows.length - 1] + ` THEN ` + newQuantity[productDetails.rows.length - 1] + ` END WHERE product_detail_id = ANY($1) AND archived_at is null`;
            const updateProductValues = [pdId];
            await client.query(updateProduct,updateProductValues);
            await client.query('COMMIT');
            res.status(200).json('Order Placed');
        }
    } catch(err){
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.error(err);
    } finally{
        client.release();
    }
}

const viewOrder = async(req: Request,res: Response)=>{
    const userId: number = req.userId;
    try{
        const Orders = await pool.query('SELECT order_id,payment_method,total_amount FROM orders WHERE user_id = $1',[userId]);
        const orderId: number[] = [];
        Orders.rows.forEach(order=>{
            orderId[orderId.length] = order.order_id;
        });
        const orderDetails = await pool.query('SELECT order_id,product_detail_id,quantity FROM order_details WHERE order_id = ANY($1)',[orderId]);
        const detailMap = new Map();
        orderDetails.rows.forEach(detail=>{
            if(!detailMap.has(detail.order_id)){
                detailMap.set(detail.order_id,[{product_detail_id: detail.product_detail_id, quantity: detail.quantity}])
            } else{
                detailMap.get(detail.order_id).push({product_detail_id: detail.product_detail_id, quantity: detail.quantity})
            }
        });
        Orders.rows.forEach(order=>{
            if(!detailMap.has(order.order_id)){
                order.details = [];
            } else{
                order.details = detailMap.get(order.order_id);
            }
        });
        res.status(200).json(Orders.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err);
    }
}

const getAllUsers = async(req: Request,res: Response)=>{
    const page = req.query.page as unknown as number;
    const limit = req.query.limit as unknown as number;
    const offset = (page - 1)*limit;
    if(page <= 0){
        res.sendStatus(400);
    } else{
        try{
            const users = await pool.query('SELECT user_id,name,email FROM users WHERE is_user = $1 AND archived_at is null LIMIT $2 OFFSET $3',
                [true,limit,offset]);
            const userId: number[] = [];
            users.rows.forEach(user=>{
                userId[userId.length] = user.user_id
            });
            const allAddresses = await pool.query('SELECT user_id,address FROM user_address WHERE user_id = ANY($1) AND archived_at is null',[userId]);
            const addressMap = new Map();
            allAddresses.rows.forEach(address=>{
                if(!addressMap.has(address.user_id)){
                    addressMap.set(address.user_id,[{address: address.address}])
                } else{
                    addressMap.get(address.user_id).push({address: address.address})
                }
            });
            users.rows.forEach(user=>{
                if(!addressMap.has(user.user_id)){
                    user.addresses = [];
                } else{
                    user.addresses = addressMap.get(user.user_id);
                }
            });
            const allUserImages = await pool.query('SELECT i.image_id,name,path,user_id FROM images i JOIN user_images u ON i.image_id = u.image_id WHERE user_id = any($1) AND category = $2 AND i.archived_at is null AND u.archived_at is null',[userId,'user']);
            const imageMap = new Map<number,string[]>();
            for(let i = 0; i < allUserImages.rows.length; i++){
                const expTime = new Date(new Date().getTime() + 10 * 60000)
                const result = await storage.file(allUserImages.rows[i].path + allUserImages.rows[i].name).getSignedUrl({
                    action: "read",
                    expires: expTime
                })
                if(!imageMap.has(allUserImages.rows[i].user_id)){
                    imageMap.set(allUserImages.rows[i].user_id, [result[0]])
                } else{
                    imageMap.get(allUserImages.rows[i].user_id)?.push(result[0])
                }
            }
            users.rows.forEach(user=>{
                if(!imageMap.has(user.user_id)){
                    user.images = [];
                } else{
                    user.images = imageMap.get(user.user_id);
                }
            });
            res.status(200).json(users.rows);
        } catch(err){
            res.sendStatus(500);
            console.error(err);
        }
    }
}

const getAllSellers = async(req: Request,res: Response)=>{
    const page = req.query.page as unknown as number;
    const limit = req.query.limit as unknown as number;
    const offset = (page - 1)*limit;
    if(page <= 0){
        res.sendStatus(400);
    } else{
        try{
            const sellers = await pool.query('SELECT user_id,name,email FROM users WHERE is_seller = $1 AND archived_at is null LIMIT $2 OFFSET $3',
                [true,limit,offset]);
            const sellerId: number[] = [];
            sellers.rows.forEach(seller=>{
                sellerId[sellerId.length] = seller.user_id
            });
            const allAddresses = await pool.query('SELECT user_id,address FROM user_address WHERE user_id = ANY($1) AND archived_at is null',[sellerId]);
            const addressMap = new Map();
            allAddresses.rows.forEach(address=>{
                if(!addressMap.has(address.user_id)){
                    addressMap.set(address.user_id,[{address: address.address}])
                } else{
                    addressMap.get(address.user_id).push({address: address.address})
                }
            });
            sellers.rows.forEach(seller=>{
                if(!addressMap.has(seller.user_id)){
                    seller.addresses = [];
                } else{
                    seller.addresses = addressMap.get(seller.user_id);
                }
            });
            const allSellerImages = await pool.query('SELECT i.image_id,name,path,user_id FROM images i JOIN user_images u ON i.image_id = u.image_id WHERE user_id = any($1) AND category = $2 AND i.archived_at is null AND u.archived_at is null',[sellerId,'user']);
            const imageMap = new Map<number,string[]>();
            for(let i = 0; i < allSellerImages.rows.length; i++){
                const expTime = new Date(new Date().getTime() + 10 * 60000)
                const result = await storage.file(allSellerImages.rows[i].path + allSellerImages.rows[i].name).getSignedUrl({
                    action: "read",
                    expires: expTime
                })
                if(!imageMap.has(allSellerImages.rows[i].user_id)){
                    imageMap.set(allSellerImages.rows[i].user_id, [result[0]])
                } else{
                    imageMap.get(allSellerImages.rows[i].user_id)?.push(result[0])
                }
            }
            sellers.rows.forEach(seller=>{
                if(!imageMap.has(seller.user_id)){
                    seller.images = [];
                } else{
                    seller.images = imageMap.get(seller.user_id);
                }
            });
            res.status(200).json(sellers.rows);
        } catch(err){
            res.sendStatus(500);
            console.error(err);
        }
    }
}

export {
    registerUser,
    registerSeller,
    login,
    addUserAddress,
    getDetails,
    updateDetails,
    updateAddress,
    deleteAddress,
    addProduct,
    addProductImage,
    addProductAddress,
    updateProduct,
    removeProductAddress,
    getSellerProducts,
    getProducts,
    addToCart,
    viewCart,
    removeFromCart,
    updateCart,
    order,
    viewOrder,
    getAllUsers,
    getAllSellers
}

