'use client'
import { Info, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { z } from "zod"
import Modal from "../ui/Modal";
import { SubmitButton } from "./SubmitBtn";
import { useModalStore } from "@/lib/hooks/useModal";

export function ForgetPassForm() {
  const { close } = useModalStore();
  const [result, setResult] = useState<Result | null>({ type: '', resultCode: "" });

  async function resetPassRequest(
    formData: FormData) {
    const email = formData.get('email');
    const parsedCredentials = z
      .object({
        email: z.string().email()
      })
      .safeParse({
        email
      })

    if (parsedCredentials.error) {
      parsedCredentials.error.issues.map((i, _) => (
        toast.error(i.message)
      ))
    } else {
      try {
        const response = await fetch('/api/auth/reset-mail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: parsedCredentials.data.email }),
        });

        const result = await response.json();

        setResult(result)
      } catch (error) {
        console.error('Error in authentication:', error);
        toast.error('An unexpected error occurred ' + (error as Error).message);
      }
    }
  }


  useEffect(() => {
    if (result && result.type) {
      if (result.type === 'error') {
        toast.error(result.resultCode)
      } else {
        toast.success(result.resultCode)
      }
    }
  }, [result])

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [result]);


  return (
      <Modal modalKey={'forget-pass-modal'} overlay>
        <div className="bg-white w-full sm:w-[40%] mx-auto animate-modal p-5 rounded-md">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <h1 className="text-heading3-base text-gray-900">Forget password?</h1>
              <button title="Close modal" onClick={()=>close('forget-pass-modal')} type="button" className="px-0 text-heading3-bold text-zinc-500">&times;</button>
            </div>
            <div className="text-sm text-gray-600">
              We will send you the email for password reset.
              {process.env.NODE_ENV === 'production' && <div className="bg-yellow-200 flex px-3 gap-3 items-center mt-4 py-1 w-full rounded-md">
                <Info /><p className="text-primary">This feature is disabled in production.</p>
              </div>}
            </div>
          </div>
          <form
            action={(formData) => resetPassRequest(formData)}
            className="items-center">
            <label htmlFor="email" className="mb-3 valid:border-green-500 mt-2 block text-sm font-medium text-zinc-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={process.env.NODE_ENV === 'production'}
              placeholder="Enter your email address"
              className="col-span-3 border w-full p-2 rounded-md focus:outline-none"
            />
            <SubmitButton text="Send email request" title="Send email request" />
          </form>
          {result && <p className="text-red-1 text-base-medium">{result?.resultCode}</p>} </div>
      </Modal>
  )
}
export const ForgetPassModalBtn = ({ btnText }: { btnText: string }) => {
  const { open } = useModalStore();

  if (typeof window === 'undefined') {
    return <div className="w-36 h-5 my-2 animate-pulse bg-gray-300" />;
  }

  return (
    <button title="Click  here for forget Password"
      onClick={() => open('forget-pass-modal')}
      type="button"
      className="px-0 text-small-medium text-zinc-500">
      {btnText}
    </button>

  );
}