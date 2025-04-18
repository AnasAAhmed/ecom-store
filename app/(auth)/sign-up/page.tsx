import { signIn } from '@/auth'
import * as React from "react"
import Link from 'next/link'
import SignupForm from '@/components/auth/signup-form'
import AuthLink from '@/components/AuthLink'



export default async function LoginPage() {
  return (
    <div className="flex flex-col mt-28 sm:mt-20 h-screen items-center">

      <div className="sm:w-[400px]">
        <div className='pb-0'>
          <h1 className='text-heading3-base'>Sign-up</h1>
          <p className='text-body-medium mt-4 text-gray-500'>Sign-up with your account to continue.</p>
        </div>
        <div>
          <form
            action={async () => {
              "use server"
              await signIn('google')
            }}
          >
            <button title='Sign-up With Google' className='w-full border p-2 rounded-md flex items-center gap-4 mt-4 mb-2' >
              <img alt='google logo' height="24" width="24" id="provider-logo" src="https://authjs.dev/img/providers/google.svg" />
              Sign up with Google
            </button>
          </form>
          <div className="text-md text-zinc-400 flex justify-center">or</div>
          <SignupForm />
        </div>
      </div>
      <AuthLink url='login' title='No account yet? Go to login page'>
        Already have an account? <span className="underline text-body-medium">Login</span>
      </AuthLink>
    </div>
  )
}