"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { categorizeSkills } from "@/app/utils/skillCategorizer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "@/app/components/ResumePdf";

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-lg font-semibold text-purple-700 mb-3 mt-4">{title}</h3>
);

export default function ResumePreview() {
  const { id } = useParams();
  const [resume, setResume] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch(`/api/get-resume/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        if (!data.data) throw new Error("No resume data found.");
        console.log("Fetched resume:", data.data);
        setResume(data.data);
      } catch (err: any) {
        console.error("Error fetching resume:", err);
        setError(err.message || "Unknown error");
      }
    }

    if (id) {
      console.log("ID from route:", id);
      fetchResume();
    }
  }, [id]);

  if (error)
    return (
      <div className="text-center py-10 text-red-600">❌ Error: {error}</div>
    );

  if (!resume)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  const skillSections = categorizeSkills(resume.skills || "");

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Resume Preview</h1>

          <div className="inline-block">
            <PDFDownloadLink
              document={<ResumePDF resume={resume} />}
              fileName={`${resume.fullName}_resume.pdf`}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-md shadow-sm transition-all text-sm cursor-pointer select-none"
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
          </div>
        </div>

        <div
          id="resume-preview"
          className="bg-white rounded-md shadow text-gray-900 text-[11.5px] leading-tight mx-auto px-6 py-6"
          style={{
            width: "210mm",
            minHeight: "297mm",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div className="border-b pb-3 mb-3">
            <h2 className="text-2xl font-bold mb-1">{resume.fullName}</h2>

            <div className="flex flex-col sm:flex-row sm:justify-between">
              <p>
                <span className="font-medium text-blue-700">GitHub:</span>{" "}
                {resume.github || "N/A"}
              </p>
              <p>
                <span className="font-medium text-blue-700">Email:</span>{" "}
                {resume.email || "N/A"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between mt-1">
              <p>
                <span className="font-medium text-blue-700">LinkedIn:</span>{" "}
                {resume.linkedin || "N/A"}
              </p>
              <p>
                <span className="font-medium text-blue-700">Phone:</span>{" "}
                {resume.phone || "N/A"}
              </p>
            </div>

            {resume.portfolio && (
              <p className="mt-1">
                <span className="font-medium text-blue-700">Portfolio:</span>{" "}
                {resume.portfolio}
              </p>
            )}

            {resume.location && (
              <p className="text-gray-500 italic mt-1">{resume.location}</p>
            )}
          </div>

          {/* Education */}
          {resume.education?.length > 0 && (
            <div className="border-b pb-3 mb-3">
              <SectionTitle title="EDUCATION" />
              {resume.education.map((edu: any, idx: number) => (
                <div key={idx} className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">
                      {edu.institution}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {edu.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{edu.degree}</span>
                    {edu.cgpa && (
                      <span className="text-gray-700 font-medium text-sm">
                        CGPA: {edu.cgpa}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {Object.keys(skillSections).length > 0 && (
            <div className="border-b pb-3 mb-3">
              <SectionTitle title="SKILLS SUMMARY" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(skillSections).map(([category, skills]) => (
                  <p key={category} className="text-sm">
                    <strong className="text-sm">
                      {category
                        .replace(/([A-Z])/g, " $1")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                      :
                    </strong>{" "}
                    {skills.join(", ")}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resume.experience?.length > 0 && (
            <div className="border-b pb-3 mb-3">
              <SectionTitle title="WORK EXPERIENCE" />
              {resume.experience.map((exp: any, idx: number) => (
                <div key={idx} className="mt-2">
                  <div className="flex justify-between flex-wrap">
                    <p className="font-semibold text-[13px]">
                      {exp.role} | {exp.company}
                    </p>
                    <span className="text-gray-500 text-sm">
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="list-disc pl-5 mt-1 text-gray-700 leading-snug text-[12.5px]">
                    {exp.description?.map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resume.projects?.length > 0 && (
            <div className="border-b pb-3 mb-3">
              <SectionTitle title="PROJECTS" />
              {resume.projects.map((proj: any, idx: number) => (
                <div key={idx} className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[13px]">
                      {proj.title}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {proj.duration}
                    </span>
                  </div>
                  <ul className="list-disc ml-5 mt-1 text-gray-700 leading-snug text-[12.5px]">
                    {proj.description.map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {resume.certifications?.length > 0 && (
            <div>
              <SectionTitle title="CERTIFICATIONS" />
              <ul className="space-y-2">
                {resume.certifications.map((cert: any, idx: number) => (
                  <li key={idx}>
                    <p>
                      <strong className="text-[13px]">
                        {cert.name} ({cert.issuer})
                      </strong>{" "}
                      |{" "}
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-[13px]"
                      >
                        Link
                      </a>
                    </p>
                    <p className="ml-2 text-sm text-gray-700">
                      {cert.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
