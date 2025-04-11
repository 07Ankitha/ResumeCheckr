"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { ArrowDownTrayIcon, EyeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  previewUrl: string;
  isPremium: boolean;
  features: string[];
}

const categories = ["All", "Professional", "Creative", "Technical"];

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("free");
  const [isConverting, setIsConverting] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.templates);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setLoading(false);
    }
  };

  const handleDownload = async (template: Template) => {
    if (template.isPremium && (!session || !session.user)) {
      router.push("/pricing");
      return;
    }

    setDownloadingId(template.id);
    try {
      // Create a temporary container for the image
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      const img = document.createElement("img");
      img.src = template.image;
      img.crossOrigin = "anonymous";
      container.appendChild(img);
      document.body.appendChild(container);

      // Wait for image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Convert to canvas with higher quality
      const canvas = await html2canvas(img, {
        scale: 2,
        logging: true,
        useCORS: true,
      });

      // Create PDF with A4 dimensions (in mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to fit image within A4 size
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgHeight / imgWidth;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = pdfWidth * ratio;

      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      // Save PDF
      pdf.save(`${template.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);

      // Record download
      await fetch("/api/templates/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId: template.id }),
      });

      // Cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error("Error downloading template:", error);
      // Fallback to direct image download if PDF conversion fails
      const link = document.createElement("a");
      link.href = template.image;
      link.download = `${template.name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      link.click();
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredTemplates =
    selectedCategory === "All"
      ? templates.filter((template) =>
          activeTab === "free" ? !template.isPremium : template.isPremium
        )
      : templates.filter(
          (template) =>
            template.category === selectedCategory &&
            (activeTab === "free" ? !template.isPremium : template.isPremium)
        );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Professional Resume Templates
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose from our collection of professionally designed templates to
              create your perfect resume.
            </p>
          </div>

          {/* Template Type Tabs */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("free")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "free"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Free Templates
              </button>
              <button
                onClick={() => setActiveTab("premium")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "premium"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Premium Templates
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative bg-white rounded-lg shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-100"
              >
                {template.isPremium && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      Premium
                    </span>
                  </div>
                )}
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gray-100">
                  <div className="relative h-full w-full">
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {template.name}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 group-hover:bg-blue-100 transition-colors duration-300">
                      {template.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="mt-2">
                    <ul className="space-y-0.5">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-xs text-gray-600 group-hover:text-gray-900 transition-colors duration-300"
                        >
                          <svg
                            className="h-3 w-3 text-blue-500 mr-1 group-hover:text-blue-600 transition-colors duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    <button
                      onClick={() => handleDownload(template)}
                      className={`flex-1 inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-300 ${
                        template.isPremium
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          : "bg-blue-600 text-white hover:bg-blue-500 group-hover:bg-blue-700"
                      } ${
                        downloadingId === template.id
                          ? "opacity-75 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={downloadingId === template.id}
                    >
                      <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                      {downloadingId === template.id
                        ? "Converting..."
                        : template.isPremium
                        ? "Upgrade to Use"
                        : "Download PDF"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowPreview(true);
                      }}
                      className="inline-flex items-center justify-center rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-200 transition-colors duration-300 group-hover:bg-gray-300"
                    >
                      <EyeIcon className="h-3 w-3 mr-1" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTemplate.name}
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={selectedTemplate.previewUrl}
                  alt={selectedTemplate.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
