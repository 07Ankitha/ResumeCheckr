import { NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import { createResumeAnalysis } from '../../../lib/db';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Set up the worker for server-side PDF parsing
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface ResumeAnalysis {
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
  experience: any[];
  education: any[];
  projects: any[];
  certifications: any[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  finalScore: number;
  wordCountScore: number;
  grammarErrors: number;
  grammarScore: number;
  missingSections: string[];
  sectionScores: Record<string, number>;
  sectionSuggestions: string[];
  missingFields: number;
  [key: string]: any; // Add index signature
}

export async function POST(request: Request) {
  try {
    console.log('Received resume analysis request');
    const session = await getServerSession(authOptions);
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file) {
      console.error('No file found in form data');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload a PDF file.',
        receivedType: file.type 
      }, { status: 400 });
    }

    let userId: string;

    if (session?.user?.id) {
      // Use authenticated user's ID
      userId = session.user.id;
    } else {
      // Create a temporary user for anonymous analysis
      const tempUser = await prisma.user.create({
        data: {
          email: `temp_${Date.now()}@example.com`,
          name: 'Anonymous User',
          password: 'temp_password', // This won't be used for login
          role: 'user'
        }
      });
      userId = tempUser.id;
    }

    // Create a Resume record first
    const resume = await prisma.resume.create({
      data: {
        userId,
        title: file.name,
        content: '', // We'll store the extracted text here
        fileUrl: file.name // Using filename as fileUrl for now
      }
    });

    console.log('Extracting text from PDF');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedTextArray: string[] = [];

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');  
      extractedTextArray.push(pageText);
    }
    
    console.log("Extracted text:", extractedTextArray);
    const extractedText = extractedTextArray.join('\n');

    // Update the resume with the extracted text
    await prisma.resume.update({
      where: { id: resume.id },
      data: { content: extractedText }
    });

    // Calculate word count
    const wordCount = extractedText.split(/\s+/).length;
    let finalScore = 100;

    // Word Count Score Calculation (20 marks total)
    let wordCountScore = 20;
    const maxWordCount = 450;
    const deductionPerWords = 22.5;

    if (wordCount < maxWordCount) {
      const pointsLost = Math.floor((maxWordCount - wordCount) / deductionPerWords);
      wordCountScore = Math.max(20 - pointsLost, 0);
    }

    console.log(`Word Count: ${wordCount}, Word Count Score: ${wordCountScore}/20`);
    finalScore -= (20 - wordCountScore);

    console.log('Performing resume analysis');
    const sectionNames = [
      "Education", "Work Experience", "Projects",
      "Technical Skills", "Certifications",
      "Achievements", "Extracurricular Activities", "Languages"
    ];

    function extractField(rawText: string, fieldName: string) {
      const regex = new RegExp(`${fieldName}:\\s*([^\n]+)`, "i");
      const match = rawText.match(regex);

      if (match && match[1]) {
        const value = match[1].trim();
        return sectionNames.includes(value) ? null : value;
      }
      return null;
    }

    const analysis: ResumeAnalysis = {
      personalInfo: {
        name: extractField(extractedText, "Name") || extractName(extractedText),
        email: extractField(extractedText, "Email") || extractEmail(extractedText),
        phone: extractField(extractedText, "Phone") || extractPhone(extractedText),
        location: extractField(extractedText, "Location") || extractLocation(extractedText),
        linkedin: extractField(extractedText, "LinkedIn") || extractLinkedIn(extractedText)
      },
      summary: extractSummary(extractedText),
      skills: {
        technical: extractTechnicalSkills(extractedText),
        soft: extractSoftSkills(extractedText)
      },
      experience: extractExperience(extractedText),
      education: extractEducation(extractedText),
      projects: extractProjects(extractedText),
      certifications: extractCertifications(extractedText),
      strengths: analyzeStrengths(extractedText),
      weaknesses: analyzeWeaknesses(extractedText),
      suggestions: generateSuggestions(extractedText, jobDescription),
      missingKeywords: jobDescription ? findMissingKeywords(extractedText, jobDescription) : [],
      finalScore,
      wordCountScore,
      grammarErrors: countGrammarErrors(extractedText),
      grammarScore: Math.max(10 - Math.floor(countGrammarErrors(extractedText) / 2), 0),
      missingSections: [],
      sectionScores: {},
      sectionSuggestions: [],
      missingFields: 0
    };

    // Check for missing fields and deduct points
    let missingFields = 0;

    // Check personalInfo fields
    Object.values(analysis.personalInfo).forEach(value => {
      if (!value || value.trim() === '') missingFields++;
    });

    // Check summary
    if (!analysis.summary || analysis.summary.trim() === '') missingFields++;

    // Check skills
    if (analysis.skills.technical.length === 0) missingFields++;
    if (analysis.skills.soft.length === 0) missingFields++;

    // Check experience
    if (analysis.experience.length === 0) missingFields++;
    else {
      analysis.experience.forEach(exp => {
        if (!exp.title || exp.title.trim() === '') missingFields++;
        if (!exp.company || exp.company.trim() === '') missingFields++;
        if (!exp.duration || exp.duration.trim() === '') missingFields++;
        if (exp.responsibilities.length === 0) missingFields++;
      });
    }

    // Check education
    if (analysis.education.length === 0) missingFields++;
    else {
      analysis.education.forEach(edu => {
        if (!edu.degree || edu.degree.trim() === '') missingFields++;
        if (!edu.university || edu.university.trim() === '') missingFields++;
        if (!edu.year || edu.year.trim() === '') missingFields++;
      });
    }

    // Check projects
    if (analysis.projects.length === 0) missingFields++;
    else {
      analysis.projects.forEach(project => {
        if (!project.name || project.name.trim() === '') missingFields++;
        if (!project.description || project.description.trim() === '') missingFields++;
        if (project.technologies.length === 0) missingFields++;
      });
    }

    // Check certifications
    if (analysis.certifications.length === 0) missingFields++;
    else {
      analysis.certifications.forEach(cert => {
        if (!cert.name || cert.name.trim() === '') missingFields++;
        if (!cert.issuer || cert.issuer.trim() === '') missingFields++;
        if (!cert.year || cert.year.trim() === '') missingFields++;
      });
    }

    // Calculate section-wise scores (out of 10)
    const sectionScores: Record<string, number> = {
      personalInfo: calculatePersonalInfoScore(analysis.personalInfo),
      summary: calculateSummaryScore(analysis.summary),
      skills: calculateSkillsScore(analysis.skills),
      experience: calculateExperienceScore(analysis.experience),
      education: calculateEducationScore(analysis.education),
      projects: calculateProjectsScore(analysis.projects),
      certifications: calculateCertificationsScore(analysis.certifications)
    };

    // Deduct points for missing fields
    finalScore -= (missingFields * 2);

    // Ensure finalScore doesn't go below 0
    finalScore = Math.max(0, finalScore);

    console.log(`Final Score after field validation: ${finalScore}/100`);
    console.log(`Missing fields: ${missingFields}`);
    console.log("Section-wise Scores:", sectionScores);

    // Grammar Errors Scoring (10 marks total)
    const grammarErrors = countGrammarErrors(extractedText);
    const grammarScore = Math.max(10 - Math.floor(grammarErrors / 2), 0);

    console.log(`Grammar Errors: ${grammarErrors}, Grammar Score: ${grammarScore}/10`);
    finalScore -= (10 - grammarScore);

    console.log(`Updated Final Score after Grammar Check: ${finalScore}/100`);

    // Save the analysis to the database
    const analysisData = {
      overallScore: analysis.finalScore,
      personalInfo: analysis.personalInfo,
      summary: analysis.summary,
      skills: analysis.skills,
      experience: analysis.experience,
      education: analysis.education,
      projects: analysis.projects,
      certifications: analysis.certifications,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      missingKeywords: analysis.missingKeywords,
    };

    // Create the resume analysis record
    const resumeAnalysis = await prisma.resumeAnalysis.create({
      data: {
        userId,
        resumeId: resume.id,
        score: analysisData.overallScore,
        personalInfo: analysis.personalInfo,
        summary: analysis.summary,
        skills: analysis.skills,
        experience: analysis.experience,
        education: analysis.education,
        projects: analysis.projects,
        certifications: analysis.certifications,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        grammarErrors: analysis.grammarErrors,
        grammarScore: analysis.grammarScore,
        wordCount: wordCount,
        wordCountScore: wordCountScore,
        missingFields: missingFields,
        sectionScores: sectionScores
      }
    });

    if (!resumeAnalysis) {
      throw new Error('Failed to create resume analysis record');
    }

    console.log('Analysis saved to database:', resumeAnalysis);

    const response = {
      message: 'Resume analysis completed successfully',
      analysis: {
        ...analysis,
        finalScore,
        wordCountScore,
        grammarErrors,
        grammarScore,
        missingFields,
        sectionScores
      },
      finalScore
    };

    console.log('Analysis completed successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for text extraction and analysis
function extractName(text: string): string {
  // Look for name patterns at the beginning of the text
  const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
  return nameMatch ? nameMatch[1] : '';
}

function extractEmail(text: string): string {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : '';
}

function extractPhone(text: string): string {
  const phoneMatch = text.match(/(?:\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/);
  return phoneMatch ? phoneMatch[0] : '';
}

function extractLocation(text: string): string {
  // Look for location patterns (city, state, country)
  const locationMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+[A-Z][a-z]+)*)/);
  return locationMatch ? locationMatch[1] : '';
}

