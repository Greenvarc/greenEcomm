/* eslint-disable no-unused-vars */
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import Product from '../../models/Product'
import data from '../../utils/data'
import db from '../../utils/db'
import { Store } from '../../utils/Store'

function ProductScreen({product}) {
    const router=useRouter()
    const {state,dispatch} = useContext(Store)
    // const {query} =useRouter()
    // const{slug}=query
    // const product=data.products.find(x=>x.slug===slug)
    if (!product){
        return <Layout title={'not found'}>Product not Found</Layout>
    }
    const addToCart=async()=>{
        const existitem=state.cart.cartItems.find((item)=>item.slug===product.slug)
        const quantity=existitem?existitem.quantity+1:1;
        const {data}= await axios.get(`/api/products/${product._id}`)

        if(data.countInStock<quantity){
            alert("Sorry we don't have that much")
        }
        dispatch({type:'CART_ADD_ITEM',payload:{...product,quantity:quantity}})
        router.push('/cart')
    }

  return (
    <Layout title={product.name}>
        <div className="py-2">
            <Link href='/'>back to product</Link>
        </div>
        <div className="grid md:grid-cols-4 md:gap-3">
            <div className="md:col-span-2">
                <Image
                src={product.image}
                alt={product.name}
                width={640}
                height={640}
                layout='responsive'
                />
            </div>
            <div>
                <ul>
                    <li>
                        <h1>{product.name}</h1>
                    </li>
                    <li>Category: {product.category}</li>
                    <li>Brand: {product.brand}</li>
                    <li>{product.rating} of {product.numReviews} reviews</li>
                    <li>Description: {product.description}</li>
                </ul>
            </div>
            <div>
                <div className="card p-5">
                    <div className='mb-2 flex justify-between'>
                        <div>Price</div>
                        <div>${product.price}</div>
                    </div>
                    <div className='mb-2 flex justify-between'>
                        <div>Status:</div>
                        <div> {product.countInStock>0?'In Stock':'Unvalaible'}</div>
                    </div>
                    <button className='primary-button w-full' onClick={addToCart}>Add to cart</button>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default ProductScreen

export async function getServerSideProps(context){
    //get glug from context
    const {params}=context;
    const {slug}=params
    //get data from mongodb
    await db.connect()
    const product=await Product.findOne({slug}).lean() //get only one product

    return{
        props:{
            product:product ? db.convertDocToObj(product):null
        }
    }
}