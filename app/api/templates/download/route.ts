import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { templateId } = await request.json();

    if (!templateId) {
      return new NextResponse('Template ID is required', { status: 400 });
    }

    // Get template details
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return new NextResponse('Template not found', { status: 404 });
    }

    // Check if template is premium and user is not logged in
    if (template.isPremium && !session?.user) {
      return new NextResponse('Premium templates require authentication', {
        status: 401,
      });
    }

    // Get request headers for IP and user agent
    const headersList = headers();
    const userAgent = headersList.get('user-agent');
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0] || headersList.get('x-real-ip');

    // Record the download
    await prisma.templateDownload.create({
      data: {
        templateId,
        userId: session?.user?.id,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording template download:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 