'use client'
import { Info, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { z } from "zod"
import Modal from "../ui/Modal";

export function ForgetPassForm({ btnText }: { btnText: string }) {
  const [result, setResult] = useState<Result | null>({ type: '', resultCode: "" });
  const [modalOpen, setModalOpen] = useState(false);

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
     parsedCredentials.error.issues.map((i,_)=>(
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
  }, [result,])
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div >
        <button title="Click  here for forget Password" onClick={openModal} type="button" className="px-0 text-small-medium text-zinc-500">{btnText}</button>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} overLay={true}>
        <div className="bg-white animate-modal p-5 rounded-md">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h1 className="text-heading3-base text-gray-900">Forget password?</h1>
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
            <ReqBtn />
          </form>
        </div>
      </Modal>
    </div>
  )
}
function ReqBtn() {
  const { pending } = useFormStatus()

  return (
    <button
      title="Send email request"
      className="w-full py-2 flex justify-center mt-4 bg-black text-white rounded-md hover:opacity-45"
      disabled={pending || process.env.NODE_ENV === 'production'}
      type="submit"
    >
      {pending ? <Loader className='animate-spin' /> : 'Send email request'}
    </button>
  )
}