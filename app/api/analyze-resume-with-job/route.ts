import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import * as pdfjsLib from 'pdfjs-dist';

const prisma = new PrismaClient();

// Set up the worker for server-side PDF parsing
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Remove the config export as it's not needed in App Router
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export const runtime = 'nodejs';

// Define technology categories
const technologySet = {
  programmingLanguages: [
    "JavaScript", "Python", "Java", "C++", "TypeScript", "Ruby", "PHP", "Swift",
    "Go", "Rust", "Kotlin", "Scala", "C#", "Dart", "Perl", "Haskell", "Elixir", "R",
    "Objective-C", "Shell", "Lua", "MATLAB", "Julia", "VB.NET", "Groovy"
  ],

  frameworks: [
    "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring", "Express",
    "Svelte", "Next.js", "Nuxt.js", "NestJS", "FastAPI", "Ruby on Rails", "ASP.NET", 
    "Meteor", "Gatsby", "Remix", "Hapi.js", "Laravel", "Quasar", "Alpine.js", "Ember.js",
    "Symfony", "Backbone.js", "Phoenix", "Micronaut"
  ],

  databases: [
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "Oracle", "Redis",
    "Cassandra", "Firebase Realtime DB", "Firestore", "SQLite", "MariaDB",
    "CouchDB", "Neo4j", "DynamoDB", "InfluxDB", "Supabase", "DuckDB", "TimescaleDB",
    "ClickHouse", "GraphQL (Apollo/Hasura)", "RethinkDB"
  ],

  tools: [
    "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Jenkins", "Jira",
    "Terraform", "Ansible", "CircleCI", "Travis CI", "GitHub Actions", 
    "Vercel", "Netlify", "Postman", "Webpack", "Babel", "ESLint", 
    "Prettier", "Figma", "Grafana", "Prometheus", "Sentry", "New Relic", 
    "Logstash", "ElasticSearch", "Kibana", "Storybook", "Ngrok", "Zabbix", 
    "Cloudflare", "Nginx", "Apache", "PM2"
  ],

  cloudPlatforms: [
    "Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", 
    "IBM Cloud", "Oracle Cloud", "DigitalOcean", "Heroku", "Vercel", "Netlify",
    "Linode", "Render", "Cloudflare Pages"
  ],

  aiMlLibraries: [
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", "OpenCV",
    "XGBoost", "LightGBM", "spaCy", "NLTK", "Transformers (Hugging Face)", 
    "FastAI", "Matplotlib", "Seaborn", "LangChain", "OpenAI API", "LLaMA", 
    "YOLO", "Tesseract", "MediaPipe", "ONNX", "AutoML", "Stable Diffusion", "Diffusers"
  ],

  mobileTechnologies: [
    "Flutter", "React Native", "SwiftUI", "Kotlin Multiplatform", "Xamarin", 
    "Ionic", "Cordova", "Jetpack Compose", "Expo", "NativeScript"
  ],

  devOps: [
    "Docker", "Kubernetes", "Helm", "Terraform", "Ansible", "Puppet", 
    "Chef", "ArgoCD", "Prometheus", "Grafana", "ELK Stack", "New Relic",
    "Sentry", "Istio", "Linkerd", "Consul", "Vault", "OpenShift", "Nomad"
  ],

  testingLibraries: [
    "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Puppeteer", "Playwright",
    "JUnit", "TestNG", "RSpec", "NUnit", "Postman", "Supertest", "Vitest", 
    "Storybook", "Enzyme", "React Testing Library", "Detox", "Appium"
  ],

  cmsPlatforms: [
    "WordPress", "Drupal", "Joomla", "Ghost", "Strapi", "Sanity", 
    "Contentful", "Directus", "Netlify CMS", "Payload", "DatoCMS", "Forestry"
  ],

  apiTools: [
    "Postman", "Swagger", "Insomnia", "Apigee", "RapidAPI", "GraphQL", 
    "gRPC", "REST Assured", "OpenAPI", "Hoppscotch", "Hasura", "Redoc"
  ]
};


export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { error: 'Both resume and job description are required' },
        { status: 400 }
      );
    }

    let userId: string;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Create a temporary user for anonymous analysis
      const tempUser = await prisma.user.create({
        data: {
          email: `temp_${Date.now()}@example.com`,
          name: 'Anonymous User',
          password: 'temp_password',
          role: 'user'
        }
      });
      userId = tempUser.id;
    }

    // Extract text from PDF
    const arrayBuffer = await resumeFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      extractedText += pageText + '\n';
    }

    // Create a Resume record with extracted text
    const resume = await prisma.resume.create({
      data: {
        userId,
        title: resumeFile.name,
        fileUrl: resumeFile.name,
        content: extractedText // Store the extracted text instead of binary data
      }
    });

    const jdLower = jobDescription.toLowerCase();
    const resumeLower = extractedText.toLowerCase();

    // Process each category
    const breakdown: Record<string, any> = {};
    let totalMatched = 0;
    let totalRequired = 0;

    Object.entries(technologySet).forEach(([category, technologies]) => {
      const requiredInJD = technologies.filter(tech => 
        jdLower.includes(tech.toLowerCase())
      );

      if (requiredInJD.length > 0) {
        const matchedTechs = requiredInJD.filter(tech => 
          resumeLower.includes(tech.toLowerCase())
        );

        breakdown[category] = {
          required: requiredInJD,
          matched: matchedTechs,
          missing: requiredInJD.filter(tech => 
            !resumeLower.includes(tech.toLowerCase())
          )
        };

        totalMatched += matchedTechs.length;
        totalRequired += requiredInJD.length;
      }
    });

    // Calculate overall match score
    const matchScore = totalRequired > 0 
      ? (totalMatched / totalRequired) * 100 
      : 0;

    // Get all technologies as flat arrays
    const allTechnologies = Object.values(technologySet).flat();
    const matchedTech = allTechnologies.filter(tech => 
      jdLower.includes(tech.toLowerCase()) && 
      resumeLower.includes(tech.toLowerCase())
    );
    const requiredTech = allTechnologies.filter(tech => 
      jdLower.includes(tech.toLowerCase())
    );
    const extraTech = allTechnologies.filter(tech => 
      resumeLower.includes(tech.toLowerCase()) && 
      !jdLower.includes(tech.toLowerCase())
    );

    const resumeAnalysis = await prisma.resumeAnalysisWithJob.create({
      data: {
        userId,
        resumeId: resume.id,
        jobDescription,
        score: matchScore,
        techMatch: {
          score: matchScore,
          matched: matchedTech,
          missing: requiredTech.filter(tech => !matchedTech.includes(tech)),
          extra: extraTech
        },
        matchedSkills: matchedTech,
        missingSkills: requiredTech.filter(tech => !matchedTech.includes(tech)),
        extraSkills: extraTech,
        breakdown: breakdown
      }
    });

    return NextResponse.json({
      success: true,
      analysis: {
        techMatch: {
          score: Math.round(matchScore),
          matched: matchedTech,
          missing: requiredTech.filter(tech => !matchedTech.includes(tech)),
          extra: extraTech,
          breakdown: breakdown
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
} 