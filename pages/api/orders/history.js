import { getSession } from "next-auth/react"
import Ordery from "../../../models/Order"
import db from "../../../utils/db"


const handler =async (req,res)=>{
    const session=await getSession({req})
    if(!session){
        return res.status(401).send({message:'singin required'})
    }
    const {user}=session
    //orders from a specific user
    db.connect()
    const orders=await Ordery.find({user:user._id})
    await db.disconnect()
    res.send(orders);
}

export default handler