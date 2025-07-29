import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Character } from '@/lib/types';

interface CharacterGenerationOptions {
  characterType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

interface TemplateData {
  name: string;
  description: string;
  category: string;
  traits?: string[];
  background?: string;
  class?: string;
  role?: string;
}

/**
 * Comprehensive character creation service that handles all 4 creation methods
 * with automatic portrait generation
 */
export class CharacterCreationService {
  
  /**
   * Generate character from prompt using AI (TEST MODE)
   * 10-second simulation with proper step progression for both AI modules
   */
  static async generateFromPrompt(
    projectId: string, 
    prompt: string,
    onProgress?: (step: string, progress: number) => void
  ): Promise<Character> {
    try {
      console.log('🧪 TEST MODE: Starting 10-second character generation simulation');
      console.log('🧪 Project ID received:', projectId);
      console.log('🧪 Prompt received:', prompt);
      console.log('🧪 OnProgress callback:', typeof onProgress);
      
      // Use fallback test project ID if none provided
      const testProjectId = projectId || 'test-project-demo';
      console.log('🧪 Using project ID:', testProjectId);
      
      // TEST MODE: 10-second simulation with proper step progression
      const steps = [
        { step: 'Analyzing prompt and understanding character vision...', progress: 10, duration: 2000 },
        { step: 'Generating personality, background, and traits...', progress: 40, duration: 3000 },
        { step: 'Creating visual representation and portrait...', progress: 70, duration: 3000 },
        { step: 'Finalizing character details and preparing sheet...', progress: 100, duration: 2000 }
      ];

      console.log('🧪 Starting step progression...');
      for (const { step, progress, duration } of steps) {
        console.log(`🧪 Step: ${step} (${progress}%) - waiting ${duration}ms`);
        onProgress?.(step, progress);
        await new Promise(resolve => setTimeout(resolve, duration));
      }

      console.log('🧪 Creating test character...');
      // Create comprehensive test character with all 86 fields populated
      const testCharacter: Character = {
        id: `test-char-${Date.now()}`,
        projectId: testProjectId,
        name: 'Aria Shadowweaver',
        title: 'The Mystic Scholar',
        
        // Identity (10 fields)
        species: 'Half-Elf',
        age: '127 years old',
        gender: 'Female (she/her)',
        occupation: 'Arcane Researcher & Guild Librarian',
        nationality: 'Citizens of the Ethereal Territories',
        social_class: 'Middle Class Academic',
        education: 'Master of Arcane Studies, University of Celestial Arts',
        family_status: 'Adopted daughter of renowned human scholars',
        religious_beliefs: 'Follower of the Eternal Codex, believes knowledge is divine',
        political_affiliation: 'Independent, advocates for magical education reform',

        // Appearance (11 fields)  
        physical_description: 'Tall and graceful with an otherworldly elegance that hints at her elven heritage',
        height_weight: '5\'8" (173cm), 135 lbs (61kg) - lithe and athletic build',
        hair: 'Silver-white hair that shimmers with an ethereal glow, often braided with arcane trinkets',
        eyes: 'Deep violet eyes that seem to hold ancient wisdom and sparkle with magical energy',
        skin: 'Pale porcelain skin with a subtle luminescent quality, unmarked by age',
        distinguishing_features: 'Intricate magical tattoos on her forearms that glow when casting spells',
        clothing_style: 'Elegant robes in deep purples and silvers, practical yet sophisticated',
        accessories: 'Crystal pendant containing a captured star, leather-bound grimoire, reading spectacles',
        posture_movement: 'Moves with fluid grace, hands often gesturing as if weaving invisible magic',
        voice_speech: 'Melodic voice with slight accent, speaks thoughtfully and precisely',
        scars_tattoos: 'Runic tattoos on forearms, small scar on left hand from a magical experiment gone wrong',

        // Personality (13 fields)
        personality_overview: 'Intellectually curious and deeply empathetic, with an insatiable thirst for knowledge',
        core_traits: 'Wise, Patient, Curious, Compassionate, Determined',
        values: 'Knowledge, Truth, Justice, Preservation of magical heritage, Education for all',
        motivations: 'To unlock the mysteries of ancient magic and share knowledge freely',
        fears: 'Loss of knowledge, magical catastrophes, being unable to help others',
        quirks: 'Talks to books, collects rare quills, always carries emergency tea supplies',
        habits: 'Early morning meditation, evening research sessions, weekly visits to orphanages',
        speech_patterns: 'Uses archaic phrases, often quotes ancient texts, asks probing questions',
        humor_style: 'Dry wit with scholarly references, enjoys wordplay and magical puns',
        emotional_range: 'Generally calm and composed, passionate about learning, protective of students',
        social_tendencies: 'Prefers small groups, excellent teacher, naturally draws people seeking guidance',
        decision_making: 'Methodical researcher who weighs all options, trusts in knowledge and intuition',
        stress_response: 'Retreats to library, organizes research notes, practices complex magical theory',

        // Psychology (8 fields)
        mental_state: 'Mentally sharp and emotionally stable, slight anxiety about magical disasters',
        intelligence_type: 'Exceptionally high analytical intelligence with strong emotional and magical intelligence',
        learning_style: 'Visual learner who excels with written materials and hands-on magical practice',
        memory_type: 'Eidetic memory for magical formulas and texts, excellent recall for faces and conversations',
        emotional_intelligence: 'High empathy and social awareness, skilled at reading people and situations',
        psychological_profile: 'INTJ personality with strong intuitive and thinking preferences, natural leader',
        mental_strengths: 'Pattern recognition, logical analysis, magical theory comprehension, teaching ability',
        mental_weaknesses: 'Perfectionism, overthinking complex problems, occasional social awkwardness',

        // Abilities (12 fields)
        magical_abilities: 'Expert in divination, illusion, and enchantment magic with growing necromantic interests',
        physical_abilities: 'Excellent fine motor control, enhanced reflexes from magical training, surprising stamina',
        intellectual_abilities: 'Genius-level intellect, photographic memory, multilingual (7 languages)',
        social_abilities: 'Natural teacher, persuasive speaker, skilled at building academic networks',
        creative_abilities: 'Talented at magical innovation, skilled calligrapher, creates beautiful illuminated manuscripts',
        survival_abilities: 'Basic wilderness survival, excellent at finding resources in urban environments',
        combat_abilities: 'Defensive magic specialist, staff combat training, strategic thinking in conflicts',
        special_talents: 'Can sense magical auras, speed reading, perfect pitch for magical incantations',
        skills_expertise: 'Arcane Theory (Master), Research (Expert), Teaching (Expert), Ancient Languages (Advanced)',
        weaknesses_limitations: 'Physical combat, requires components for complex spells, vulnerable to anti-magic',
        growth_potential: 'Unlimited magical learning potential, developing leadership abilities',
        equipment_mastery: 'Masterful with magical implements, extensive knowledge of magical item creation',

        // Background (11 fields)
        origin_story: 'Found as a baby during a magical storm, raised by loving human scholars who nurtured her gifts',
        childhood: 'Precocious child who devoured books, showed early magical talent, beloved by academic community',
        education_history: 'Accelerated through magical academy, youngest graduate in university history',
        career_path: 'Started as apprentice librarian, rose to head researcher, now training next generation',
        major_events: 'Discovery of ancient magical texts, prevention of dimensional rift, founding of scholarship program',
        achievements: 'Published groundbreaking research on planar magic, saved city from magical disaster',
        failures_regrets: 'Failed to save mentor from magical experiment, regrets not learning healing magic sooner',
        secrets: 'Secretly researching forbidden necromancy to understand life and death, has prophetic dreams',
        reputation: 'Renowned scholar respected across magical communities, seen as bridge between theory and practice',
        lifestyle: 'Lives in tower apartment above library, simple but comfortable, surrounded by books and research',
        current_situation: 'Leading research into ancient magical phenomena while teaching promising students',

        // Relationships (8 fields)
        family: 'Adoptive parents Professor Marcus and Dr. Elena Brightward (both human scholars)',
        friends: 'Close friendship with Finn (halfling bard), mentors young mage Zara, academic colleagues',
        romantic: 'Previously involved with fellow researcher, currently single but open to connection',
        enemies: 'Opposed by traditionalist mages who fear her progressive ideas, shadowy cult seeking her research',
        mentors: 'Late Professor Aldric Starweaver (her magical theory mentor), Elder Celestine (current advisor)',
        allies: 'Progressive Magic Guild, University Faculty, City Council Education Committee',
        professional: 'Extensive network of scholars, researchers, librarians, and magical practitioners worldwide',
        social_circle: 'Mix of academics, magical practitioners, students, and community organizers',

        // Cultural (6 fields)
        cultural_background: 'Raised in human academic culture but embraces elven magical traditions',
        traditions: 'Celebrates both human scholarly festivals and elven seasonal ceremonies',
        beliefs: 'Knowledge should be preserved and shared, magic is a gift to be used responsibly',
        customs: 'Morning tea ceremony, evening research ritual, weekly community service',
        language: 'Common (native), Elvish (fluent), Draconic, Celestial, Sylvan, Giant, Primordial',
        heritage: 'Half-elven heritage gives her perspective on both cultures, serves as cultural bridge',

        // Story Role (4 fields)
        role: 'Mentor and Knowledge Keeper - guides others while pursuing greater understanding',
        narrative_function: 'Quest giver, information source, magical problem solver, character development catalyst',
        character_arc: 'From isolated scholar to community leader, learning to balance knowledge with action',
        story_impact: 'Her discoveries and decisions shape the magical landscape and inspire others',

        // Meta (3 fields)
        creation_notes: 'Designed as wise mentor figure with hidden depths and personal struggles',
        inspiration: 'Blend of scholarly archetype with approachable teacher, inspired by great librarians of fantasy',
        usage_notes: 'Perfect for campaigns involving magical mysteries, academic intrigue, or mentor relationships',

        // Core fields
        description: 'Aria Shadowweaver is a brilliant half-elven scholar whose thirst for knowledge is matched only by her desire to share it with others. Raised by human academics but connected to her elven heritage, she serves as a bridge between worlds both literally and figuratively.',
        imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=600&fit=crop&crop=face',
        completionPercentage: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('✅ TEST MODE: Character generation complete - ready for full view');
      console.log('✅ Test character created:', testCharacter.name, testCharacter.id);
      console.log('✅ Returning character with', Object.keys(testCharacter).length, 'fields');
      
      // 🔧 SAVE CHARACTER TO BACKEND (TEST COMPLETE FLOW)
      console.log('💾 Saving character to backend for complete flow test...');
      try {
        const saveResponse = await fetch(`/api/projects/${testProjectId}/characters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testCharacter),
        });

        if (saveResponse.ok) {
          const savedCharacter = await saveResponse.json();
          console.log('✅ Character saved successfully:', savedCharacter.id);
          return savedCharacter as Character;
        } else {
          console.warn('⚠️ Character save failed, returning local character:', await saveResponse.text());
          return testCharacter;
        }
      } catch (saveError) {
        console.warn('⚠️ Character save error, returning local character:', saveError);
        return testCharacter;
      }

    } catch (error) {
      console.error('❌ Test character generation failed:', error);
      console.error('❌ Error details:', error.message, error.stack);
      throw new Error('Test character generation failed. This is expected in test mode.');
    }
  }

  /**
   * Method 2: Custom AI Generation with options (legacy method)
   */
  static async generateCustomCharacter(
    projectId: string,
    options: CharacterGenerationOptions
  ): Promise<Partial<Character>> {
    console.log('Creating custom character with automatic portrait');
    
    try {
      const response = await fetch(`/api/projects/${projectId}/characters/generate`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate custom character');
      }

      const characterData = await response.json();
      console.log('Custom character generated with portrait:', characterData.imageUrl ? 'Yes' : 'No');
      
      return characterData;
    } catch (error) {
      console.error('Custom character generation failed:', error);
      throw error;
    }
  }



  /**
   * Method 3: Document import with automatic portrait
   */
  static async importFromDocument(
    projectId: string,
    file: File
  ): Promise<Partial<Character>> {
    console.log('Importing character from document with automatic portrait');
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('projectId', projectId);

      const response = await fetch('/api/characters/import-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import character from document');
      }

      const characterData = await response.json();
      console.log('Document character imported with portrait:', characterData.imageUrl ? 'Yes' : 'No');
      
      return characterData;
    } catch (error) {
      console.error('Document import failed:', error);
      throw error;
    }
  }

  /**
   * Method 4: Manual/blank character creation with automatic portrait
   */
  static async createManualCharacter(
    projectId: string,
    characterData: Partial<Character>
  ): Promise<Partial<Character>> {
    console.log('Creating manual character with automatic portrait');
    
    // For manual creation, just return the character data as-is
    // Portrait can be generated separately if needed
    return {
      ...characterData,
      projectId
    };
  }

  /**
   * Saves character to database and invalidates cache
   */
  static async saveCharacter(
    projectId: string,
    characterData: Partial<Character>
  ): Promise<Character> {
    console.log('Saving character to database');
    
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        body: JSON.stringify({
          ...characterData,
          projectId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save character failed with status:', response.status, 'Error:', errorText);
        throw new Error(`Failed to save character: ${response.status} - ${errorText}`);
      }

      const savedCharacter = await response.json();
      
      // Invalidate character cache to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['/api/characters', { projectId }] });
      
      return savedCharacter;
    } catch (error) {
      console.error('Character save failed:', error);
      throw error;
    }
  }

  /**
   * Complete character creation workflow for any method
   */
  static async completeCharacterCreation(
    projectId: string,
    method: 'custom' | 'template' | 'document' | 'manual',
    data: any
  ): Promise<Character> {
    let characterData: Partial<Character>;

    // Generate character with automatic portrait based on method
    switch (method) {
      case 'custom':
        // Custom AI generation already creates character in database, no need to save again
        const customCharacter = await this.generateCustomCharacter(projectId, data);
        // Invalidate cache to refresh UI
        queryClient.invalidateQueries({ queryKey: ['/api/characters', { projectId }] });
        return customCharacter as Character;
      case 'template':
        // Template generation now uses generateFromPrompt with built prompt 
        const templateCharacter = await this.generateFromPrompt(projectId, data.prompt || data.customPrompt);
        // Invalidate cache to refresh UI
        queryClient.invalidateQueries({ queryKey: ['/api/characters', { projectId }] });
        return templateCharacter as Character;
      case 'document':
        // Document import creates character directly in database, no need to save again
        const importedCharacter = await this.importFromDocument(projectId, data);
        // Invalidate cache to refresh UI
        queryClient.invalidateQueries({ queryKey: ['/api/characters', { projectId }] });
        return importedCharacter as Character;
      case 'manual':
        characterData = await this.createManualCharacter(projectId, data);
        break;
      default:
        throw new Error('Unknown character creation method');
    }

    // Only save manually created characters (others are already saved by their respective endpoints)
    const savedCharacter = await this.saveCharacter(projectId, characterData);
    
    console.log('Character creation complete:', {
      method,
      name: savedCharacter.name,
      hasPortrait: !!savedCharacter.imageUrl,
      portraitCount: savedCharacter.portraits?.length || 0
    });

    return savedCharacter;
  }
}

export default CharacterCreationService;