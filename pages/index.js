import axios from 'axios'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
import Product from '../models/Product'
//import data from '../utils/data'
import db from '../utils/db'
import { Store } from '../utils/Store'

export default function Home({products}) {
  const {state,dispatch} = useContext(Store);
  //const {cart}=state;

  const addToCart=async(product)=>{
    const existitem=state.cart.cartItems.find((item)=>item.slug===product.slug)
    const quantity=existitem?existitem.quantity+1:1;
    const {data}= await axios.get(`/api/products/${product._id}`)

    if(data.countInStock<quantity){
        toast.error("Sorry we don't have that much")
    }
    dispatch({type:'CART_ADD_ITEM',payload:{...product,quantity:quantity}})
    toast.success('Product added to the cart')
}
  return (
    <Layout title='Home'>
      <div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product)=>(
            <ProductItem key={product.slug} product={product} addToCart={addToCart}/>
          ))}
        </div>
      </div>
    </Layout>
  )
}


export async function getServerSideProps(){
  //load data from mongo db
  await db.connect()
  const products=await Product.find().lean();
  //console.log('product ',products)
  return {
    props:{
      products:products.map(db.convertDocToObj)
    }
  }

}