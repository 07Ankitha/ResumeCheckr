import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        image: true,
        previewUrl: true,
        isPremium: true,
        features: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      templates 
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
} 