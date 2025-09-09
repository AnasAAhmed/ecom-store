import React from 'react'
import FadeInOnView from '../FadeInView'
import Image from 'next/image'

const StoreFeatures = () => {
    return (
        <section className="relative my-10 bg-[#f9f9f9] text-gray-900 px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6">
                <FadeInOnView delay={100} animation="animate-fadeInUp">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Crafted by Anas Ahmed
                    </h1>
                </FadeInOnView>
                <FadeInOnView delay={200} threshold={0.4} animation="animate-fadeInUp">
                    <p className="text-lg text-gray-700">
                        Explore a range of freelance services—from fully responsive web apps to blazing-fast backend logic.
                    </p>
                </FadeInOnView>
                <FadeInOnView delay={400} threshold={0.5} animation="animate-fadeIn">
                    <p className="text-base text-gray-600">
                        ✨ Full-stack Web Development • SEO Optimization & Best Practices • Fast Page Loads with Optimized DB Queries • Custom Admin Dashboards & API Integrations
                    </p>
                </FadeInOnView>
                <FadeInOnView delay={200} threshold={0.4} animation="animate-fadeInUp">

                    <a
                        target="_blank"
                        title="Hire me"
                        href="https://www.fiverr.com/anas_ahmed_24"
                        className="inline-block bg-black text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Hire Me on Fiverr
                    </a>
                </FadeInOnView>

                <FadeInOnView delay={400} threshold={0.5} animation="animate-fadeIn">

                    <p className="text-base text-gray-600">
                        ✨ Dynamic SEO • Fast Page Loads • Scalable Architecture • Optimized Search Logic
                    </p>
                </FadeInOnView>

                <FadeInOnView delay={500} threshold={0.5} animation="animate-fadeInUp">

                    <p className="text-sm text-gray-500 pt-s">
                        🛠️ Tech Stack: Next.js • React • TypeScript • Tailwind CSS • Node.js • MongoDB • NextAuth v5
                    </p>
                </FadeInOnView>
                <FadeInOnView delay={600} threshold={0.6} animation="animate-fadeIn">
                    <a
                        target="_blank"
                        title="Get yours too"
                        href="https://www.fiverr.com/anas_ahmed_24/create-ecommerce-store-with-nextjs-and-mongodb-database"
                        className="inline-block bg-black text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Get Your Store
                    </a>
                </FadeInOnView>
            </div>

            <FadeInOnView delay={700} threshold={0.9} animation="animate-fadeInUp">
                <a
                    target="_blank"
                    title="Get yours too"
                    href="https://www.fiverr.com/anas_ahmed_24/create-ecommerce-store-with-nextjs-and-mongodb-database"
                    className="w-full md:w-1/2">
                    <Image
                        src="/promotion.png"
                        alt="Fashion Model"
                        width={600}
                        height={600}
                        className="rounded-2xl shadow-lg object-cover"
                    />
                </a>
            </FadeInOnView>
        </section>
    )
}

export default StoreFeatures
