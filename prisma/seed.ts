import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: "Professional Classic",
    category: "Professional",
    description: "A timeless design with clean typography and balanced spacing, perfect for corporate roles and traditional industries.",
    image: "/images/templates/template1.jpg",
    previewUrl: "/images/templates/template1.jpg",
    isPremium: false,
    features: [
      "ATS-optimized layout",
      "Professional typography",
      "Clear section hierarchy",
      "Skills matrix section",
      "Experience timeline"
    ]
  },
  {
    name: "Tech Focus",
    category: "Technical",
    description: "A data-driven design optimized for tech professionals, featuring project showcases and skill matrices.",
    image: "/images/templates/template3.png",
    previewUrl: "/images/templates/template3.png",
    isPremium: false,
    features: [
      "Project portfolio",
      "Technical skills matrix",
      "GitHub integration",
      "Certification showcase",
      "Code snippet highlights"
    ]
  },
  {
    name: "Academic Excellence",
    category: "Professional",
    description: "A sophisticated template designed for academic professionals and researchers, highlighting publications and research experience.",
    image: "/images/Academic excellance.webp",
    previewUrl: "/images/Academic excellance.webp",
    isPremium: false,
    features: [
      "Publication showcase",
      "Research experience",
      "Conference presentations",
      "Academic achievements",
      "Teaching experience"
    ]
  },
  {
    name: "Executive Summary",
    category: "Professional",
    description: "A high-impact template for senior professionals, emphasizing leadership and strategic achievements.",
    image: "/images/Executive summary.jpeg",
    previewUrl: "/images/Executive summary.jpeg",
    isPremium: false,
    features: [
      "Executive summary",
      "Leadership highlights",
      "Strategic initiatives",
      "Board experience",
      "Industry recognition"
    ]
  },
  {
    name: "Modern Minimal",
    category: "Creative",
    description: "A contemporary design with bold typography and strategic white space, ideal for creative professionals.",
    image: "/images/templates/template2.jpg",
    previewUrl: "/images/templates/template2.jpg",
    isPremium: true,
    features: [
      "Bold typography",
      "Visual hierarchy",
      "Portfolio showcase",
      "Custom color schemes",
      "Social media integration"
    ]
  },
  {
    name: "Creative Portfolio",
    category: "Creative",
    description: "A visually striking template with custom layouts and portfolio sections, perfect for designers and artists.",
    image: "/images/templates/template4.jpeg",
    previewUrl: "/images/templates/template4.jpeg",
    isPremium: true,
    features: [
      "Visual portfolio grid",
      "Custom color palettes",
      "Project case studies",
      "Client testimonials",
      "Creative process showcase"
    ]
  },
  {
    name: "Design Innovator",
    category: "Creative",
    description: "A cutting-edge template for design professionals, featuring innovative layouts and visual storytelling.",
    image: "/images/design innovator.jpeg",
    previewUrl: "/images/design innovator.jpeg",
    isPremium: true,
    features: [
      "Interactive elements",
      "Design process showcase",
      "Client work gallery",
      "Award highlights",
      "Creative methodology"
    ]
  },
  {
    name: "Digital Nomad",
    category: "Creative",
    description: "A modern template for remote workers and digital professionals, highlighting global experience and digital skills.",
    image: "/images/digital nomad.jpeg",
    previewUrl: "/images/digital nomad.jpeg",
    isPremium: true,
    features: [
      "Remote work experience",
      "Digital skills showcase",
      "Global projects",
      "Language proficiency",
      "Time zone flexibility"
    ]
  },
  {
    name: "Startup Visionary",
    category: "Technical",
    description: "A dynamic template for entrepreneurs and startup professionals, emphasizing innovation and business acumen.",
    image: "/images/Startup visionary.jpeg",
    previewUrl: "/images/Startup visionary.jpeg",
    isPremium: true,
    features: [
      "Startup experience",
      "Business metrics",
      "Innovation highlights",
      "Growth achievements",
      "Investor relations"
    ]
  },
  {
    name: "Data Science Pro",
    category: "Technical",
    description: "A specialized template for data scientists and analysts, showcasing technical expertise and data-driven achievements.",
    image: "/images/data science.jpeg",
    previewUrl: "/images/data science.jpeg",
    isPremium: true,
    features: [
      "Data visualization",
      "Technical skills matrix",
      "Project impact metrics",
      "Research methodology",
      "Tool proficiency"
    ]
  }
];

async function main() {
  console.log('Start seeding...');

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 