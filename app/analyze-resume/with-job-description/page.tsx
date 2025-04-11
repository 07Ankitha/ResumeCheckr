"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import LowScorePopup from "../../../components/LowScorePopup";

export default function ResumeAnalysisWithJob() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [showLowScorePopup, setShowLowScorePopup] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        !selectedFile.type.includes("pdf") &&
        !selectedFile.type.includes("docx")
      ) {
        setError("Please upload a PDF or DOCX file");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription.trim());

      const response = await fetch("/api/analyze-resume-with-job", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);

      if (data.analysis.techMatch.score < 50) {
        setShowLowScorePopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to analyze resume"
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
              Resume Analysis with Job Description
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Upload your resume and paste the job description to get targeted
              recommendations.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
            <form
              onSubmit={handleSubmit}
              className="glass-effect p-6 rounded-lg space-y-6"
            >
              {/* Job Description Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Paste the job description here..."
                  disabled={isAnalyzing}
                />
              </div>

              {/* Resume Upload Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Upload Your Resume
                </h3>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                      <ArrowUpTrayIcon className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">
                        Upload PDF (Max 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || !file || !jobDescription.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </button>
              </div>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Match Score</h3>
                    <p className="text-4xl font-bold text-blue-600">
                      {result.analysis.techMatch.score}%
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">
                        Matched Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.techMatch.matched.map(
                          (tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-700 mb-2">
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.techMatch.missing.map(
                          (tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Additional Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.techMatch.extra.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">
                      Detailed Breakdown
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(result.analysis.techMatch.breakdown).map(
                        ([category, data]: [string, any]) => (
                          <div
                            key={category}
                            className="bg-white p-4 rounded-lg shadow-sm"
                          >
                            <h4 className="font-semibold mb-2 capitalize">
                              {category.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Required
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {data.required.map((tech: string) => (
                                    <span
                                      key={tech}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Matched
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {data.matched.map((tech: string) => (
                                    <span
                                      key={tech}
                                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Missing
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {data.missing.map((tech: string) => (
                                    <span
                                      key={tech}
                                      className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
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

// Add this component for displaying tech analysis results
function TechMatchResults({ techMatch }: { techMatch: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Technology Match Score</h3>
        <div className="inline-block bg-blue-100 rounded-full px-6 py-3">
          <span className="text-3xl font-bold text-blue-600">
            {techMatch.score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Matched Technologies */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-700 mb-2">
            Matched Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {techMatch.matched.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Technologies */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-700 mb-2">
            Missing Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {techMatch.missing.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Technologies */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">
            Additional Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {techMatch.extra.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Detailed Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(techMatch.breakdown).map(
            ([category, data]: [string, any]) => (
              <div key={category} className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2 capitalize">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Required</p>
                    <div className="flex flex-wrap gap-1">
                      {data.required.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Matched</p>
                    <div className="flex flex-wrap gap-1">
                      {data.matched.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Missing</p>
                    <div className="flex flex-wrap gap-1">
                      {data.missing.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
