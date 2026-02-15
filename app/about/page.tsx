import { CallButton, WhatsAppButton, InstagramButton } from "@/components/CTAButtons";
import { User, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "About Us - PG Like Home",
    description: "Learn about Raj Parvadiya and the vision behind PG Like Home in Memnagar.",
};

export default function About() {
    return (
        <div className="bg-brand-cream min-h-screen pb-20">
            <div className="bg-brand-teal text-white py-16">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        Driven by a passion for education and student welfare, creating a home away from home.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 mt-12 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* Bio Cards Column */}
                    <div className="w-full md:w-2/5 space-y-8 md:sticky md:top-24">
                        {/* Owner 1: Lalitbhai */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-brand-cream shadow-md">
                                <Image
                                    src="/images/owner-lalitbhai.jpg"
                                    alt="Lalitbhai Parvadiya"
                                    fill
                                    className="object-contain"
                                    sizes="128px"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Lalitbhai Parvadiya</h2>
                            <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mt-1">Owner & Founder</p>
                            <p className="text-sm font-medium text-slate-600 mt-2">News Reporter</p>
                        </div>

                        {/* Owner 2: Raj */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-brand-cream shadow-md">
                                <Image
                                    src="/images/owner.jpg"
                                    alt="Raj Parvadiya"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Raj Parvadiya</h2>
                            <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mt-1">Owner & Founder</p>
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                                <p className="font-medium">Science Teacher</p>
                                <p className="text-xs">BSc, BEd</p>
                            </div>
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="w-full md:w-3/5 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
                            <p className="text-slate-600 leading-relaxed">
                                "PG Like Home" was established with a simple yet powerful vision: to provide students and working professionals with accommodation that doesn't just feel like a hostel, but feels like a family. We understand that moving away from home is difficult, and our goal is to bridge that gap by offering care, comfort, and security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">The Story</h2>
                            <p className="text-slate-600 leading-relaxed">
                                As a teacher with years of experience guiding students, Mr. Raj Parvadiya saw firsthand the challenges students face when living away from home. Poor food quality, lack of cleanliness, and impersonal environments often distracted them from their studies and goals.
                            </p>
                            <p className="text-slate-600 leading-relaxed mt-4">
                                To solve this, he started PG Like Home. Not as a business, but as a service to the student community. Here, we prioritize <strong>pure, nutritious food</strong>, a <strong>hygienic environment</strong>, and a <strong>disciplined yet friendly atmosphere</strong> where students can thrive.
                            </p>
                        </section>

                        <section className="bg-brand-cream p-6 rounded-xl border border-brand-green/20">
                            <h3 className="text-lg font-semibold text-brand-teal mb-2">Why "Like Home"?</h3>
                            <ul className="list-disc list-inside space-y-2 text-slate-700">
                                <li>We celebrate festivals together like a family.</li>
                                <li>We care for you when you are sick.</li>
                                <li>We listen to your food preferences.</li>
                                <li>We provide a safe, secure environment for peace of mind.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            {/* Contact Section - Merged */}
            <div className="container mx-auto px-6 md:px-12 mt-8 border-t border-brand-dark/10 pt-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Get in Touch</h2>
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Details */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Address</h3>
                                    <p className="text-slate-600 mt-1">
                                        C7, 1st Floor, Nilmani Society,<br />

                                        Memnagar, Ahmedabad - 380052
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Email</h3>
                                    <a href="mailto:pglikehome1@gmail.com" className="text-slate-600 mt-1 hover:text-blue-600 block">
                                        pglikehome1@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 grid gap-4">
                            <CallButton size="lg" className="justify-center w-full" />
                            <WhatsAppButton size="lg" className="justify-center w-full" variant="secondary" />
                            <InstagramButton size="lg" className="justify-center w-full" />
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-slate-200 rounded-2xl overflow-hidden h-[450px] border border-slate-300 shadow-inner relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.2717290421306!2d72.52838387509269!3d23.050497479154185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85d70d2b8d5f%3A0xa073becfd75ae939!2sPg%20like%20home!5e0!3m2!1sen!2sin!4v1771012444714!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                        />
                        <div className="absolute bottom-6 left-6 right-6">
                            <a
                                href="https://maps.google.com/?q=PG+Like+Home+Memnagar+Ahmedabad"
                                target="_blank"
                                className="block w-full text-center bg-white/90 backdrop-blur text-slate-900 font-bold py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
