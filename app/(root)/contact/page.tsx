import GroupComponent7 from "@/components/ui/Services";
import type { Metadata } from 'next';
import { Clock, Locate, Mail, Phone } from "lucide-react";
import FadeInOnView from "@/components/FadeInView";
import Banner from "@/components/ui/Banner";

export const metadata: Metadata = {
    title: "Borcelle | Contact",
    description: "Contact Us 24/7",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true
        }
    },
    openGraph: {
        title: "Borcelle | Contact",
        description: "Contact Us 24/7",
        url: `${process.env.ECOM_STORE_URL}/contact`,
        images: [
            {
                url: '/contact.webp',
                width: 220,
                height: 250,
                alt: 'Contact preview image',
            },
        ],
        siteName: 'Borcelle',
    },
};
export const dynamic = 'force-static';
const Contact = () => {
    return (
        <>
            <div className="w-full mt-[4rem] sm:mt-12 bg-white overflow-hidden text-left text-black font-sans">
                <Banner
                    imgUrl={'/blog5.webp'}
                    imageContent={{
                        heading: 'Get In Touch With Us',
                        text: 'Our staff is always here to help you out.',
                        textColor: 'white',
                        link: "#form",
                        buttonText: 'Contact Us',
                    }}
                    shade={{ color: 'gray' }}
                />
                <div className="flex flex-col items-center py-16 px-4">
                    <FadeInOnView>

                        <h1 className="text-heading2-bold text-center">Get In Touch With Us</h1>
                    </FadeInOnView>
                    <FadeInOnView delay={300} animation="animate-fadeIn" threshold={0.7}>
                        <p className="text-center text-gray-500 mt-4 mb-8 max-w-xl">
                            For more information about our products & services, please feel free
                            to drop us an email. Our staff is always here to help you out. Do not
                            hesitate!
                        </p>
                    </FadeInOnView>

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

                <Locate className="w-8 h-8" />
                <div>
                    <h3 className="text-lg font-medium">Address</h3>
                    <p className="text-gray-600">
                        236 5th SE Avenue, New York NY10000, United States
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Phone className="w-8 h-8" />
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
                <Clock className="w-8 h-8" />
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