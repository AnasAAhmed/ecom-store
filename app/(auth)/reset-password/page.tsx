import { auth } from '@/auth'
import { ForgetPassForm } from '@/components/auth/Forget-passwordForm'
import ResetForm from '@/components/auth/reset-pass-form'
import Loader from '@/components/ui/Loader'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import * as React from "react"




export default async function ResetPassPage(props: { searchParams: Promise<{ token: string, id: string }> }) {
    const searchParams = await props.searchParams;
    const session = (await auth()) as Session

    if (session || !searchParams.token || !searchParams.id) {
        redirect('/')
    }

    return (
        <div className="flex flex-col mt-28 sm:mt-32 h-screen items-center">
            <div className="sm:w-[400px]">
                <div className='pb-0'>
                    <h1 className='text-heading3-base mb-2'>Reset Password</h1>
                </div>
                <div>
                    <React.Suspense fallback={<Loader />}>
                        <ResetForm token={searchParams.token} userId={searchParams.id} />
                    </React.Suspense>
                </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-zinc-400">
                Expired Token? <div className="font-semibold underline"><ForgetPassForm btnText='Resend' /></div>
            </div>
        </div>
    )
}