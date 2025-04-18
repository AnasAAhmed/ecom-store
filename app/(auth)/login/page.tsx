import { signIn } from '@/auth'
import * as React from "react"
import LoginForm from '@/components/auth/login-form'
import AuthLink from '@/components/AuthLink'
import { ForgetPassForm } from '@/components/auth/Forget-passwordForm'



export default async function LoginPage() {

  return (
    <div className="flex flex-col mt-28 sm:mt-20 h-screen items-center">
      <div className="sm:w-[400px]">
        <div className='pb-0'>
          <h1 className='text-heading3-base'>Login</h1>
          <p className='text-body-medium mt-4 text-gray-500'>Login with your account to continue.</p>
        </div>
        <div>
          <form
            action={async () => {
              "use server"
              await signIn('google')
            }}
          >
            <button title='Login with Google' className='w-full border p-2 rounded-md flex items-center gap-4 mt-4 mb-2' >
              <img alt='google logo' height="24" width="24" id="google-logo" src="https://authjs.dev/img/providers/google.svg" />
              Log in with Google
            </button>
          </form>
          <div className="text-md text-zinc-400 flex justify-center">or</div>
          <LoginForm />

        </div>
      </div>
        <ForgetPassForm btnText='Forget Password?' />
      <AuthLink url='sign-up' title='No account yet? Go to sign-up page'>
          No account yet? <span className="underline text-body-medium">Sign up</span>
      </AuthLink>
    </div>
  )
}