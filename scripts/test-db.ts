import { createUser, createLinkedInProfile, createResume, createAnalysis } from '../lib/db';

async function testDatabase() {
  try {
    // Create a test user
    const user = await createUser('test@example.com', 'password123', 'Test User');
    console.log('Created user:', user);

    // Create a LinkedIn profile for the user
    const linkedinProfile = await createLinkedInProfile(
      user.id,
      'https://linkedin.com/in/testuser',
      'Software Developer',
      'Experienced developer with passion for technology',
      JSON.stringify([{ company: 'Tech Corp', role: 'Developer' }]),
      JSON.stringify([{ school: 'University', degree: 'Computer Science' }]),
      ['JavaScript', 'TypeScript', 'React']
    );
    console.log('Created LinkedIn profile:', linkedinProfile);

    // Create a resume for the user
    const resume = await createResume(
      user.id,
      'My Resume',
      'Professional resume content here...',
      'resume.pdf'
    );
    console.log('Created resume:', resume);

    // Create analysis for the resume
    const analysis = await createAnalysis({
      resumeId: resume.id,
      score: 85,
      strengths: ['Strong technical skills', 'Good communication'],
      weaknesses: ['Could improve leadership experience'],
      recommendations: ['Add more project details', 'Highlight achievements']
    });
    console.log('Created analysis:', analysis);

    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Error testing database:', error);
  }
}

testDatabase(); 