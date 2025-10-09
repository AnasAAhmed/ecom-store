"use client"

import { Loader } from "lucide-react"
import { useFormStatus } from "react-dom"

export function SubmitButton({ text, title, logo, provider = 'google' }: { logo?: string; provider?: string; title?: string; text: string }) {
    const { pending } = useFormStatus()

    return (
        <button
            title={title || text}
            className="w-full py-2 items-center flex gap-3 justify-center border rounded-md hover:opacity-65 mt-4 text-center"
            style={{ color: logo ? 'black' : 'white', backgroundColor: logo ? 'white' : 'black' }}
            aria-disabled={pending}
        >
            {logo && <img
                alt={provider + "-logo"}
                title={provider + "-logo"}
                height="24"
                width="24"
                id={provider + "-logo"}
                src={logo} />
            }
            {text} {pending && <Loader className='animate-spin duration-100' />}
        </button>
    )
}