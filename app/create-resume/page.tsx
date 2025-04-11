"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
export default function CreateResumeForm() {
  const router = useRouter();

  const [showSecondExperience, setShowSecondExperience] = useState(false);
  const [showSecondProject, setShowSecondProject] = useState(false);
  const [showThirdCertification, setShowThirdCertification] = useState(false);
  const [showSecondEducation, setShowSecondEducation] = useState(false);
  const [showThirdEducation, setShowThirdEducation] = useState(false);

  const initialFormData = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    education: [
      { institution: "", degree: "", duration: "", cgpa: "" },
      { institution: "", degree: "", duration: "", cgpa: "" },
      { institution: "", degree: "", duration: "", cgpa: "" },
    ],
    skills: "",
    experience: [
      { role: "", company: "", duration: "", description: "" },
      { role: "", company: "", duration: "", description: "" },
    ],
    projects: [
      { title: "", duration: "", description: "" },
      { title: "", duration: "", description: "" },
    ],
    certifications: [
      { name: "", issuer: "", link: "", description: "" },
      { name: "", issuer: "", link: "", description: "" },
      { name: "", issuer: "", link: "", description: "" },
    ],
    github: "",
    linkedin: "",
    portfolio: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const match = name.match(/(\w+)\[(\d+)\]\.(\w+)/);
    if (match) {
      const [_, category, indexStr, field] = match;
      const index = parseInt(indexStr);
      setFormData((prev) => {
        const updated = [...(prev as any)[category]];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, [category]: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/save-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      router.push(`/preview-resume/${result.resume.id}`);
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      setFormData({ ...initialFormData });
      setShowSecondExperience(false);
      setShowSecondProject(false);
      setShowThirdCertification(false);
      setShowSecondEducation(false);
      setShowThirdEducation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <Navbar />
      <div className="pt-28 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            Build Your Resume
          </h1>
          <button
            type="button"
            onClick={handleClear}
            className="text-red-600 border border-red-600 px-4 py-1 rounded-md hover:bg-red-50 text-sm"
          >
            Clear All Fields
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 📘 Basic Info */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-700">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="fullName"
                value={formData.fullName}
                placeholder="Full Name"
                onChange={handleChange}
                className="input"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
                className="input"
                required
              />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                placeholder="Phone Number"
                onChange={handleChange}
                className="input"
              />
              <input
                name="location"
                value={formData.location}
                placeholder="Location"
                onChange={handleChange}
                className="input"
              />
            </div>
          </section>

          {/* 🎓 Education */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-700">
              Education
            </h2>
            {[
              0,
              showSecondEducation ? 1 : null,
              showThirdEducation ? 2 : null,
            ].map(
              (index) =>
                index !== null && (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
                  >
                    <input
                      name={`education[${index}].institution`}
                      value={formData.education[index]?.institution}
                      placeholder="Institution"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`education[${index}].degree`}
                      value={formData.education[index]?.degree}
                      placeholder="Degree"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`education[${index}].duration`}
                      value={formData.education[index]?.duration}
                      placeholder="Duration"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`education[${index}].cgpa`}
                      value={formData.education[index]?.cgpa}
                      placeholder="CGPA"
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                )
            )}
            {!showSecondEducation && (
              <button
                type="button"
                onClick={() => setShowSecondEducation(true)}
                className="text-blue-600 text-sm"
              >
                + Add another education
              </button>
            )}
            {showSecondEducation && !showThirdEducation && (
              <button
                type="button"
                onClick={() => setShowThirdEducation(true)}
                className="text-blue-600 text-sm mt-1"
              >
                + Add one more education
              </button>
            )}
          </section>

          {/* 🛠 Skills */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-700">
              Skills
            </h2>
            <textarea
              name="skills"
              value={formData.skills}
              placeholder="Comma separated"
              className="input"
              rows={3}
              onChange={handleChange}
            />
          </section>

          {/* 💼 Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-700">
              Work Experience
            </h2>
            {[0, showSecondExperience ? 1 : null].map(
              (index) =>
                index !== null && (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
                  >
                    <input
                      name={`experience[${index}].role`}
                      value={formData.experience[index].role}
                      placeholder="Role"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`experience[${index}].company`}
                      value={formData.experience[index].company}
                      placeholder="Company"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`experience[${index}].duration`}
                      value={formData.experience[index].duration}
                      placeholder="Duration"
                      onChange={handleChange}
                      className="input"
                    />
                    <textarea
                      name={`experience[${index}].description`}
                      value={formData.experience[index].description}
                      placeholder="Description (dot-separated)"
                      className="input col-span-2"
                      rows={3}
                      onChange={handleChange}
                    />
                  </div>
                )
            )}
            {!showSecondExperience && (
              <button
                type="button"
                onClick={() => setShowSecondExperience(true)}
                className="text-blue-600 text-sm"
              >
                + Add another experience
              </button>
            )}
          </section>

          {/* 🧪 Projects */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-700">
              Projects
            </h2>
            {[0, showSecondProject ? 1 : null].map(
              (index) =>
                index !== null && (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
                  >
                    <input
                      name={`projects[${index}].title`}
                      value={formData.projects[index].title}
                      placeholder="Project Title"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`projects[${index}].duration`}
                      value={formData.projects[index].duration}
                      placeholder="Duration"
                      onChange={handleChange}
                      className="input"
                    />
                    <textarea
                      name={`projects[${index}].description`}
                      value={formData.projects[index].description}
                      placeholder="Description (dot-separated)"
                      onChange={handleChange}
                      className="input col-span-2"
                      rows={3}
                    />
                  </div>
                )
            )}
            {!showSecondProject && (
              <button
                type="button"
                onClick={() => setShowSecondProject(true)}
                className="text-blue-600 text-sm"
              >
                + Add another project
              </button>
            )}
          </section>

          {/* 📜 Certifications */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-700">
              Certifications
            </h2>
            {[0, 1, showThirdCertification ? 2 : null].map(
              (index) =>
                index !== null && (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
                  >
                    <input
                      name={`certifications[${index}].name`}
                      value={formData.certifications[index].name}
                      placeholder="Certification Name"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`certifications[${index}].issuer`}
                      value={formData.certifications[index].issuer}
                      placeholder="Issued By"
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name={`certifications[${index}].link`}
                      value={formData.certifications[index].link}
                      placeholder="Certificate URL"
                      onChange={handleChange}
                      className="input"
                    />
                    <textarea
                      name={`certifications[${index}].description`}
                      value={formData.certifications[index].description}
                      placeholder="One-line description"
                      onChange={handleChange}
                      className="input col-span-2"
                      rows={2}
                    />
                  </div>
                )
            )}
            {!showThirdCertification && (
              <button
                type="button"
                onClick={() => setShowThirdCertification(true)}
                className="text-blue-600 text-sm"
              >
                + Add another certification
              </button>
            )}
          </section>

          {/* 🔗 Links */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-700">
              Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="github"
                value={formData.github}
                placeholder="GitHub"
                onChange={handleChange}
                className="input"
              />
              <input
                name="linkedin"
                value={formData.linkedin}
                placeholder="LinkedIn"
                onChange={handleChange}
                className="input"
              />
              <input
                name="portfolio"
                value={formData.portfolio}
                placeholder="Portfolio"
                onChange={handleChange}
                className="input"
              />
            </div>
          </section>

          {/* Submit */}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-300"
            >
              Generate Resume
            </button>
          </div>
        </form>
      </div>
      

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s ease-in-out;
        }
        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
    </div>
    
  );
}
