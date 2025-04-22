'use client'

import { useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircleIcon, Eye, EyeOff, Loader } from 'lucide-react'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { getSession, useSession } from 'next-auth/react'

export default function ResetForm({ token, userId }: { token: string, userId: string }) {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false)

    const redirectUrl = searchParams.get("redirect_url") || "/";
    const router = useRouter();
    const [result, setResult] = useState<Result | null>({ type: '', resultCode: "" });

    async function resetPassword(
        formData: FormData) {
        const token = formData.get('token');
        const userId = formData.get('userId');
        const password = formData.get('password');
        const ConfirmPassword = formData.get('cpassword');

        const parsedCredentials = z
            .object({
                token: z.string().uuid(),
                userId:z.string().min(23, "Invalid userId").transform((id) => String(id)),
                password: z.string().min(6, "Password must be at least 6 characters long"),
                ConfirmPassword: z.string().min(6, "ConfirmPassword must be at least 6 characters long"),
            })
            .safeParse({
                token,
                userId,
                password,
                ConfirmPassword
            });
        if (parsedCredentials.error) {
            parsedCredentials.error.issues.map((i, _) => (
                toast.error(i.message)
            ))
        } else if (parsedCredentials.data?.ConfirmPassword !== parsedCredentials.data?.password) {
            toast.error('Passwords Do not match')
        } else {
            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: parsedCredentials.data.token,
                        userId: parsedCredentials.data.userId,
                        ConfirmPassword: parsedCredentials.data.ConfirmPassword,
                        password: parsedCredentials.data.password
                    }),
                });

                const result = await response.json();

                setResult(result)
            } catch (error) {
                console.error('Error in resetPassword:', error);
                toast.error('An unexpected error occurred ' + (error as Error).message);
            }
        }
    }


    useEffect(() => {
        async function updateSession() {
            if (result && result.type) {
                if (result.type === 'error') {
                    toast.error(result.resultCode)
                } else {
                    toast.success(result.resultCode)
                    await getSession();
                }
            }
        }
        updateSession();
    }, [result, router])

    useEffect(() => {
        if (session) {
          router.push(redirectUrl);
        }
      }, [session, router]);

    return (
        <form
            action={(formData: FormData) => resetPassword(formData)}
        >
            <input
                className="peer hidden w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="token"
                type="text"
                name="token"
                placeholder="Enter token from url"
                required
                defaultValue={token}
            />
            <input
                className="peer hidden w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="userId"
                type="text"
                name="userId"
                placeholder="Enter userId from url"
                required
                defaultValue={userId}
            />
            <div className="mb-6 relative">
                <div className="mt-3 mb-1 flex justify-between items-center">
                    <label
                        className="block text-small-medium text-zinc-400"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <button
                        type="button"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                        onClick={() => setShowPassword(prev => !prev)}
                        className="block text-small-medium text-zinc-400"
                    >
                        {showPassword ? <Eye size={'1rem'} /> : <EyeOff size={'1rem'} />}
                    </button>
                </div>

                <input
                    className="peer invalid:border-red-500 block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter password"
                    minLength={6}
                    // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[#\$&]).{6,}$"
                    title="Must be at least 6 characters and better to have include upper & lower case letters and a symbol (#, $, &)"
                // required
                />

                <div className="absolute z-10 hidden peer-invalid:block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs w-72 mt-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                    <div className="p-3 space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Must have at least 6 characters
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                            <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                            <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                            <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                        <p>And</p>
                        <ul>
                            <li className="flex items-center mb-1">
                                Upper & lower case letters
                            </li>
                            <li className="flex items-center mb-1">A symbol (#$&)</li>
                            <li className="flex items-center">
                                A longer password (min. 12 chars.)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <label
                className="block mb-2 text-small-medium text-zinc-400"
                htmlFor="cpassword"
            >
                Confirm Password
            </label>
            <input
                className="peer invalid:border-red-500 block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="cpassword"
                type="password"
                name="cpassword"
                placeholder="Enter password"
                // required
                minLength={6}
            />

            <ResetBtn />
            {result && result.type === 'succes' && <div className="bg-green-200 flex px-3 gap-3 items-center mt-4 py-3 w-full rounded-md">
                <CheckCircleIcon />
                <p className="text-primary">
                    Password Reset successful you can login now.
                </p>
            </div>}
        </form>
    )
}

function ResetBtn() {
    const { pending } = useFormStatus()

    return (
        <button
            title='Click here to reset password'
            className="w-full py-2 flex justify-center bg-black text-white rounded-md hover:opacity-65 mt-4 text-center"
            aria-disabled={pending}
        >
            {pending ? <Loader className='animate-spin' /> : 'Confirm'}
        </button>
    )
}
