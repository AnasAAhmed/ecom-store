import {  signIn } from '@/auth'
import * as React from "react"
import Link from 'next/link'
import SignupForm from '@/components/auth/signup-form'



export default async function LoginPage() {
  return (
    <div className="flex flex-col mt-28 sm:mt-12 h-screen items-center">
  
      <div className="sm:w-[400px]">
      <div className='pb-0'>
          <h1 className='text-heading3-bold'>Sign-up</h1>
          <p className='text-body-medium mt-2'>Sign-up with your account to continue.</p>
        </div>
        <div>
          <form
            action={async () => {
              "use server"
              await signIn('google')
            }}
          >
            <button title='Sign-up With Goole' className='w-full border p-2 rounded-md flex items-center gap-4 mt-4 mb-2' >
              <img height="24" width="24" id="provider-logo" src="https://authjs.dev/img/providers/google.svg" />
              Sign up with Google
            </button>
          </form>
          <div className="text-md text-zinc-400 flex justify-center">or</div>
          <SignupForm />
        </div>
      </div>
      <Link
        href="/login"
        title='Go to login page if you already have an account'
        className="flex flex-row gap-1 mt-4 text-sm text-zinc-400"
      >
        Already have an account? <div className="font-semibold underline">Login</div>
      </Link>
    </div>
  )
}