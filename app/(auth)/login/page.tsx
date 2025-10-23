import { signIn } from '@/auth'
import * as React from "react"
import LoginForm from '@/components/auth/login-form'
import AuthLink from '@/components/AuthLink'
import { ForgetPassModalBtn } from '@/components/auth/Forget-passwordForm'
import Loader from '@/components/ui/Loader'
import { Loader2 } from 'lucide-react'
import { SubmitButton } from '@/components/auth/SubmitBtn'



export default async function LoginPage() {
  return (
    <div className="flex flex-col mt-40 sm:mt-32 h-screen items-center">
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
            <SubmitButton text='Log in with Google' title='Login with Google' provider={'google'} logo={'https://authjs.dev/img/providers/google.svg'} />
          </form>
          <div className="text-md text-zinc-400 flex justify-center">or</div>
          <React.Suspense fallback={<Loader />}>
            <LoginForm />
          </React.Suspense>

        </div>
      </div>
      <ForgetPassModalBtn btnText='Forget Password?' />
      <React.Suspense fallback={<Loader2 />}>
        <AuthLink url='sign-up' title='No account yet? Go to sign-up page'>
          No account yet? <span className="underline text-body-medium">Sign up</span>
        </AuthLink>
      </React.Suspense>

    </div>
  )
}