// utils/skillCategorizer.ts

export const technologySet = {
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
  
  export function categorizeSkills(inputSkills: string) {
    const result: Record<string, string[]> = {};
  
    const allSkills = inputSkills
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
  
    for (const [category, keywords] of Object.entries(technologySet)) {
      result[category] = [];
      for (const skill of allSkills) {
        for (const keyword of keywords) {
          if (skill === keyword.toLowerCase()) {
            result[category].push(keyword);
            break;
          }
        }
      }
      if (result[category].length === 0) delete result[category];
    }
  
    return result;
  }
  