import GroupComponent7 from "@/components/ui/Services";
import type { Metadata } from 'next';
import Banner from "@/components/ui/Banner";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Borcelle | Contact",
    description: "Contact Us 24/7",
};
export const dynamic = 'force-static';
const Contact = () => {
    return (
        <>
            <div className="w-full bg-white overflow-hidden text-left text-black font-poppins">
                <Banner
                    heading="Contact"
                    text="24/7 Service available."
                    imgUrl={'https://www.shutterstock.com/image-photo/contact-us-telephone-envelope-letter-600nw-2369194627.jpg'}
                    shade=""
                    textColor="gray-800"
                    link="/search"
                    buttonText={'Contact Us'}
                    scrollDown={true}
                />
                <div className="flex flex-col items-center py-16 px-4">
                    <h1 className="text-heading2-bold">Get In Touch With Us</h1>
                    <p className="text-center text-gray-500 mt-4 mb-8 max-w-xl">
                        For more information about our products & services, please feel free
                        to drop us an email. Our staff is always here to help you out. Do not
                        hesitate!
                    </p>
                    <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">
                        <ContactContainer />
                        <form id="form" className="flex flex-col gap-6 w-full lg:w-1/2 bg-white p-8 rounded shadow-md">
                            <div>
                                <label className="block text-lg font-medium">Your name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium">Email address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded"
                                    placeholder="Abc@def.com"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded"
                                    placeholder="This is optional"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium">Message</label>
                                <textarea
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded h-32"
                                    placeholder="Hi! I’d like to ask about..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                title="Submit your message to us"
                                className="mt-4 py-3 px-6 bg-black text-white rounded hover:bg-gray-800"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <GroupComponent7
                freeDeliveryHeight="unset"
                freeDeliveryDisplay="unset"
                daysReturnHeight="unset"
                daysReturnDisplay="unset"
                securePaymentHeight="unset"
                securePaymentDisplay="unset"
            />
        </>
    );
};

const ContactContainer = () => {
    return (
        <div className="w-full lg:w-1/2 flex flex-col gap-6 p-8 rounded shadow-md bg-white">
            <div className="flex items-center gap-4">
                <img
                    src="https://figma-to-code-ecom-design.vercel.app/vector1.svg"
                    alt="Address icon"
                    className="w-8 h-8"
                />
                <div>
                    <h3 className="text-lg font-medium">Address</h3>
                    <p className="text-gray-600">
                        236 5th SE Avenue, New York NY10000, United States
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <img
                    src="https://figma-to-code-ecom-design.vercel.app/bxsphone.svg"
                    alt="Phone icon"
                    className="w-8 h-8"
                />
                <div>
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p className="text-gray-600">Mobile: +(84) 546-6789</p>
                    <p className="text-gray-600">Hotline: +(84) 456-6789</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Mail className="w-8 h-8" />
                <div>
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="text-gray-600">example@gmail.com</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <img
                    src="https://figma-to-code-ecom-design.vercel.app/biclockfill.svg"
                    alt="Clock icon"
                    className="w-8 h-8"
                />
                <div>
                    <h3 className="text-lg font-medium">Working Time</h3>
                    <p className="text-gray-600">Monday-Friday: 9:00 - 22:00</p>
                    <p className="text-gray-600">Saturday-Sunday: 9:00 - 21:00</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;