function extractLinkedIn(text: string): string {
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/i);
  return linkedinMatch ? linkedinMatch[0] : '';
}

function extractSummary(text: string): string {
  // Look for a summary section
  const summaryMatch = text.match(/summary:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/i);
  return summaryMatch ? summaryMatch[1].trim() : '';
}

function extractTechnicalSkills(text: string): string[] {
  // Look for technical skills section
  const skillsMatch = text.match(/technical\s+skills:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/i);
  if (!skillsMatch) return [];
  
  return skillsMatch[1]
    .split(/[,•]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
}

function extractSoftSkills(text: string): string[] {
  // Look for soft skills section
  const skillsMatch = text.match(/soft\s+skills:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/i);
  if (!skillsMatch) return [];
  
  return skillsMatch[1]
    .split(/[,•]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
}

function extractExperience(text: string): any[] {
  // Look for experience section
  const experienceMatch = text.match(/experience:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/i);
  if (!experienceMatch) return [];

  return experienceMatch[1]
    .split(/\n(?=[A-Z])/)
    .map(exp => {
      const titleMatch = exp.match(/^([A-Z][a-zA-Z\s]+)/);
      const companyMatch = exp.match(/at\s+([A-Z][a-zA-Z\s]+)/i);
      const durationMatch = exp.match(/(\d{4}\s*-\s*(?:present|\d{4}))/i);
      
      return {
        title: titleMatch ? titleMatch[1] : '',
        company: companyMatch ? companyMatch[1] : '',
        duration: durationMatch ? durationMatch[1] : '',
        responsibilities: extractResponsibilities(exp)
      };
    });
}

function extractResponsibilities(text: string): string[] {
  return text
    .split(/\n/)
    .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
    .map(line => line.replace(/^[•-]\s*/, '').trim());
}

function extractEducation(text: string): any[] {
  // Look for education section
  const educationMatch = text.match(/education:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/i);
  if (!educationMatch) return [];

  return educationMatch[1]
    .split(/\n(?=[A-Z])/)
    .map(edu => {
      const degreeMatch = edu.match(/^([A-Z][a-zA-Z\s]+)/);
      const universityMatch = edu.match(/at\s+([A-Z][a-zA-Z\s]+)/i);
      const yearMatch = edu.match(/(\d{4})/);
      
      return {
        degree: degreeMatch ? degreeMatch[1] : '',
        university: universityMatch ? universityMatch[1] : '',
        year: yearMatch ? yearMatch[1] : ''
      };
    });
}

function extractProjects(text: string): any[] {
  // Look for projects section
  const projectsMatch = text.match(/projects:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/i);
  if (!projectsMatch) return [];

  return projectsMatch[1]
    .split(/\n(?=[A-Z])/)
    .map(project => {
      const nameMatch = project.match(/^([A-Z][a-zA-Z\s]+)/);
      const descriptionMatch = project.match(/(?:description:?\s*)(.*?)(?=\n|$)/i);
      const techMatch = project.match(/(?:technologies:?\s*)(.*?)(?=\n|$)/i);
      
      return {
        name: nameMatch ? nameMatch[1] : '',
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        technologies: techMatch ? techMatch[1].split(',').map(t => t.trim()) : []
      };
    });
}

function extractCertifications(text: string): any[] {
  // Look for certifications section
  const certsMatch = text.match(/certifications:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/i);
  if (!certsMatch) return [];

  return certsMatch[1]
    .split(/\n(?=[A-Z])/)
    .map(cert => {
      const nameMatch = cert.match(/^([A-Z][a-zA-Z\s]+)/);
      const issuerMatch = cert.match(/from\s+([A-Z][a-zA-Z\s]+)/i);
      const yearMatch = cert.match(/(\d{4})/);
      
      return {
        name: nameMatch ? nameMatch[1] : '',
        issuer: issuerMatch ? issuerMatch[1] : '',
        year: yearMatch ? yearMatch[1] : ''
      };
    });
}

function analyzeStrengths(text: string): string[] {
  const strengths = [];
  
  // Check for strong technical skills
  if (extractTechnicalSkills(text).length > 5) {
    strengths.push('Strong technical skillset');
  }
  
  // Check for relevant experience
  if (extractExperience(text).length > 2) {
    strengths.push('Significant work experience');
  }
  
  // Check for education
  if (extractEducation(text).length > 0) {
    strengths.push('Strong educational background');
  }
  
  return strengths;
}

function analyzeWeaknesses(text: string): string[] {
  const weaknesses = [];
  
  // Check for missing technical skills
  if (extractTechnicalSkills(text).length < 3) {
    weaknesses.push('Limited technical skills listed');
  }
  
  // Check for missing experience
  if (extractExperience(text).length < 1) {
    weaknesses.push('No work experience listed');
  }
  
  // Check for missing education
  if (extractEducation(text).length === 0) {
    weaknesses.push('No education information provided');
  }
  
  return weaknesses;
}

function generateSuggestions(text: string, jobDescription: string = ''): string[] {
  const suggestions = [];
  
  // Add suggestions based on missing information
  if (extractTechnicalSkills(text).length < 3) {
    suggestions.push('Consider adding more technical skills relevant to the job');
  }
  
  if (extractExperience(text).length < 1) {
    suggestions.push('Include relevant work experience, even if it\'s from internships or projects');
  }
  
  if (extractEducation(text).length === 0) {
    suggestions.push('Add your educational background');
  }
  
  // Add job-specific suggestions if job description is provided
  if (jobDescription) {
    const missingKeywords = findMissingKeywords(text, jobDescription);
    if (missingKeywords.length > 0) {
      suggestions.push(`Consider highlighting experience with: ${missingKeywords.join(', ')}`);
    }
  }
  
  return suggestions;
}

function findMissingKeywords(text: string, jobDescription: string): string[] {
  const textWords = new Set(text.toLowerCase().split(/\W+/));
  const jobWords = new Set(jobDescription.toLowerCase().split(/\W+/));
  
  return Array.from(jobWords)
    .filter(word => word.length > 3 && !textWords.has(word))
    .slice(0, 5); // Limit to top 5 missing keywords
}

function countGrammarErrors(text: string): number {
  // Simple rule-based grammar error check (example: double spaces, missing periods)
  const grammarMistakes = (text.match(/\b(is|are|the)\s\s+/g) || []).length; // Detect double spaces after common words
  const missingPeriods = (text.match(/[^.!?]\s[A-Z]/g) || []).length; // Detect missing periods before capital letters
  
  return grammarMistakes + missingPeriods; // Total estimated errors
}

function calculatePersonalInfoScore(personalInfo: any): number {
  if (!personalInfo) return 0;
  const requiredFields = ['name', 'email', 'phone', 'location', 'linkedin'];
  const presentFields = requiredFields.filter(field => personalInfo[field] && personalInfo[field].trim() !== '');
  return Math.round((presentFields.length / requiredFields.length) * 10);
}

function calculateSummaryScore(summary: string): number {
  if (!summary || summary.trim() === '') return 0;
  if (summary.length < 50) return 5;
  if (summary.length < 100) return 7;
  return 10;
}

function calculateSkillsScore(skills: any): number {
  if (!skills) return 0;
  const technicalScore = skills.technical?.length > 0 ? 5 : 0;
  const softScore = skills.soft?.length > 0 ? 5 : 0;
  return technicalScore + softScore;
}

function calculateExperienceScore(experience: any[]): number {
  if (!experience || experience.length === 0) return 0;
  const totalScore = experience.reduce((acc, exp) => {
    let entryScore = 0;
    if (exp.title && exp.title.trim() !== '') entryScore += 2;
    if (exp.company && exp.company.trim() !== '') entryScore += 2;
    if (exp.duration && exp.duration.trim() !== '') entryScore += 2;
    if (exp.responsibilities && exp.responsibilities.length > 0) entryScore += 4;
    return acc + entryScore;
  }, 0);
  return Math.min(Math.round(totalScore / experience.length), 10);
}

function calculateEducationScore(education: any[]): number {
  if (!education || education.length === 0) return 0;
  const totalScore = education.reduce((acc, edu) => {
    let entryScore = 0;
    if (edu.degree && edu.degree.trim() !== '') entryScore += 3;
    if (edu.university && edu.university.trim() !== '') entryScore += 3;
    if (edu.year && edu.year.trim() !== '') entryScore += 4;
    return acc + entryScore;
  }, 0);
  return Math.min(Math.round(totalScore / education.length), 10);
}

function calculateProjectsScore(projects: any[]): number {
  if (!projects || projects.length === 0) return 0;
  const totalScore = projects.reduce((acc, project) => {
    let entryScore = 0;
    if (project.name && project.name.trim() !== '') entryScore += 3;
    if (project.description && project.description.trim() !== '') entryScore += 4;
    if (project.technologies && project.technologies.length > 0) entryScore += 3;
    return acc + entryScore;
  }, 0);
  return Math.min(Math.round(totalScore / projects.length), 10);
}

function calculateCertificationsScore(certifications: any[]): number {
  if (!certifications || certifications.length === 0) return 0;
  const totalScore = certifications.reduce((acc, cert) => {
    let entryScore = 0;
    if (cert.name && cert.name.trim() !== '') entryScore += 4;
    if (cert.issuer && cert.issuer.trim() !== '') entryScore += 3;
    if (cert.year && cert.year.trim() !== '') entryScore += 3;
    return acc + entryScore;
  }, 0);
  return Math.min(Math.round(totalScore / certifications.length), 10);
}
