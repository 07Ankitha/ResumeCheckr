import { allTechnologies, technologySet } from '../utils/techStack';

interface TechAnalysisResult {
  matchScore: number;
  matchedTechnologies: string[];
  missingTechnologies: string[];
  extraTechnologies: string[];
  breakdown: Record<string, any>;
}

export class TechMatchAnalyzer {
  analyze(jobDescription: string, resumeText: string): TechAnalysisResult {
    const jdTechnologies = this.extractTechnologies(jobDescription);
    const resumeTechnologies = this.extractTechnologies(resumeText);

    const matchedTechnologies = Array.from(jdTechnologies).filter(tech => 
      resumeTechnologies.has(tech)
    );

    const missingTechnologies = Array.from(jdTechnologies).filter(tech => 
      !resumeTechnologies.has(tech)
    );

    const extraTechnologies = Array.from(resumeTechnologies).filter(tech => 
      !jdTechnologies.has(tech)
    );

    const matchScore = jdTechnologies.size > 0 
      ? (matchedTechnologies.length / jdTechnologies.size) * 100 
      : 0;

    return {
      matchScore: Math.round(matchScore * 10) / 10,
      matchedTechnologies,
      missingTechnologies,
      extraTechnologies,
      breakdown: this.categorizeResults(jdTechnologies, resumeTechnologies)
    };
  }

  private extractTechnologies(text: string): Set<string> {
    const technologies = new Set<string>();
    const lowerText = text.toLowerCase();
    
    allTechnologies.forEach(tech => {
      if (lowerText.includes(tech.toLowerCase())) {
        technologies.add(tech);
      }
    });
    
    return technologies;
  }

  private categorizeResults(jdTechs: Set<string>, resumeTechs: Set<string>) {
    const breakdown: Record<string, any> = {};
    
    Object.entries(technologySet).forEach(([category, techs]) => {
      const requiredInJD = techs.filter(tech => jdTechs.has(tech));
      const matchedTechs = requiredInJD.filter(tech => resumeTechs.has(tech));
      
      if (requiredInJD.length > 0) {
        breakdown[category] = {
          required: requiredInJD,
          matched: matchedTechs,
          missing: requiredInJD.filter(tech => !resumeTechs.has(tech))
        };
      }
    });

    return breakdown;
  }
} 