import { auth, signIn } from '@/auth'
import { ForgetPassForm } from '@/components/auth/Forget-passwordForm'
import ResetForm from '@/components/auth/reset-pass-form'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import * as React from "react"




export default async function ResetPassPage({ searchParams }: { searchParams: { token: string,id:string} }) {
    const session = (await auth()) as Session

    if (session||!searchParams.token) {
        redirect('/')
    }

    return (
        <div className="flex flex-col mt-16 h-screen items-center">
            <div className="sm:w-[400px]">
                <div className='pb-0'>
                    <div >Reset Password</div>
                    <div>Reset password with token to continue.</div>
                </div>
                <div>
                    <ResetForm token={searchParams.token} userId={searchParams.id} />
                </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-zinc-400">
                Expired Token? <div className="font-semibold underline"><ForgetPassForm btnText='Resend'/></div>
            </div>
        </div>
    )
}