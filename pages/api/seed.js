import Product from "../../models/Product";
import User from "../../models/User";
import data from "../../utils/data";
import db from "../../utils/db"


const handler=async (req,res)=>{
    await db.connect();
    //create user,using User modal
    await User.deleteMany(); //delete first
    await User.insertMany(data.users) // users from data.users

    await Product.deleteMany(); //delete first
    await Product.insertMany(data.products) // users from data.users

    await db.disconnect()
    res.send({message:'seed successfully'})
}

export default handler;