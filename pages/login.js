import Link from 'next/link'
import React from 'react'
import { useForm } from "react-hook-form";
import {signIn, useSession} from 'next-auth/react'

import Layout from '../components/Layout'
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


function LoginScreen() {
    const router=useRouter()
    const {redirect}=router.query

    const {data:session}=useSession()

    useEffect(()=>{
        if(session?.user){
            router.push(redirect || '/')
        }

    },[router,session,redirect])

    const { register,
         handleSubmit,
         formState: { errors } } = useForm();
    const submitHandler= async ({email,password})=>{
        try {
            const result =await signIn('credentials',{
                redirect:false,
                email,
                password,
            })
            if(result.error){
                toast.error(result.error)
            }
        } catch (err) {
            toast.error(getError(err))
        }
    }

  return (
    <Layout title='login'>
        <form action="" className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
        >
            <h1 className='mb-4 text-xl'>Login</h1>
            <div className='mb-4'>
                <label htmlFor="email">Email</label>
                <input
                {...register('email',{required:'Please enter email',pattern:{
                    value:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message:'enter valid@email.adress'
                }})}
                 type="email" className='w-full' id='email' autoFocus/>
                 {errors.email&& (<div className='text-red-400'>{errors.email.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor="password">Password</label>
                <input
                {...register('password',{required:'Please enter password',
                minLength:{value:6,message:'password must be more than 5 characters'}
                })}
                 type="password" className='w-full' id='password' autoFocus/>
                  {errors.password&& (<div className='text-red-400'>{errors.password.message}</div>)}
            </div>
            <div className="mb-4">
                <button className="primary-button">Login</button>
            </div>
            <div className='mb-4'>
                Don&apos;t have an account &nbsp;
                <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
            </div>
        </form>
    </Layout>
  )
}

export default LoginScreen
