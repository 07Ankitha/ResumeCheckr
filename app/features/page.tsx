"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { ArrowRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "Resume Analysis",
    description:
      "Upload your resume and get instant AI-powered feedback on content, formatting, and optimization suggestions.",
    icon: DocumentTextIcon,
    href: "/analyze-resume",
  },
];

export default function FeaturesPage() {
  const router = useRouter();

  useEffect(() => {
    // Call the features API when the page loads
    fetch("/api/features")
      .then((response) => response.json())
      .then((data) => {
        console.log("Features API Response:", data);
      })
      .catch((error) => {
        console.error("Error fetching features:", error);
      });
  }, []);

  const handleGetStarted = () => {
    router.push("/analyze-resume");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Powerful Features for Your Professional Growth
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our AI-powered platform provides comprehensive analysis and
              recommendations to help you optimize your professional presence.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="w-full rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-50 p-3">
                    <DocumentTextIcon
                      className="h-8 w-8 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    Resume Analysis
                  </h2>
                  <p className="mt-4 text-lg leading-7 text-gray-600">
                    Upload your resume and get instant AI-powered feedback on
                    content, formatting, and optimization suggestions.
                  </p>
                  <button
                    onClick={handleGetStarted}
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Get started
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="w-full rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-purple-50 p-3">
                    <DocumentTextIcon
                      className="h-8 w-8 text-purple-600"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    Create Resume
                  </h2>
                  <p className="mt-4 text-lg leading-7 text-gray-600">
                    Browse our collection of modern, ATS-friendly templates and
                    create a resume that gets you noticed.
                  </p>
                  <button
                    onClick={() => router.push("/create-resume")}
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                  >
                    Create Resume
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
