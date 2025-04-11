import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      education,
      skills,
      experience,
      certifications,
      projects,
      linkedin,
      github,
      portfolio,
      location,
    } = body;

    // Converts array or comma-separated string to array
    const toArray = (input: string | string[], delimiter: string) => {
      if (Array.isArray(input)) return input;
      return input
        ?.split(delimiter)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    // Converts array to string (used for skills, certifications)
    const toString = (input: string | string[], delimiter: string) => {
      if (typeof input === 'string') return input;
      return input?.join(delimiter);
    };

    // Format and limit experience descriptions
    const formattedExperience = experience.map((exp: any) => ({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      description: exp.description
        ?.split('.')
        .map((point: string) => point.trim())
        .filter((point: string) => point.length > 0)
        .slice(0, 3)
        .map((point: string) => point + '.'),
    }));

    // Format and limit project descriptions
    const formattedProjects = projects.map((proj: any) => ({
      title: proj.title,
      duration: proj.duration,
      description: proj.description
        ?.split('.')
        .map((point: string) => point.trim())
        .filter((point: string) => point.length > 0)
        .slice(0, 3)
        .map((point: string) => point + '.'),
    }));

    const saved = await prisma.createresume.create({
      data: {
        fullName,
        email,
        phone,
        location,
        education, // structured object array
        skills: toString(skills, ', '), // string
        experience: formattedExperience,
        projects: formattedProjects,
        certifications: certifications
      .filter((cert: any) => cert.name || cert.issuer || cert.link || cert.description)
      .map((cert: any) => ({
        ...cert,
        description: cert.description?.trim(),
        link: cert.link?.trim(),
      })), // string with line breaks
        linkedin,
        github,
        portfolio,
      },
    });

    return NextResponse.json({ success: true, resume: saved });
  } catch (error: any) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
