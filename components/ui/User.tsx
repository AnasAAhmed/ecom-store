'use client'
import { useWhishListUserStore } from "@/lib/hooks/useCart";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SmartLink from "../SmartLink";
import Modal from "./Modal";
import { CircleUserRound } from "lucide-react";
import { SubmitButton } from "../auth/SubmitBtn";

const User = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { userWishlist } = useWhishListUserStore();
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const closeModal = () => setOpen(false);

  // ✅ Fix hydration mismatch by skipping SSR rendering
  if (!mounted) {
    return <div className="w-8 h-8 my-2 rounded-full animate-pulse bg-gray-300" />;
  }

  // ✅ Safe to access session after mounted
  if (status === 'loading') {
    return <div className="w-8 h-8 my-2 rounded-full animate-pulse bg-gray-300" />;
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <SmartLink
        title="Login"
        prefetch={false}
        href={`/login?redirect_url=${encodeURIComponent(pathname)}`}
      >
        <CircleUserRound className="w-8 h-8 my-2 hover:opacity-55 cursor-pointer" />
      </SmartLink>
    );
  }
  return (
    <div className="relative">
      <button
        title="Avatar dropdown"
        onClick={() => setOpen(!open)}
        className="rounded-full hover:opacity-80 transition-opacity"
      >
        <Image
          src={session?.user?.image ?? "/default-avatar.png"}
          alt="avatar"
          unoptimized
          width={32}
          height={32}
          className="w-8 h-8 mt-2 rounded-full object-cover"
        />
      </button>

      <Modal isOpen={open} onClose={closeModal} overLay>
        <div className="animate-modal mx-auto bg-white shadow-xl rounded-lg border border-gray-200 p-4 w-full sm:w-[50%] maxs-w-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-heading4-bold font-semibold text-gray-800">Account Details</h4>
            <button
              title="Close modal"
              onClick={closeModal}
              className="text-gray-600 hover:text-black text-heading3-base font-bold"
            >
              &times;
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Name:</strong> {session?.user?.name}</p>
            <p><strong>Email:</strong> {session?.user?.email}</p>
          </div>

          <div className="mt-4">
            <h5 className="font-medium text-gray-800 mb-2">Sign-in History (last 3):</h5>
            {userWishlist?.signInHistory?.length ? (
              <ul className="space-y-2 max-h-48 overflow-y-auto text-sm text-gray-700">
                {userWishlist.signInHistory.map((entry, index) => (
                  <li key={index} className="bg-gray-100 rounded-md p-3 border">
                    <p className="text-blue-500 text-body-medium">{index === 0 ? 'Active' : ''}</p>
                    <p><strong>Date:</strong> {new Date(entry.signedInAt).toLocaleString()}</p>
                    <p><strong>Location:</strong> {entry.city}, {entry.country}</p>
                    <p><strong>Device:</strong> {entry.device} ({entry.os})</p>
                    <p><strong>Browser:</strong> {entry.browser}</p>
                    <p><strong>IP:</strong> {entry.ip}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No sign-in history available.</p>
            )}
          </div>
          <form
            action={() => signOut()} >
            <SubmitButton text="Sign out" />
          </form>
        </div>
      </Modal >
    </div >
  )
}
export default User