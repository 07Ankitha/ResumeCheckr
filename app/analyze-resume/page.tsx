"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import LowScorePopup from "../../components/LowScorePopup";

interface AnalysisResult {
  analysis: {
    finalScore: number;
    overallScore?: number;
    sectionScores: Record<string, number>;
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin: string;
    };
    summary: string;
    skills: {
      technical: string[];
      soft: string[];
    };
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      responsibilities: string[];
    }>;
    education: Array<{
      degree: string;
      university: string;
      year: string;
    }>;
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      year: string;
    }>;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    missingKeywords: string[];
  };
}

export default function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLowScorePopup, setShowLowScorePopup] = useState(false);
  const [hasSelectedOption, setHasSelectedOption] = useState(false);
  const [needsJobDescription, setNeedsJobDescription] = useState(false);
  const router = useRouter();

  const handleJobDescriptionChoice = (needsJD: boolean) => {
    setHasSelectedOption(true);
    setNeedsJobDescription(needsJD);
    if (needsJD) {
      router.push("/analyze-resume/with-job-description");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        !selectedFile.type.includes("pdf") &&
        !selectedFile.type.includes("docx")
      ) {
        setError("Please upload a PDF or DOCX file");
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
      console.log("response", response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);

      // Show popup if score is below 50
      if (data.analysis.finalScore < 50) {
        setShowLowScorePopup(true);
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setError(
        error instanceof Error ? error.message : "Error analyzing resume"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Resume Analysis
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Upload your resume to get AI-powered insights and recommendations
              for improvement.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
            {!hasSelectedOption ? (
              <div className="glass-effect p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-center mb-6">
                  Would you like to analyze your resume against a specific job
                  description?
                </h3>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleJobDescriptionChoice(true)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                  >
                    Yes, I have a job description
                  </button>
                  <button
                    onClick={() => handleJobDescriptionChoice(false)}
                    className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors"
                  >
                    No, analyze generally
                  </button>
                </div>
              </div>
            ) : !needsJobDescription ? (
              <form
                onSubmit={handleSubmit}
                className="glass-effect p-6 rounded-lg"
              >
                <div className="flex items-center gap-x-3 mb-6">
                  <ArrowUpTrayIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold leading-7 text-gray-900">
                    Upload Your Resume
                  </h3>
                </div>
                <p className="text-base leading-7 text-gray-600 mb-6">
                  Upload your resume in PDF or DOCX format for instant analysis
                  and optimization suggestions.
                </p>

                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <input
                      id="resume-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      disabled={isAnalyzing}
                    />
                    <div className="flex flex-col items-center text-gray-500">
                      <ArrowUpTrayIcon className="h-10 w-10 mb-2" />
                      <p className="text-sm font-medium">
                        Upload PDF (Max 5MB)
                      </p>
                    </div>
                  </label>
                </div>

                {error && (
                  <div className="mt-4 text-sm text-red-600">{error}</div>
                )}

                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={!file || isAnalyzing}
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                  </button>
                </div>
              </form>
            ) : null}

            {result && (
              <div className="mt-8 glass-effect p-6 rounded-lg">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">
                          {result.analysis.finalScore ??
                            result.analysis.overallScore ??
                            0}
                          %
                        </span>
                        <p className="text-white text-sm mt-1">Overall Score</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Section Scores
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(result.analysis.sectionScores).map(
                        ([section, score]) => (
                          <div
                            key={section}
                            className="bg-white p-4 rounded-lg shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-500 capitalize">
                                {section.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                              <span
                                className={`text-sm font-semibold ${
                                  score >= 5 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {score}/10
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  score >= 5 ? "bg-green-500" : "bg-red-500"
                                }`}
                                style={{ width: `${(score / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Quick Recommendations
                    </h4>
                    <div className="space-y-3">
                      {/* Section-specific recommendations for low scores */}
                      {Object.entries(result.analysis.sectionScores)
                        .filter(([_, score]) => score < 5)
                        .map(([section, score]) => (
                          <div
                            key={`section-${section}`}
                            className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border-l-4 border-red-500"
                          >
                            <span className="text-red-500">•</span>
                            <div>
                              <p className="text-gray-900 font-medium capitalize">
                                {section.replace(/([A-Z])/g, " $1").trim()} (
                                {score}/10)
                              </p>
                              <p className="text-gray-600">
                                {getSectionRecommendation(section)}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* General suggestions */}
                      {result.analysis.suggestions
                        .slice(0, 3)
                        .map((suggestion, index) => (
                          <div
                            key={`general-${index}`}
                            className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500"
                          >
                            <span className="text-blue-500">•</span>
                            <p className="text-gray-600">{suggestion}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LowScorePopup
        isOpen={showLowScorePopup}
        onClose={() => setShowLowScorePopup(false)}
      />
    </main>
  );
}

function getSectionRecommendation(section: string): string {
  const recommendations: Record<string, string> = {
    personalInfo:
      "Add missing contact information like name, email, phone, location, or LinkedIn profile.",
    summary:
      "Write a compelling summary that highlights your key skills and experience. Aim for 50-100 words.",
    skills:
      "Include both technical and soft skills relevant to your target role.",
    experience:
      "Add detailed work experience with company names, durations, and key responsibilities.",
    education:
      "Include your educational background with degree, institution, and graduation year.",
    projects:
      "Describe your projects with clear objectives, technologies used, and outcomes achieved.",
    certifications:
      "List relevant certifications with issuing organization and completion date.",
  };
  return (
    recommendations[section] ||
    "Improve this section to enhance your resume's impact."
  );
}
