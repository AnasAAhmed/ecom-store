import Succes from '@/components/Succes';
import { Metadata } from 'next';
import React from 'react'


export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: "Borcelle | Payment_Successful",
  description: "Your Online Payment Successfully Processed",
};
const page = () => {
  return (
    <Succes />
  )
}

export default page
