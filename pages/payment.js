import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'

function PaymentSreen() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
    const router=useRouter()
    const {state,dispatch} = useContext(Store)
    const {cart}=state
    const {shippingAddress,paymentMethod}=cart

    const submitHandler=(e)=>{
        e.preventDefault();
        if (!selectedPaymentMethod){
            return toast.error('payment method is required')
        }
        dispatch({type:'SAVE_PAYMENT_METHOD',payload:selectedPaymentMethod})
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                paymentMethod:selectedPaymentMethod
            })
        )
    }
    useEffect(()=>{
        if(!shippingAddress.address){
            router.push('/shipping')
        }
        setSelectedPaymentMethod(paymentMethod || '')
    },[paymentMethod, router, shippingAddress.address])

  return (
    <Layout title='Payment Methods'>
        <CheckoutWizard activeStep={2}/>
        <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
            <h1 className="mb-4 text-xl">
                {
                    ['Paypal','Stripe','CashOnDelivery'].map((payment)=>(
                        <div key={payment} className="mb-4">
                            <input type="radio"
                            name='paymentmethod'
                            className='p-2 outline-none focus:ring-0'
                            id={payment}
                            checked={selectedPaymentMethod===payment}
                            onChange={()=>setSelectedPaymentMethod(payment)}
                            />
                            <label htmlFor={payment} className='p-2'>{payment}</label>
                        </div>
                    ))
                }
                <div className="mb-4 flex justify-between">
                    <button type='button'
                    onClick={()=>router.push('/shipping')}
                    className='default-button'
                    >
                        Back
                    </button>
                    <button
                    onClick={()=>router.push('/order')}
                     className='primary-button'>Next</button>
                </div>
            </h1>
        </form>
    </Layout>
  )
}

PaymentSreen.auth=true
export default PaymentSreen
