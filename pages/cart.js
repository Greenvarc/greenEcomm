import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import {XCircleIcon} from "@heroicons/react/24/outline";
import { useRouter } from 'next/router'
//to fix hydration errors, make it dynamic
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'

function CartSreen() {
    const {data:session}=useSession()

    const route=useRouter()
    const {state,dispatch} = useContext(Store)
    const {
        cart:{cartItems}
    }=state
    const removeItem=(item)=>{
        dispatch({type:'CART_REMOVE_ITEM',payload:item})
        return toast.error("Item removed from the cart")
    }
    const updateCart=async (item,qty)=>{
        const quantity=Number(qty)
        //check if avalaibility
        const {data}= await axios.get(`/api/products/${item._id}`)
        if(data.countInStock<quantity){
            return toast.error("Sorry we don't have that much")
        }

        dispatch({type:'CART_ADD_ITEM',payload:{...item,quantity}})
        toast.success('Product updated in the chart')
    }
  return (
    <Layout title='Shopping Cart'>
        <h1 className="mb-4 text-xl">Shopping Cart</h1>
        {
            cartItems.length===0?(
                <div>
                    Cart is empty . <Link href='/'>Go shopping</Link>
                </div>
            ):
            (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <table className='min-w-full'>
                            <thead className='border-b'>
                                <tr>
                                    <th className="px-5 text-left">Item</th>
                                    <th className='p-5 text-right'>Quantity</th>
                                    <th className="p-5 text-right">price</th>
                                    <th className="p-5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item)=>(
                                    <tr key={item.slug} className='border-b'>
                                        <td>
                                            <Link className='flex items-center' href={`/product/${item.slug}`}>
                                                <Image 
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}
                                                 />
                                                 &nbsp;
                                                 {item.name}
                                            </Link>
                                        </td>
                                        <td className="p-5 text-right">
                                            <select value={item.quantity} onChange={(e)=>updateCart(item,e.target.value)}>
                                                {[...Array(item.countInStock).keys()].map(x=>(
                                                    <option key={x+1} value={x+1}>{x+1}</option>
                                                ))} 
                                            </select>   
                                        </td>
                                        <td className="p-5 text-right">$ {item.price}</td>
                                        <td className="p-5 text-center">
                                            <button>
                                                <XCircleIcon className='h-5 w-5' onClick={()=>removeItem(item)}></XCircleIcon>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='text-xl'>
                        <ul>
                            <li>
                                <div className="pb-3">SubTotal ({cartItems.reduce((a,c)=>a+c.quantity,0)})
                                {" "}
                                : ${cartItems.reduce((a,c)=>a+c.quantity*c.price,0)}
                                </div>
                            </li>
                            <li>
                                <button
                                // login?red=/shipping to checck auth, if auth red in shipping if notlogin first
                                onClick={()=>route.push(session?.user ? '/shipping':'/login')}
                                 className='primary-button w-full'>
                                    Checkout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }
    </Layout>
  )
}

//added dynamic to fix hydration 
export default dynamic(()=>Promise.resolve(CartSreen),{ssr:false})
