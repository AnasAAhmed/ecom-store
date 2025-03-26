import { signIn } from '@/auth'
import * as React from "react"
import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'



export default async function LoginPage() {

  return (
    <div className="flex flex-col  mt-12 h-screen items-center">
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
      <Link
        href="/sign-up"
        title='Go to sign-up page to create new account'
        className="flex flex-row gap-1 mt-4 text-sm text-zinc-400"
      >
        No account yet? <div className="font-semibold underline">Sign up</div>
      </Link>
    </div>
  )
}