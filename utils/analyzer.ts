import { TECHNOLOGY_SET } from './technologies';

export function extractTechnologies(text: string, techSet: Set<string>): string[] {
  const words = text.split(/\s+/);
  const technologies = new Set<string>();

  for (const word of words) {
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    if (techSet.has(cleanWord)) {
      technologies.add(cleanWord);
    }
  }

  return Array.from(technologies);
}

export async function analyzeResume(text: string) {
  // Basic analysis implementation
  return {
    finalScore: 75,
    sectionScores: {
      personalInfo: 8,
      summary: 7,
      skills: 8,
      experience: 7,
      education: 8,
      projects: 7,
      certifications: 6,
    },
    personalInfo: {
      name: "Example Name",
      email: "example@email.com",
      phone: "123-456-7890",
      location: "City, Country",
      linkedin: "linkedin.com/in/example",
    },
    summary: "Example summary",
    skills: {
      technical: [],
      soft: [],
    },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    strengths: [],
    weaknesses: [],
    suggestions: [],
    missingKeywords: [],
  };
}

export function calculateScores(text: string) {
  // Implement scoring logic here
  return {
    finalScore: 75,
    sectionScores: {
      // ... section scores
    }
  };
} 