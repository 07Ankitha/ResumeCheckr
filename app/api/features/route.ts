import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is a mock response for the features API
    const features = {
      resumeAnalysis: {
        title: "Resume Analysis",
        description: "Get detailed insights about your resume's strengths and areas for improvement",
        features: [
          "Keyword optimization",
          "ATS compatibility check",
          "Format analysis",
          "Content quality assessment",
          "Skills gap analysis"
        ]
      },
      linkedinAnalysis: {
        title: "LinkedIn Profile Analysis",
        description: "Optimize your LinkedIn profile for better visibility and opportunities",
        features: [
          "Profile completeness check",
          "Keyword optimization",
          "Network analysis",
          "Content quality assessment",
          "Professional branding tips"
        ]
      }
    };

    return NextResponse.json(features);
  } catch (error) {
    console.error('Features API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 