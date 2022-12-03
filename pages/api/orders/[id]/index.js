import { getSession } from "next-auth/react"
import Ordery from "../../../../models/Order"
import db from "../../../../utils/db"

const handler=async(req,res)=>{
    const session= await getSession({req})
    if (!session){
        res.status(401).send('signin required')
        return
    }
    await db.connect()
    const order=await Ordery.findById(req.query.id);
    db.disconnect()
    
    res.send(order)
}

export default handler