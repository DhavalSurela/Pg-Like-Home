import { CallButton, WhatsAppButton } from "@/components/CTAButtons";
import { Mail, MapPin } from "lucide-react";

export const metadata = {
    title: "Contact Us - PG Like Home",
    description: "Get in touch with PG Like Home. Call, WhatsApp or visit us in Memnagar, Ahmedabad.",
};

export default function Contact() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        We are always happy to answer your queries. Reach out to us anytime.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Details */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Address</h3>
                                    <p className="text-slate-600 mt-1">
                                        C7, 1st Floor, Nilmani Society,<br />
                                        Beside Sterling Hospital,<br />
                                        Memnagar, Ahmedabad - 380052
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                    <Mail className="w-6 h-6" />
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
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-slate-200 rounded-2xl overflow-hidden h-[500px] border border-slate-300 shadow-inner relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.581961477169!2d72.529367!3d23.041627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84c70d462159%3A0xf69d72224773e34a!2sSterling%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
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
