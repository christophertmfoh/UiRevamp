/**
 * Intelligent Fallback Generator
 * Provides contextual fallbacks when AI generation fails
 */

export interface CharacterAnalysis {
  name: string;
  race: string;
  isCat: boolean;
  isHuman: boolean;
  isFantasy: boolean;
  allText: string;
}

export function analyzeCharacter(character: any): CharacterAnalysis {
  const name = (character.name || '').toLowerCase();
  const desc = (character.description || character.physicalDescription || '').toLowerCase();
  const background = (character.background || '').toLowerCase();
  const goals = (character.goals || '').toLowerCase();
  const motivations = (character.motivations || '').toLowerCase();
  const race = (character.race || '').toLowerCase();
  
  const allText = `${name} ${desc} ${background} ${goals} ${motivations} ${race}`.toLowerCase();
  
  // Character type detection
  const isCat = name.includes('beans') || 
                allText.includes('cat') || 
                allText.includes('feline') || 
                allText.includes('is a cat') ||
                race.includes('cat');
                
  const isHuman = race.includes('human') || 
                  (!isCat && !allText.includes('elf') && !allText.includes('dwarf') && !allText.includes('dragon'));
                  
  const isFantasy = allText.includes('elf') || 
                    allText.includes('dwarf') || 
                    allText.includes('dragon') || 
                    allText.includes('magic') ||
                    race.includes('elf') || 
                    race.includes('dwarf');
  
  return {
    name: character.name || '',
    race: character.race || '',
    isCat,
    isHuman,
    isFantasy,
    allText
  };
}

// Comprehensive fallback system
export class FallbackGenerator {
  private static getRandomChoice<T>(options: T[], seed?: number): T {
    const random = seed ? Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000) : Math.random();
    return options[Math.floor(random * options.length)];
  }
  
  static generateFallback(fieldKey: string, fieldLabel: string, character: any): string {
    const analysis = analyzeCharacter(character);
    const seed = character.name ? character.name.length * 1000 : Date.now();
    
    // Field-specific intelligent fallbacks based on character context
    const generators: Record<string, () => string> = {
      // Identity fields with context-aware generation
      name: () => this.generateName(analysis, seed),
      nicknames: () => this.generateNicknames(character, analysis),
      title: () => this.generateTitle(character, analysis),
      aliases: () => this.generateAliases(character, analysis),
      race: () => this.generateRace(analysis),
      age: () => analysis.isCat ? '3 years old' : this.generateAge(character),
      
      // Physical
      description: () => this.generateDescription(analysis),
      physicalDescription: () => this.generateDescription(analysis),
      height: () => analysis.isCat ? '1 foot tall' : '5\'8" tall',
      build: () => analysis.isCat ? 'Sleek and agile' : 'Athletic build',
      eyeColor: () => analysis.isCat ? 'Golden amber' : 'Brown',
      hairColor: () => analysis.isCat ? 'Tabby brown with white patches' : 'Brown',
      
      // Personality & Goals
      personality: () => this.generatePersonality(analysis),
      goals: () => this.generateGoals(analysis),
      motivations: () => this.generateMotivations(analysis),
      
      // Skills & Abilities
      talents: () => this.generateTalents(analysis),
      strengths: () => this.generateStrengths(analysis),
      abilities: () => this.generateAbilities(analysis),
      skills: () => this.generateSkills(analysis),
      
      // Background
      background: () => this.generateBackground(analysis),
      occupation: () => analysis.isCat ? 'House guardian' : 'Professional',
      
      // Story elements
      flaws: () => this.generateFlaws(analysis)
    };
    
    const generator = generators[fieldKey];
    if (generator) {
      return generator();
    }
    
    // Generic contextual fallback
    return this.generateGenericFallback(fieldLabel, analysis);
  }
  
  private static generateName(analysis: CharacterAnalysis, seed: number): string {
    if (analysis.isCat) {
      const catNames = ['Whiskers', 'Shadow', 'Luna', 'Mochi', 'Pixel', 'Nova', 'Sage', 'Ash'];
      return this.getRandomChoice(catNames, seed);
    }
    
    if (analysis.isFantasy) {
      const fantasyNames = ['Aiden Stormwind', 'Elena Nightwhisper', 'Tharen Ironforge', 'Lyra Moonblade'];
      return this.getRandomChoice(fantasyNames, seed);
    }
    
    const humanNames = ['Alex Morgan', 'Jordan Blake', 'Casey Rivers', 'Riley Stone'];
    return this.getRandomChoice(humanNames, seed);
  }
  
  private static generateRace(analysis: CharacterAnalysis): string {
    if (analysis.allText.includes('cat') || analysis.allText.includes('feline')) return 'Cat';
    if (analysis.allText.includes('elf')) return 'Elf';
    if (analysis.allText.includes('dwarf')) return 'Dwarf';
    if (analysis.allText.includes('dragon')) return 'Dragon';
    return 'Human';
  }
  
  private static generateDescription(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'A graceful cat with alert golden eyes and fluid movements, carrying themselves with natural feline dignity and elegance';
    }
    return 'A person of average height with a confident bearing and alert expression';
  }
  
  private static generatePersonality(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'Independent yet affectionate, curious about everything, protective of family. Shows typical feline traits of intelligence and selective attention.';
    }
    return 'Brave and determined, always ready to help others in need. Demonstrates strong moral principles and natural leadership qualities.';
  }
  
  private static generateGoals(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'To protect their territory and keep their human family safe from any threats';
    }
    return 'To protect those they care about and make a positive difference in the world';
  }
  
  private static generateMotivations(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'Deep loyalty to family and strong territorial instincts drive their protective nature';
    }
    return 'A deep sense of justice and duty, combined with love for family and community';
  }
  
  private static generateTalents(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'Natural balance and grace, exceptional hearing, emotional sensitivity, stealth abilities';
    }
    return 'Quick learning and adaptability, problem-solving skills, leadership potential';
  }
  
  private static generateStrengths(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'Exceptional agility and reflexes, keen senses and alertness, independent yet loyal nature';
    }
    return 'Determined and resourceful, strategic thinking, reliable team member';
  }
  
  private static generateAbilities(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'Night vision, enhanced hearing, whisker sensitivity, emotional intuition';
    }
    return 'Quick learning, pattern recognition, strategic thinking, leadership potential';
  }
  
  private static generateSkills(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'Expert hunter, silent stalking, acrobatic climbing, reading human emotions';
    }
    return 'Problem solving, communication, adaptability, teamwork';
  }
  
  private static generateBackground(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'A house cat who discovered their protective instincts and special connection to their human family';
    }
    return 'Grew up in a supportive environment that shaped their strong moral character and desire to help others';
  }
  
  private static generateFlaws(analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return 'Stubbornness, territorial jealousy, dependency on routine';
    }
    return 'Overthinking decisions, self-doubt in new situations, sometimes too trusting of others';
  }
  
  private static generateGenericFallback(fieldLabel: string, analysis: CharacterAnalysis): string {
    if (analysis.isCat) {
      return `Cat-appropriate ${fieldLabel.toLowerCase()} that fits their feline nature`;
    }
    return `Thoughtfully crafted ${fieldLabel.toLowerCase()} that suits their character`;
  }
}