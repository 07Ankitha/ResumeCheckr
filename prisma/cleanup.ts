import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  try {
    // Get all templates
    const templates = await prisma.template.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group templates by name
    const groupedTemplates = templates.reduce((acc, template) => {
      if (!acc[template.name]) {
        acc[template.name] = [];
      }
      acc[template.name].push(template);
      return acc;
    }, {} as Record<string, any[]>);

    // Delete duplicates, keeping the oldest one
    for (const [name, duplicates] of Object.entries(groupedTemplates)) {
      if (duplicates.length > 1) {
        console.log(`Found ${duplicates.length} duplicates for template: ${name}`);
        // Keep the first (oldest) template, delete the rest
        const [keep, ...toDelete] = duplicates;
        for (const template of toDelete) {
          // First delete all downloads for this template
          await prisma.templateDownload.deleteMany({
            where: { templateId: template.id },
          });
          
          // Then delete the template
          await prisma.template.delete({
            where: { id: template.id },
          });
          console.log(`Deleted duplicate template: ${template.name} (ID: ${template.id})`);
        }
      }
    }

    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates(); 