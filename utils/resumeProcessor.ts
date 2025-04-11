import { TECHNOLOGY_SET } from './technologies';
import { extractTextFromPDF, extractTextFromDOCX } from './documentExtractor';
import { extractTechnologies, analyzeResume, calculateScores } from './analyzer';

export async function processResume(file: File) {
  // Extract text from the resume file
  const text = await extractTextFromDocument(file);
  
  // Analyze the resume text
  const analysis = await analyzeResume(text);
  
  return analysis;
}

export async function processResumeWithJob(file: File, jobDescription: string) {
  // Extract text from the resume file
  const resumeText = await extractTextFromDocument(file);
  
  // Extract technologies from both resume and job description
  const resumeTechnologies = extractTechnologies(resumeText, TECHNOLOGY_SET);
  const jobTechnologies = extractTechnologies(jobDescription, TECHNOLOGY_SET);

  // Calculate matches and scores
  const {
    matchedTechnologies,
    missingTechnologies,
    extraTechnologies,
    matchScore
  } = calculateTechnologyMatch(resumeTechnologies, jobTechnologies);

  // Get basic resume analysis
  const baseAnalysis = await analyzeResume(resumeText);

  // Combine the analyses
  return {
    ...baseAnalysis,
    jobMatch: {
      matchScore,
      matchedTechnologies,
      missingTechnologies,
      extraTechnologies,
    }
  };
}

async function extractTextFromDocument(file: File) {
  const fileType = file.type;
  if (fileType.includes('pdf')) {
    return await extractTextFromPDF(file);
  } else if (fileType.includes('docx')) {
    return await extractTextFromDOCX(file);
  }
  throw new Error('Unsupported file type');
}

function calculateTechnologyMatch(resumeTech: string[], jobTech: string[]) {
  const matchedTechnologies = resumeTech.filter(tech => jobTech.includes(tech));
  const missingTechnologies = jobTech.filter(tech => !resumeTech.includes(tech));
  const extraTechnologies = resumeTech.filter(tech => !jobTech.includes(tech));

  const matchScore = Math.round(
    (matchedTechnologies.length / jobTech.length) * 100
  );

  return {
    matchedTechnologies,
    missingTechnologies,
    extraTechnologies,
    matchScore
  };
} 