const bcryptjs = require('bcryptjs');

import User from "../../../models/User";
import db from "../../../utils/db";

async function handler (req,res){
    if(req.method !=='POST'){
        return
    }
    const {name,email,password}=req.body;
    if(
        !name ||
        !email ||
        !email.includes('@')||
        !password ||
        password.trim().length<3
    ){
        res.status(422).json({
            message:'validation error ?'
        })
        return
    }
    await db.connect()
    //seach and check if user exist(alr)
    const existingUser=await User.findOne({email:email})
    if(existingUser){
        res.status(422).json({message:"user exists already"})
        await db.disconnect();
        return;
    }
    //create user
    const newUser=new User({
        name,
        email,
        password:bcryptjs.hashSync(password),
        isAdmin:false
    })

    const user=await newUser.save()
    db.disconnect()
    res.status(201).send({
        message:'Crested user',
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
    })
}
export default handler