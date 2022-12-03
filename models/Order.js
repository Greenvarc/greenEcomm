import mongoose from "mongoose";
const orderSchema=new mongoose.Schema(
    {
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:false},
        orderItems:[
            {
                name:{type:String,required:true},
                quantity:{type:Number,required:true},
                image:{type:String,required:true},
                price:{type:Number,required:true}
            }
        ],
        shippingAddress:{
            fullName:{type:String,required:true},
            address:{type:String,required:true},
            city:{type:String,required:true},
            postalCode:{type:String,required:true},
            country:{type:String,required:true},

        },
        paymentMethod:{type:String,required:true},
        paymentResult:{id:String,status:String,email_address:String},
        itemsPrice:{type:Number,required:true},
        shippingPrice:{type:Number,required:false},
        taxPrice:{type:Number,required:false},
        totalPrice:{type:Number,required:false},
        isPaid: { type: Boolean, required: true, default: false },
        isDelivered: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        deliveredAt: { type: Date },
    },
    {
        timestamps:true,
    }
)
//use the latestif the schema is already created,create new if not
const Ordery=mongoose.models.Ordery || mongoose.model('Ordery',orderSchema)

export default Ordery;
