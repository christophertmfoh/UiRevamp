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
   * Method 1: Custom AI Generation from Free-form Prompt
   * Complete end-to-end flow: Generate → Portrait → Full Character View
   */
  static async generateFromPrompt(
    projectId: string,
    prompt: string,
    onProgress?: (step: string, progress: number) => void
  ): Promise<Character> {
    console.log('🎭 Starting AI character generation from prompt');
    console.log('📝 Project ID:', projectId);
    console.log('📝 Prompt length:', prompt.length);
    
    try {
      // Step 1: Generate character data
      onProgress?.('Analyzing your prompt...', 10);
      
      const requestBody = {
        customPrompt: prompt,
        characterType: 'custom',
        role: 'auto-detect',
        personality: 'auto-generate',
        archetype: 'auto-detect'
      };
      
      console.log('📤 Sending request to:', `/api/projects/${projectId}/characters/generate`);
      console.log('📤 Request body:', requestBody);
      
              // TEMPORARY FIX: Demo character generation for testing when server is down
        if (false) { // Set to false when server is working
          console.log('🔧 DEMO MODE: Generating mock character for testing');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        onProgress?.('Generating character details...', 40);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        onProgress?.(  'Creating character portrait...', 70);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create a comprehensive demo character with all fields
        const demoCharacter = {
          id: `demo-char-${Date.now()}`,
          projectId,
          name: "Aria Nightwhisper",
          nicknames: "The Shadow Scholar",
          pronouns: "she/her",
          age: "28",
          species: "Half-Elf",
          gender: "Female",
          occupation: "Arcane Researcher",
          title: "Senior Archivist",
          birthdate: "Autumn Equinox, 1195",
          birthplace: "Library City of Aethermoor",
          currentLocation: "The Floating Archives",
          nationality: "Aethermoorian",
          
          // Appearance
          height: "5'7\"",
          weight: "135 lbs",
          bodyType: "Lean and graceful",
          hairColor: "Midnight black with silver streaks",
          hairStyle: "Long, usually in an intricate braid",
          hairTexture: "Silky and straight",
          eyeColor: "Deep violet with gold flecks",
          eyeShape: "Almond-shaped",
          skinTone: "Pale with a luminescent quality",
          facialFeatures: "High cheekbones, delicate features",
          physicalFeatures: "Graceful movement, always carries herself with dignity",
          scarsMarkings: "Small crescent moon scar on left temple from a magical accident",
          clothing: "Flowing robes in deep blues and silvers, practical yet elegant",
          accessories: "Crystal pendant that glows when near magical texts",
          generalAppearance: "Ethereal and scholarly, radiates quiet intelligence",
          
          // Personality
          personalityTraits: ["Intensely curious", "Methodical", "Compassionate", "Introspective"],
          positiveTraits: ["Brilliant", "Loyal", "Patient", "Wise beyond her years"],
          negativeTraits: ["Perfectionist", "Socially awkward", "Overthinks everything"],
          quirks: ["Talks to books", "Collects rare inks", "Hums while reading"],
          mannerisms: "Traces magical symbols in the air when thinking",
          temperament: "Calm and contemplative",
          emotionalState: "Generally content but yearning for adventure",
          sense_of_humor: "Dry wit, enjoys wordplay and scholarly jokes",
          speech_patterns: "Articulate, uses archaic phrases, speaks softly",
          
          // Psychology
          intelligence: "Exceptionally high analytical and magical intelligence",
          education: "Master's degree from the Arcane University",
          mentalHealth: "Stable but struggles with social anxiety",
          phobias: ["Fear of losing knowledge", "Crowds", "Being forgotten"],
          motivations: ["Preserving ancient knowledge", "Understanding the cosmos", "Proving herself"],
          goals: ["Discover the Lost Spells of Creation", "Build the greatest library", "Bridge different worlds"],
          desires: ["True connection", "Recognition for her work", "To see the stars up close"],
          regrets: ["Not spending enough time with her mentor before he died"],
          secrets: ["Can speak to spirits in old books", "Is writing a revolutionary magical theory"],
          moral_code: "Knowledge should be preserved and shared responsibly",
          worldview: "The universe is a vast library waiting to be read",
          philosophy: "Every person contains infinite stories worth preserving",
          
          // Abilities
          skills: ["Advanced magical theory", "Ancient languages", "Research", "Calligraphy"],
          talents: ["Eidetic memory", "Speed reading", "Magical resonance detection"],
          powers: ["Bibliomancy", "Memory magic", "Astral projection"],
          weaknesses: ["Physical combat", "Social situations", "Impatience with ignorance"],
          strengths: ["Vast knowledge", "Magical aptitude", "Problem-solving"],
          combat_skills: ["Defensive magic", "Binding spells"],
          magical_abilities: ["Divination", "Enchantment", "Transmutation"],
          languages: ["Common", "Elvish", "Draconic", "Celestial", "Ancient Runic"],
          hobbies: ["Star gazing", "Ink brewing", "Bookbinding", "Growing magical herbs"],
          
          // Background
          backstory: "Born to a human scholar and elven mage, Aria grew up surrounded by books and magic...",
          childhood: "Spent most of her childhood in libraries, raised by her grandmother after her parents died",
          formative_events: ["Discovery of her magical abilities", "Loss of parents", "First spirit contact"],
          trauma: "Witnessed her parents' death in a magical experiment gone wrong",
          achievements: ["Youngest person to master Bibliomancy", "Discovered three lost spells"],
          failures: ["Failed to save her mentor", "Accidentally destroyed a rare manuscript"],
          education_background: "Graduated summa cum laude from Arcane University",
          work_history: "Junior Archivist, Research Assistant, Senior Archivist",
          military_service: "None",
          criminal_record: "Clean",
          
          // Relationships
          family: ["Grandmother Elara (guardian)", "Parents (deceased)"],
          friends: ["Keeper Thalorin", "Spirit of the Ancient Librarian"],
          enemies: ["The Void Seekers (knowledge destroyers)"],
          allies: ["The Circle of Scribes", "Professor Ravenscroft"],
          mentors: ["Master Aldric (deceased)", "Grandmother Elara"],
          romantic_interests: ["Had a crush on fellow student Marcus"],
          relationship_status: "Single, focused on work",
          social_connections: ["Academic circles", "The Scribes Guild"],
          children: ["None"],
          pets: ["A familiar raven named Quill"],
          
          // Cultural
          culture: "Academic Elvish-Human blend",
          religion: "Worships Oghma, god of knowledge",
          traditions: ["Annual Day of Remembrance for lost knowledge"],
          values: ["Knowledge", "Truth", "Preservation", "Understanding"],
          customs: ["Blessing books before reading", "Leaving offerings for book spirits"],
          social_class: "Academic middle class",
          political_views: "Believes in free access to knowledge",
          economic_status: "Comfortable but not wealthy",
          
          // Story Role
          role: "Supporting Character",
          character_arc: "Will learn to balance knowledge with experience",
          narrative_function: "Knowledge keeper and magical advisor",
          story_importance: "Important",
          first_appearance: "Chapter 3: The Archives",
          last_appearance: "To be determined",
          character_growth: "Will overcome social anxiety and find her place in the world",
          internal_conflict: "Torn between safety of books and call of adventure",
          external_conflict: "Must protect ancient knowledge from those who would destroy it",
          
          // Meta
          inspiration: "Hermione Granger meets Gandalf",
          creation_notes: "Designed to be the party's magical knowledge source",
          character_concept: "The librarian who becomes a hero",
          design_notes: "Ethereal appearance with practical elements",
          voice_notes: "Soft-spoken but authoritative when discussing her expertise",
          themes: ["Knowledge vs. Experience", "Growth", "Legacy"],
          symbolism: "Represents the bridge between tradition and innovation",
          author_notes: "Can be expanded into a main character if needed",
          
          imageUrl: "https://picsum.photos/400/400?random=aria",
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return demoCharacter;
      }
      
      const response = await fetch(`/api/projects/${projectId}/characters/generate`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Failed to generate character: ${response.status} ${response.statusText} - ${errorText}`);
      }

      onProgress?.('Generating character details...', 40);
      const character = await response.json();
      
      console.log('✅ Character generated with fields:', Object.keys(character).length);
      
      // Step 2: Portrait is already generated by the server, but we can verify/regenerate if needed
      onProgress?.('Finalizing character portrait...', 70);
      
      // The server endpoint already includes portrait generation, so character.imageUrl should exist
      if (character.imageUrl) {
        onProgress?.('Portrait ready...', 90);
        console.log('✅ Portrait included in response:', character.imageUrl.substring(0, 50) + '...');
      } else {
        onProgress?.('Generating portrait...', 75);
        // Fallback: Generate portrait if not already included
        try {
          const portraitResponse = await fetch(`/api/characters/${character.id}/generate-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (portraitResponse.ok) {
            const portraitData = await portraitResponse.json();
            character.imageUrl = portraitData.url;
            onProgress?.('Portrait generated successfully...', 90);
            console.log('✅ Fallback portrait generated:', portraitData.url.substring(0, 50) + '...');
          } else {
            console.warn('Portrait generation failed, proceeding without image');
            onProgress?.('Character ready (no portrait)...', 90);
          }
        } catch (portraitError) {
          console.warn('Portrait generation error:', portraitError);
          onProgress?.('Character ready (portrait failed)...', 90);
        }
      }

      onProgress?.('Complete!', 100);
      
      console.log('✅ Character generation complete:', {
        name: character.name,
        hasPortrait: !!character.imageUrl,
        fieldCount: Object.keys(character).length
      });

      return character as Character;
      
    } catch (error) {
      console.error('❌ Character generation failed:', error);
      
      // Check if it's a network error (server not running)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error - server may not be running');
        throw new Error('Cannot connect to server. Please make sure the development server is running with "npm run dev".');
      }
      
      throw error;
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
   * Method 2: AI Template Generation with automatic portrait
   * Complete end-to-end flow: Generate → Portrait → Full Character View
   */
  static async generateFromTemplate(
    projectId: string,
    templateData: TemplateData,
    onProgress?: (step: string, progress: number) => void
  ): Promise<Character> {
    console.log('🎭 Starting AI template character generation');
    console.log('📝 Project ID:', projectId);
    console.log('📝 Template:', templateData.name);
    
    try {
      // Step 1: Generate character data
      onProgress?.('Analyzing template...', 10);
      
      const requestBody = { templateData };
      
      console.log('📤 Sending request to:', `/api/projects/${projectId}/characters/generate-from-template`);
      console.log('📤 Request body:', requestBody);
      
              // TEMPORARY FIX: Demo character generation for testing when server is down
        if (false) { // Set to false when server is working
          console.log('🔧 DEMO MODE: Generating mock template character for testing');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        onProgress?.('Generating character details...', 40);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        onProgress?.('Creating character portrait...', 70);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create demo character based on template
        const templateName = templateData.name;
        const templateCategory = templateData.category;
        const templateTraits = templateData.traits || [];
        
        const demoCharacter = {
          id: `demo-template-${Date.now()}`,
          projectId,
          name: templateName === 'Heroic Protagonist' ? 'Sir Aldric Brightblade' : 
                templateName === 'Dark Sorcerer' ? 'Malachar the Voidkeeper' :
                templateName === 'Wise Mentor' ? 'Elder Theron Starbinder' :
                `Generated ${templateName}`,
          nicknames: templateName === 'Heroic Protagonist' ? 'The Lightbringer' :
                    templateName === 'Dark Sorcerer' ? 'Shadow Lord' :
                    templateName === 'Wise Mentor' ? 'The Ancient One' :
                    'The Template Character',
          pronouns: "they/them",
          age: templateName === 'Wise Mentor' ? "127" : "32",
          species: templateCategory === 'Fantasy' ? "Human" : 
                  templateCategory === 'Sci-Fi' ? "Synthetic" : "Human",
          gender: "Non-binary",
          occupation: templateName === 'Heroic Protagonist' ? 'Knight of the Realm' :
                     templateName === 'Dark Sorcerer' ? 'Forbidden Arcane Master' :
                     templateName === 'Wise Mentor' ? 'Academy Headmaster' :
                     'Professional Adventurer',
          title: templateName === 'Heroic Protagonist' ? 'Champion of Light' :
                templateName === 'Dark Sorcerer' ? 'Master of the Dark Arts' :
                'Template Character',
          birthdate: "Unknown",
          birthplace: templateCategory === 'Fantasy' ? 'Kingdom of Eldoria' :
                     templateCategory === 'Sci-Fi' ? 'New Terra Colony' :
                     'Generated Location',
          currentLocation: "The Central Hub",
          nationality: "Templarian",
          
          // Appearance based on template
          height: "5'10\"",
          weight: "170 lbs",
          bodyType: templateTraits.includes('Strong') ? 'Muscular and imposing' : 'Average build',
          hairColor: templateName === 'Dark Sorcerer' ? 'Jet black' : 'Brown',
          hairStyle: templateName === 'Wise Mentor' ? 'Long beard and flowing hair' : 'Well-groomed',
          hairTexture: "Thick",
          eyeColor: templateName === 'Dark Sorcerer' ? 'Piercing violet' : 'Brown',
          eyeShape: "Intense",
          skinTone: "Fair",
          facialFeatures: templateTraits.includes('Noble') ? 'Regal features' : 'Determined expression',
          physicalFeatures: templateTraits.includes('Brave') ? 'Confident bearing' : 'Thoughtful demeanor',
          scarsMarkings: templateName === 'Heroic Protagonist' ? 'Battle scars from defending the innocent' : 'None visible',
          clothing: templateCategory === 'Fantasy' ? 'Adventuring gear suited to their role' : 'Professional attire',
          accessories: templateName === 'Dark Sorcerer' ? 'Arcane focus and ritual items' : 'Practical equipment',
          generalAppearance: `Embodies the essence of a ${templateName}`,
          
          // Personality from template
          personalityTraits: templateTraits,
          positiveTraits: templateTraits.filter(trait => !['Dark', 'Ruthless', 'Cruel'].includes(trait)),
          negativeTraits: templateName === 'Dark Sorcerer' ? ['Manipulative', 'Power-hungry'] : ['Perfectionist'],
          quirks: [templateName === 'Wise Mentor' ? 'Speaks in riddles' : 'Has unique mannerisms'],
          mannerisms: `Acts in ways befitting a ${templateName}`,
          temperament: templateTraits.includes('Wise') ? 'Calm and thoughtful' : 'Determined',
          emotionalState: "Focused on their purpose",
          sense_of_humor: templateTraits.includes('Noble') ? 'Dry wit' : 'Situational humor',
          speech_patterns: templateName === 'Wise Mentor' ? 'Speaks with ancient wisdom' : 'Clear and direct',
          
          // Psychology
          intelligence: templateTraits.includes('Wise') ? 'Exceptional wisdom and knowledge' : 'Above average',
          education: templateName === 'Wise Mentor' ? 'Centuries of accumulated learning' : 'Specialized training',
          mentalHealth: "Stable",
          phobias: ["Failure in their mission"],
          motivations: templateName === 'Heroic Protagonist' ? ['Protecting the innocent', 'Upholding justice'] :
                      templateName === 'Dark Sorcerer' ? ['Accumulating power', 'Forbidden knowledge'] :
                      ['Fulfilling their role', 'Making a difference'],
          goals: [`Master the art of being a ${templateName}`, 'Leave a lasting legacy'],
          desires: ["Recognition", "Achievement", "Making an impact"],
          regrets: ["Past mistakes in their journey"],
          secrets: [`Hidden aspects of their ${templateName} nature`],
          moral_code: templateName === 'Dark Sorcerer' ? 'Power justifies the means' : 'Do what is right',
          worldview: `The world needs more ${templateName}s`,
          philosophy: templateData.description,
          
          // Fill out all other required fields with template-appropriate content
          skills: templateTraits.map(trait => `${trait}-related skills`),
          talents: [`Natural ${templateName} abilities`],
          powers: templateCategory === 'Fantasy' ? ['Magical abilities'] : ['Exceptional skills'],
          weaknesses: ["Overconfidence"],
          strengths: templateTraits,
          combat_skills: templateName === 'Heroic Protagonist' ? ['Sword combat'] : ['Basic defense'],
          magical_abilities: templateCategory === 'Fantasy' ? ['Elemental magic'] : [],
          languages: ["Common", "Ancient"],
          hobbies: ["Training", "Reading"],
          
          // Background
          backstory: `A ${templateName} shaped by ${templateData.description}`,
          childhood: `Showed early signs of becoming a ${templateName}`,
          formative_events: [`The awakening as a ${templateName}`],
          trauma: "Challenges that forged their path",
          achievements: [`Mastery of ${templateName} arts`],
          failures: ["Early setbacks"],
          education_background: `Trained as a ${templateName}`,
          work_history: `Professional ${templateName}`,
          military_service: templateName === 'Heroic Protagonist' ? 'Served with honor' : 'None',
          criminal_record: "Clean",
          
          // Relationships
          family: ["Supportive family"],
          friends: [`Fellow ${templateName}s`],
          enemies: [`Opponents of ${templateName}s`],
          allies: ["Like-minded individuals"],
          mentors: [`Previous ${templateName}`],
          romantic_interests: ["Understanding partner"],
          relationship_status: "Single",
          social_connections: [`${templateName} community`],
          children: ["None"],
          pets: ["Loyal companion"],
          
          // Cultural
          culture: `${templateName} traditions`,
          religion: 'Personal beliefs',
          traditions: [`${templateName} customs`],
          values: templateTraits,
          customs: [`${templateName} practices`],
          social_class: 'Middle class',
          political_views: `Pro-${templateName}`,
          economic_status: "Comfortable",
          
          // Story Role
          role: templateData.role || 'Supporting Character',
          character_arc: `Growth as a ${templateName}`,
          narrative_function: `${templateName} archetype`,
          story_importance: "Important",
          first_appearance: "Chapter 1",
          last_appearance: "TBD",
          character_growth: `Mastering ${templateName} role`,
          internal_conflict: `${templateName} burden`,
          external_conflict: `Proving worth as ${templateName}`,
          
          // Meta
          inspiration: `Classic ${templateName}`,
          creation_notes: `From ${templateName} template`,
          character_concept: templateData.description,
          design_notes: `${templateName} embodiment`,
          voice_notes: `True ${templateName} voice`,
          themes: [`${templateName} journey`],
          symbolism: `${templateName} ideal`,
          author_notes: `Template-based character`,
          
          imageUrl: "https://picsum.photos/400/400?random=template",
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return demoCharacter;
      }

      const response = await fetch(`/api/projects/${projectId}/characters/generate-from-template`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate template character: ${response.status} - ${errorText}`);
      }

      const characterData = await response.json();
      onProgress?.('Creating character portrait...', 80);
      
      // Generate portrait if needed
      if (!characterData.imageUrl) {
        try {
          const portraitResponse = await fetch(`/api/characters/${characterData.id}/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (portraitResponse.ok) {
            const portraitData = await portraitResponse.json();
            characterData.imageUrl = portraitData.imageUrl;
          }
        } catch (portraitError) {
          console.warn('Portrait generation failed:', portraitError);
          characterData.imageUrl = `https://picsum.photos/400/400?random=${characterData.id}`;
        }
      }
      
      onProgress?.('Finalizing character...', 100);
      return characterData as Character;
      
    } catch (error) {
      console.error('Template character generation failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure the development server is running.');
      }
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
        // Template generation already creates character in database, no need to save again
        const templateCharacter = await this.generateFromTemplate(projectId, data);
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