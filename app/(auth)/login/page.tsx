import { signIn } from '@/auth'
import * as React from "react"
import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'
import AuthLink from '@/components/AuthLink'



export default async function LoginPage() {

  return (
    <div className="flex flex-col mt-28 sm:mt-12 h-screen items-center">
      <div className="sm:w-[400px]">
        <div className='pb-0'>
          <h1 className='text-heading3-bold'>Login</h1>
          <p className='text-body-medium mt-2'>Login with your account to continue.</p>
        </div>
        <div>
          <form
            action={async () => {
              "use server"
              await signIn('google')
            }}
          >
            <button title='Login with Google' className='w-full border p-2 rounded-md flex items-center gap-4 mt-4 mb-2' >
              <img height="24" width="24" id="google-logo" src="https://authjs.dev/img/providers/google.svg" />
              Log in with Google
            </button>
          </form>
          <div className="text-md text-zinc-400 flex justify-center">or</div>
          <LoginForm />
        </div>
      </div>
      <AuthLink url='sign-up' title='No account yet? Go to sign-up page'>
          No account yet? <span className="font-semibold underline">Sign up</span>
      </AuthLink>
    </div>
  )
}