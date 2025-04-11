# ResumeCheckr 🧠📄  
**AI-Powered Resume Analysis Platform**

ResumeCheckr is a modern web app that helps users improve their resumes using AI. From analyzing content and format to suggesting professional templates, the platform is your smart resume companion to land better job opportunities.

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Heroicons  
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL  
- **Authentication**: NextAuth.js  
- **PDF Handling & AI**: React-PDF, PDF.js, Custom Scoring Algorithms  

---

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resumecheckr.git
   cd resumecheckr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/resumecheckr"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="your-email@gmail.com"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Visit `http://localhost:3000` to see the application

## 📸 Screenshots

### Home Page
![Home Page](public/screenshots/home.png)
*The landing page showcasing the main features and call-to-action*

### Features Page
![Features Page](public/screenshots/features.png)
*The page that shows the best features of this project*

### Resume Analysis With JD
![Resume Analysis With JD](public/screenshots/jdanalysis.png)
*Resume Analysis when a job description is given*

### General Resume Analysis
![General Resume Analysis](public/screenshots/generalanalysis.png)
*General Resume Analysis*

### Resume Creation
![Resume Creation](public/screenshots/create.png)
*Create the best resume using the best template*

### Resume Preview
![Resume Preview](public/screenshots/preview.png)
*The Preview of the Resume*

### Templates
![Templates](public/screenshots/templates.png)
*The templates page with categorized resume templates*

### Simple Pricing
![Simple Pricing](public/screenshots/pricing.png)
*Simple Pricing Section*

