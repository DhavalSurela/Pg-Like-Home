import { CallButton } from "@/components/CTAButtons";
import { User } from "lucide-react";

export const metadata = {
    title: "About Us - PG Like Home",
    description: "Learn about Raj Parvadiya and the vision behind PG Like Home in Memnagar.",
};

export default function About() {
    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        Driven by a passion for education and student welfare, creating a home away from home.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 max-w-4xl">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* Bio Card */}
                    <div className="w-full md:w-1/3 bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center sticky top-24">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <User className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Raj Parvadiya</h2>
                        <p className="text-sm font-medium text-blue-600 mt-1">Owner & Founder</p>
                        <div className="mt-4 text-sm text-slate-600 space-y-2">
                            <p>Science Teacher</p>
                            <p>BSc, BEd</p>
                        </div>
                        <div className="mt-8">
                            <CallButton className="w-full justify-center" />
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="w-full md:w-2/3 space-y-8">
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

                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Why "Like Home"?</h3>
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
        </div>
    );
}
