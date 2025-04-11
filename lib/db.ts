import { prisma } from './prisma';
import { hash } from 'bcryptjs';

// User operations
export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hash(password, 12);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Resume operations
export async function createResume(userId: string, title: string, content: string, fileUrl?: string) {
  return prisma.resume.create({
    data: {
      userId,
      title,
      content,
      fileUrl,
    },
  });
}

export async function getResumesByUserId(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    include: { analysis: true },
  });
}

// LinkedIn Profile operations
export async function createLinkedInProfile(
  userId: string,
  profileUrl: string,
  headline?: string,
  summary?: string,
  experience?: any,
  education?: any,
  skills: string[] = []
) {
  return prisma.linkedInProfile.create({
    data: {
      userId,
      profileUrl,
      headline,
      summary,
      experience,
      education,
      skills: JSON.stringify(skills),
    },
  });
}

export async function updateLinkedInProfile(
  userId: string,
  data: {
    headline?: string;
    summary?: string;
    experience?: any;
    education?: any;
    skills?: string[];
  }
) {
  const updateData = { ...data };
  if (data.skills) {
    updateData.skills = JSON.stringify(data.skills);
  }
  
  return prisma.linkedInProfile.update({
    where: { userId },
    data: updateData,
  });
}

// Analysis operations
export async function createAnalysis(
  data: {
    resumeId?: string;
    linkedinProfileId?: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }
) {
  return prisma.analysis.create({
    data: {
      ...data,
      strengths: JSON.stringify(data.strengths),
      weaknesses: JSON.stringify(data.weaknesses),
      recommendations: JSON.stringify(data.recommendations),
    },
  });
}

export async function getAnalysisByResumeId(resumeId: string) {
  const analysis = await prisma.analysis.findUnique({
    where: { resumeId },
  });
  
  if (analysis) {
    return {
      ...analysis,
      strengths: JSON.parse(analysis.strengths),
      weaknesses: JSON.parse(analysis.weaknesses),
      recommendations: JSON.parse(analysis.recommendations),
    };
  }
  
  return null;
}

export async function getAnalysisByLinkedInProfileId(linkedinProfileId: string) {
  const analysis = await prisma.analysis.findUnique({
    where: { linkedinProfileId },
  });
  
  if (analysis) {
    return {
      ...analysis,
      strengths: JSON.parse(analysis.strengths),
      weaknesses: JSON.parse(analysis.weaknesses),
      recommendations: JSON.parse(analysis.recommendations),
    };
  }
  
  return null;
}

// Subscription operations
export async function createSubscription(
  userId: string,
  plan: string,
  startDate: Date,
  endDate?: Date
) {
  return prisma.subscription.create({
    data: {
      userId,
      plan,
      status: 'active',
      startDate,
      endDate,
    },
  });
}

export async function updateSubscriptionStatus(
  userId: string,
  status: 'active' | 'cancelled' | 'expired',
  endDate?: Date
) {
  return prisma.subscription.update({
    where: { userId },
    data: {
      status,
      endDate,
    },
  });
}

// Resume Analysis operations
export async function createResumeAnalysis(
  userId: string,
  resumeId: string,
  data: {
    overallScore: number;
    personalInfo: any;
    summary?: string;
    skills: any;
    experience: any;
    education: any;
    projects: any;
    certifications: any;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    missingKeywords: string[];
  }
) {
  return prisma.resumeAnalysis.create({
    data: {
      userId,
      resumeId,
      ...data,
    },
  });
}

// Combined queries
export async function getUserWithProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      linkedInProfile: true,
      resumes: {
        include: {
          analysis: true,
        },
      },
    },
  });
} 