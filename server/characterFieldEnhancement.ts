import { GoogleGenAI } from "@google/genai";

// Use the same API key logic as the main enhancement
const apiKey = process.env.GOOGLE_API_KEY_NEW || process.env.GOOGLE_API_KEY4 || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
console.log(`Field enhancement using API key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NONE'}`);

const ai = new GoogleGenAI({ apiKey });

// Rate limiting specifically for individual field enhancements
// Full character generation and bulk operations bypass this
const fieldRequestTimes: number[] = [];
const FIELD_RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_FIELD_REQUESTS_PER_MINUTE = 8; // Conservative for individual clicks

function canMakeFieldRequest(): boolean {
  const now = Date.now();
  // Remove requests older than 1 minute
  while (fieldRequestTimes.length > 0 && fieldRequestTimes[0] < now - FIELD_RATE_LIMIT_WINDOW) {
    fieldRequestTimes.shift();
  }
  return fieldRequestTimes.length < MAX_FIELD_REQUESTS_PER_MINUTE;
}

function recordFieldRequest(): void {
  fieldRequestTimes.push(Date.now());
}

export async function enhanceCharacterField(character: any, fieldKey: string, fieldLabel: string, currentValue: any, fieldOptions?: string[], isIndividualRequest: boolean = true) {
  try {
    console.log(`\n=== Processing ${isIndividualRequest ? 'Individual' : 'Bulk'} Field Enhancement ===`);
    console.log(`Field: ${fieldKey} (${fieldLabel})`);
    console.log(`Current value: ${currentValue || 'empty'}`);

    // Only apply rate limiting to individual field requests (genie clicks)
    // Full character generation and bulk operations bypass rate limiting
    if (isIndividualRequest && !canMakeFieldRequest()) {
      console.log(`Individual field rate limit reached, using intelligent fallback for ${fieldKey}`);
      // Skip AI call and go directly to fallback for individual requests
      throw new Error('Rate limited - using fallback');
    }

    // Always allow enhancement - users can improve existing content or generate new content

    // Create comprehensive context from ALL available character data using actual field names
    const characterContext = `
=== CHARACTER ANALYSIS ===
Name: ${character.name || 'Unknown'}
Nicknames: ${character.nicknames || 'None'}
Title: ${character.title || 'None'}
Aliases: ${character.aliases || 'None'}
Race/Species: ${character.race || character.species || 'Unknown'}
Class/Profession: ${character.class || character.profession || character.occupation || 'Unknown'}
Age: ${character.age || 'Unknown'}
Background: ${character.background || 'Unknown'}
Description: ${character.description || character.physicalDescription || 'Unknown'}
Personality: ${character.personalityTraits || character.personality || 'Unknown'}
Goals: ${character.goals || 'Unknown'}
Motivations: ${character.motivations || 'Unknown'}
Role: ${character.role || 'Unknown'}
Height: ${character.height || 'Unknown'}
Build: ${character.build || 'Unknown'}
Eye Color: ${character.eyeColor || 'Unknown'}
Hair Color: ${character.hairColor || 'Unknown'}
Skills: ${character.skills || 'Unknown'}
Abilities: ${character.abilities || 'Unknown'}
Flaws: ${character.flaws || 'Unknown'}
Story Function: ${character.storyFunction || 'Unknown'}
Notes: ${character.notes || 'Unknown'}

=== RAW CHARACTER DATA ===
${JSON.stringify(character, null, 2).substring(0, 800)}
    `.trim();

    console.log(`Full character context being sent to AI:`, characterContext);

    // Check if this is a dropdown field with specific options
    const isDropdownField = fieldOptions && fieldOptions.length > 0;
    
    // Create field-specific prompts based on the field type
    let prompt;
    if (isDropdownField) {
      prompt = `You are a professional character development expert. Analyze this character and choose the most appropriate option from the dropdown list for "${fieldLabel}".

CRITICAL: READ ALL CHARACTER DATA CAREFULLY:
${characterContext}

AVAILABLE OPTIONS FOR "${fieldLabel}":
${fieldOptions.map(option => `- ${option}`).join('\n')}

TASK: Choose the BEST option from the list above that fits this character
CURRENT VALUE: ${currentValue || 'empty'}

INSTRUCTIONS:
1. CAREFULLY analyze the character information
2. Consider the character's name, background, description, personality
3. Choose the option that best fits their role in the story
4. For a character named "beans" who is a cat, consider roles like "Comic Relief" or "Supporting Character"
5. If regenerating, choose a DIFFERENT option than before to provide variety
6. RESPOND WITH ONLY ONE OF THE EXACT OPTIONS FROM THE LIST ABOVE - no explanations`;
    } else {
      // Enhanced field-specific prompts with detailed instructions for Identity section
      const fieldSpecificPrompts: { [key: string]: string } = {
        // IDENTITY SECTION - Detailed prompts for each field
        name: `Generate a creative, fitting name for this character. Consider:
- Their species (if "beans" is a cat, suggest cat-like names or human names that fit a pet)
- Their background and role in the story
- Cultural context if specified
- Current name can be improved or completely replaced
Be creative and meaningful, not generic.`,
        
        nicknames: `Generate 2-3 nicknames this character would actually be called by friends, family, or companions:
- Based on their personality traits
- Shortened versions of their name
- Pet names or terms of endearment
- Reflecting their species (for cats: "kitty", "whiskers", etc.)
Format as a comma-separated list.`,
        
        title: `Generate an appropriate title, rank, or honorific for this character:
- Consider their social status and profession
- For cats: "Sir/Lady", "The Great", "Master/Mistress"
- For humans: professional titles, nobility ranks
- Fantasy titles that fit their role
- Make it unique and fitting, not generic.`,
        
        aliases: `Generate 1-2 secret identities, code names, or false identities this character might use:
- Consider their background and motivations
- For sneaky characters: shadow names, descriptive aliases
- For cats: playful or mysterious alternate names
- Should feel authentic to their personality.`,
        
        role: `Analyze this character's personality and background to determine their story role:
- Main character traits and motivations
- Their function in the narrative
- For cats: often "Comic Relief", "Familiar", "Companion"
- Be specific about their narrative purpose.`,
        
        race: `Determine this character's race/species by analyzing ALL available information:
- Name clues (like "beans" strongly suggests a cat)
- Background mentions of species
- Physical descriptions
- Behavioral traits
- NEVER default to "Human" unless clearly indicated
- For animal names, use the animal species.`,
        
        ethnicity: `Generate cultural/ethnic background that fits this character:
- Consider their name and background
- For cats: describe their breed or origin
- For humans: cultural heritage that matches their story
- Make it rich and specific, not vague.`,
        
        age: `Generate appropriate age considering their species and role:
- For cats: use realistic cat age (1-15 years) or describe as "appears X years old"
- For humans: age that fits their role and experience level
- Consider their background and life experience
- Be specific, not generic ranges.`,
        
        birthdate: `Generate a specific birth date that fits this character:
- Consider their age and current story timeline
- For fantasy: create appropriate calendar dates
- Make it feel real and purposeful
- Include month, day, and year if possible.`,
        
        zodiacSign: `Generate a zodiac sign that matches this character's personality:
- Analyze their personality traits carefully
- Choose sign that actually reflects their nature
- Consider both Western and Eastern zodiac if relevant
- Explain why it fits briefly.`,
        
        class: `Generate a class/profession that perfectly fits this character:
- For cats: "Familiar", "Scout", "Hunter", "Guardian", "Trickster"
- Consider their skills and role in the story
- Should match their personality and background
- Be creative and specific.`,
        
        profession: `Generate a realistic profession for this character:
- Consider their species and setting
- For cats: "Mouser", "Companion", "Shop Cat"
- Should fit their world and abilities
- Make it interesting and fitting.`,
        
        occupation: `Generate their current job or daily role:
- What they actually do day-to-day
- Consider their skills and circumstances
- For cats: their role in household/establishment
- Should be specific and realistic.`,

        // PHYSICAL/APPEARANCE SECTION - Detailed prompts for each field
        height: `Generate height appropriate for this character's race/species:
- For cats: "10-12 inches at shoulder" or "small/medium/large for a cat"
- For humans: specific measurements like "5'8\"" or descriptive "tall/average/short"
- Consider their age and build
- Be specific and realistic for their species.`,
        
        weight: `Generate weight/build description appropriate for this character:
- For cats: "8-15 pounds" or "lean/stocky/fluffy build"
- For humans: descriptive like "lean", "muscular", "heavy-set"
- Consider their lifestyle and activity level
- Should match their overall physique.`,
        
        build: `Generate detailed body type/build description:
- For cats: "sleek and agile", "sturdy and muscular", "slim and graceful"
- Describe their overall physical structure
- Consider their lifestyle and species traits
- Be specific about their physique and presence.`,
        
        eyeColor: `Generate eye color that fits this character:
- For cats: amber, green, blue, yellow, or heterochromia
- Consider their personality and species
- Can be descriptive: "bright amber", "deep emerald green"
- Make it memorable and fitting.`,
        
        hairColor: `Generate hair/fur color appropriate for this character:
- For cats: tabby patterns, solid colors, bi-color, calico
- Be specific: "orange tabby with white patches", "sleek black"
- Consider realistic colorations for their species
- Make it distinctive and vivid.`,
        
        hairStyle: `Generate hair style description:
- For cats: "short and sleek", "long and fluffy", "medium length"
- For humans: specific styles that match their personality
- Consider their lifestyle and maintenance ability
- Should reflect their character traits.`,
        
        skinTone: `Generate skin tone description:
- For cats: describe their underlying skin if visible
- For humans: use respectful, descriptive terms
- Consider their background and ethnicity
- Be natural and appropriate.`,
        
        physicalDescription: `Generate a comprehensive physical description highlighting:
- Overall appearance and presence
- Most distinctive physical features
- How they carry themselves
- Species-specific details (feline grace, human posture)
- What people notice first about them
- Paint a vivid picture in 2-3 sentences.`,
        
        distinguishingMarks: `Generate distinctive marks, scars, or features:
- For cats: unique markings, patterns, or features
- Scars with brief stories behind them
- Birthmarks or unusual colorations
- Features that make them instantly recognizable
- Should add personality and history.`,
        
        clothingStyle: `Generate clothing/style description:
- For cats: describe any collars, accessories, or adornments
- For humans: their typical fashion choices and style
- Consider their personality and social status
- Should reflect their character and role.`,
        
        bodyType: `Generate body type classification:
- For cats: "lean hunter", "stocky house cat", "graceful climber"
- Consider their lifestyle and genetics
- Should match their build and activities
- Be descriptive and specific.`,
        
        facialFeatures: `Generate distinctive facial features:
- For cats: face shape, ear size, whisker prominence
- Describe what makes their face memorable
- Consider expression and features that show personality
- Should capture their unique look.`,
        
        eyes: `Generate detailed eye description:
- Shape, size, and expression
- How they look at others
- Any distinctive qualities
- Should convey personality through their gaze.`,
        
        hair: `Generate detailed hair/fur description:
- Texture, thickness, condition
- How it moves or behaves
- Maintenance and styling
- Should add to their overall appearance.`,
        
        skin: `Generate skin description focusing on:
- Texture and condition
- Any notable characteristics
- How it reflects their lifestyle
- Should be appropriate for their species.`,
        
        complexion: `Generate complexion description:
- Overall skin appearance
- Health and vitality indicators
- Environmental effects (sun, weather)
- Should reflect their lifestyle and health.`,
        
        scars: `Generate scars with brief stories:
- Location and appearance of scars
- Hint at how they were acquired
- What they reveal about character's past
- Should add depth and history.`,
        
        tattoos: `Generate tattoos with meaning:
- Design and placement
- Personal significance or story
- Artistic style and quality
- Should reflect personality and values.`,
        
        piercings: `Generate piercings that fit the character:
- Type and location
- Style and materials
- When and why they got them
- Should match their personality.`,
        
        birthmarks: `Generate distinctive birthmarks:
- Unique shapes or patterns
- Location and size
- Any cultural or personal significance
- Should be memorable details.`,
        
        attire: `Generate current outfit description:
- What they're wearing right now
- Condition and style of clothing
- How it reflects their status/role
- Should paint a clear visual picture.`,
        
        accessories: `Generate accessories they typically wear:
- Jewelry, watches, bags, etc.
- Practical items they carry
- Sentimental pieces
- Should reflect personality and needs.`,
        
        posture: `Generate how they carry themselves:
- Standing and sitting posture
- Confidence level shown through body language
- Any distinctive ways they hold themselves
- Should reflect personality and background.`,
        
        gait: `Generate how they move and walk:
- Walking style and pace
- Any distinctive movement patterns
- Grace, awkwardness, or unique traits
- Should show personality through movement.`,
        
        gestures: `Generate distinctive hand and body gestures:
- Common hand movements while talking
- Nervous habits or confident displays
- Cultural or personal gesture patterns
- Should reveal personality traits.`,
        
        mannerisms: `Generate distinctive behavioral patterns:
- Repeated actions or habits
- Ways they react to situations
- Unconscious behaviors
- Should make them feel like a real person/character.`,

        // PERSONALITY SECTION - Detailed prompts for psychological depth
        personalityTraits: `Generate 3-5 distinctive personality traits for this character:
- For cats: curiosity, independence, playfulness, hunting instincts, territorial behavior
- Consider their background, role, and species
- Make traits specific and vivid, not generic
- Should create a unique personality profile
- Format as comma-separated list.`,
        
        temperament: `Generate this character's overall emotional disposition:
- How they typically react to situations
- Their default mood and energy level
- For cats: "curious and alert", "lazy and content", "nervous and skittish"
- Should reflect their life experiences and species.`,
        
        quirks: `Generate 2-3 unique behavioral quirks:
- Unusual habits or mannerisms
- For cats: head tilts when confused, kneading when happy, specific sleeping spots
- Should make the character memorable and distinctive
- Keep it species-appropriate and personality-based.`,
        
        speechPattern: `Generate how this character communicates:
- For cats: types of meows, purrs, chirps, body language
- For humans: accent, vocabulary level, speaking pace
- Unique speech habits or catchphrases
- Should reflect background and personality.`,
        
        likes: `Generate things this character enjoys:
- For cats: favorite foods, activities, sleeping spots, types of attention
- Should match their personality and species
- Be specific and detailed, not generic
- 3-4 concrete examples.`,
        
        dislikes: `Generate things this character avoids or hates:
- For cats: water, loud noises, certain textures, unwanted handling
- Should create potential conflict or character moments
- Be specific and meaningful to their experiences.`,
        
        hobbies: `Generate activities this character enjoys in their free time:
- For cats: hunting, exploring, sunbathing, playing with specific toys
- Should match their personality and available time
- Consider their species' natural behaviors.`,
        
        habits: `Generate daily routines or repeated behaviors:
- For cats: grooming schedule, patrol routes, meal expectations
- Both positive and negative habits
- Should feel realistic for their lifestyle and species.`,
        
        values: `Generate core principles this character believes in:
- What they consider important in life
- For cats: territory, family group, security, routine
- Should guide their decision-making and conflicts.`,
        
        beliefs: `Generate philosophical or spiritual beliefs:
- Their worldview and understanding of reality
- For cats: simple beliefs about safety, territory, pack dynamics
- Should influence their actions and relationships.`,

        // BACKGROUND SECTION - Detailed life history prompts
        background: `Generate a detailed backstory explaining this character's past:
- Key events that shaped them
- For cats: where they came from, how they met their humans, past homes
- Should explain their current personality and circumstances
- 2-3 sentences with specific details.`,
        
        childhood: `Generate this character's early life experiences:
- For cats: kittenhood experiences, early socialization, first home
- Formative events that shaped their adult personality
- Should connect to current traits and behaviors.`,
        
        education: `Generate learning experiences:
- For cats: what they learned from mother/siblings, training from humans
- Skills acquired through experience
- Should explain their current abilities and knowledge.`,
        
        family: `Generate family background and relationships:
- For cats: littermates, parents, human family members
- Current family dynamics and important relationships
- Should create emotional connections and potential story elements.`,
        
        pastEvents: `Generate significant events from their history:
- For cats: moving homes, accidents, memorable experiences
- Events that explain scars, fears, or particular behaviors
- Should add depth and story potential.`,

        // SKILLS & ABILITIES SECTION - Capabilities and talents
        skills: `Generate learned abilities this character has developed:
- For cats: hunting techniques, climbing skills, social skills with humans
- Training they've received or self-taught abilities
- Should match their background and lifestyle
- List 3-4 specific skills.`,
        
        abilities: `Generate special capabilities or powers:
- For cats: exceptional night vision, stealth abilities, sensing abilities
- Natural gifts enhanced beyond normal for their species
- Should feel authentic to their character concept.`,
        
        talents: `Generate natural gifts this character was born with:
- For cats: exceptional balance, keen hearing, emotional sensitivity
- Innate abilities separate from learned skills
- Should complement their personality and role.`,
        
        strengths: `Generate what this character excels at:
- Physical, mental, and social strengths
- For cats: agility, independence, observational skills
- Should create opportunities for them to shine in stories.`,
        
        weaknesses: `Generate areas where this character struggles:
- Physical limitations, blind spots, or vulnerabilities
- For cats: dependency on humans, territorial conflicts, health issues
- Should create realistic challenges and growth opportunities.`,

        // STORY ELEMENTS SECTION - Narrative-focused content
        goals: `Generate meaningful objectives this character wants to achieve:
- For cats: securing territory, maintaining family bonds, finding comfort
- Both short-term and long-term aspirations
- Should drive character actions and story progression.`,
        
        motivations: `Generate deep psychological drives:
- What compels this character to act
- For cats: survival instincts, pack loyalty, curiosity, comfort-seeking
- Should explain their decision-making patterns.`,
        
        fears: `Generate realistic anxieties and phobias:
- For cats: loud noises, water, unfamiliar places, separation from family
- Based on past experiences and species instincts
- Should create vulnerability and story conflict.`,
        
        secrets: `Generate hidden information about this character:
- Things they keep private or can't communicate
- For cats: secret hiding spots, past traumas, special knowledge
- Should add mystery and depth to their character.`,
        
        flaws: `Generate character defects that create internal conflict:
- For cats: stubbornness, territorial aggression, dependency issues
- Personality traits that cause problems
- Should create realistic character development opportunities.`,
        
        // APPEARANCE & PHYSICAL DETAILS
        physicalDescription: `Generate comprehensive physical description:
- Overall appearance and distinctive features  
- For cats: body type, fur patterns, facial features, movement style
- How others perceive them at first glance
- Paint a vivid picture in 2-3 sentences.`,
        
        distinguishingFeatures: `Generate unique physical characteristics:
- For cats: unusual markings, eye colors, ear shapes, tail characteristics
- Features that make them instantly recognizable
- Should be memorable and species-appropriate.`,

        // PSYCHOLOGY SECTION - Deep psychological analysis
        desires: `Generate deep wants and cravings:
- For cats: comfort, security, hunting opportunities, social bonds
- What they truly want at their core
- Should reflect their species' natural desires and personal experiences.`,

        needs: `Generate fundamental requirements:
- For cats: safety, food, territory, companionship, stimulation
- What they must have to feel whole and fulfilled
- Should be based on both species needs and character development.`,

        drives: `Generate internal forces that compel action:
- For cats: survival instincts, territorial behavior, pack loyalty, curiosity
- What pushes them forward even when afraid
- Should explain their most consistent behaviors.`,

        ambitions: `Generate long-term aspirations:
- For cats: perfect territory, strongest family bonds, ultimate comfort
- What they dream of achieving
- Should match their personality and capabilities.`,

        phobias: `Generate specific irrational fears:
- For cats: vacuum cleaners, thunderstorms, water, strangers
- Intense fears that don't make logical sense
- Should create vulnerability and story opportunities.`,

        anxieties: `Generate ongoing worries:
- For cats: family safety, territory security, food availability
- What keeps them alert and watchful
- Should reflect past experiences and instincts.`,

        insecurities: `Generate areas of self-doubt:
- For cats: ability to protect territory, worthiness of love, hunting skills
- Where they lack confidence despite abilities
- Should create character depth and growth opportunities.`,

        shame: `Generate things they're ashamed of:
- For cats: failed hunts, accidents, moments of cowardice
- Actions or traits they wish they could hide
- Should create internal conflict and character development.`,

        guilt: `Generate things they feel guilty about:
- For cats: breaking household rules, causing worry, territorial disputes
- Actions they regret and can't undo
- Should create emotional weight and motivation.`,

        regrets: `Generate missed opportunities or wrong choices:
- For cats: relationships lost, chances not taken, conflicts created
- Things they wish they had done differently
- Should add depth and explain current behaviors.`,

        trauma: `Generate past emotional wounds:
- For cats: abandonment, abuse, loss of family, territorial violations
- Deep hurts that still affect them
- Should explain fears, behaviors, and defensive mechanisms.`,

        wounds: `Generate specific emotional injuries:
- For cats: betrayal by trusted humans, loss of littermates, territorial defeat
- Precise emotional damage from past events
- Should create ongoing character challenges.`,

        copingMechanisms: `Generate how they handle stress:
- For cats: hiding, grooming, seeking comfort, territorial marking
- Healthy and unhealthy ways they deal with difficulty
- Should reflect species behaviors and learned responses.`,

        defenses: `Generate emotional protection strategies:
- For cats: withdrawal, aggression, submission, charm
- How they protect themselves from emotional pain
- Should explain their social interaction patterns.`,

        vulnerabilities: `Generate emotional weak points:
- For cats: family threats, territory loss, abandonment fears
- What can hurt them most deeply
- Should create story tension and character stakes.`,

        blindSpots: `Generate things they can't see about themselves:
- For cats: how dependent they are, their own territorial aggression
- Personal truths they're unaware of
- Should create opportunities for character growth.`,

        mentalHealth: `Generate psychological well-being status:
- For cats: generally stable, anxious, traumatized, resilient
- Their overall mental state and stability
- Should reflect their experiences and current situation.`,

        emotionalState: `Generate current emotional condition:
- For cats: content, anxious, playful, protective, grieving
- How they're feeling right now
- Should match their recent experiences and environment.`,

        maturityLevel: `Generate emotional development level:
- For cats: kitten-like, adolescent, mature, wise elder
- How emotionally developed they are
- Should affect their decision-making and relationships.`,

        intelligenceType: `Generate how they are smart:
- For cats: emotional intelligence, spatial awareness, social cunning
- Their particular type of intelligence
- Should match their species and individual traits.`,

        learningStyle: `Generate how they process information:
- For cats: observation, trial and error, social learning, instinct
- How they best learn new things
- Should reflect their species and personality.`,

        // BACKGROUND SECTION - Extended life history
        backstory: `Generate comprehensive life story:
- For cats: origin, key experiences, how they came to current situation
- Complete narrative of their past
- Should explain their current personality and circumstances
- 3-4 sentences with specific, meaningful details.`,

        origin: `Generate where they come from:
- For cats: born in shelter, found as stray, bred by humans, feral beginnings
- Their earliest origins and how they entered the world
- Should explain their initial life circumstances.`,

        upbringing: `Generate how they were raised:
- For cats: socialized with humans, raised by mother cat, hand-reared
- The care and training they received early in life
- Should explain their social skills and attachments.`,

        familyHistory: `Generate family background:
- For cats: lineage of familiars, street cat ancestry, purebred heritage
- Their family's history and characteristics
- Should explain inherited traits and family patterns.`,

        socialClass: `Generate their social position:
- For cats: pampered house cat, working barn cat, street survivor
- Their status within their social environment
- Should affect their attitudes and expectations.`,

        economicStatus: `Generate their material situation:
- For cats: well-provided, comfortable, struggling, abandoned
- Their access to resources and security
- Should influence their behavior and priorities.`,

        academicHistory: `Generate formal learning experiences:
- For cats: training from elder cats, human instruction, self-taught skills
- Their educational background and achievements
- Should explain their knowledge and capabilities.`,

        formativeEvents: `Generate key shaping experiences:
- For cats: first hunt, territory establishment, family bonding, threats faced
- Events that made them who they are today
- Should connect to their current traits and behaviors.`,

        lifeChangingMoments: `Generate pivotal experiences:
- For cats: adoption, loss of family, territorial victory, survival crisis
- Moments that completely altered their life path
- Should explain major personality or circumstance changes.`,

        personalStruggle: `Generate major challenges faced:
- For cats: surviving abandonment, protecting territory, overcoming trauma
- Significant difficulties they've had to overcome
- Should demonstrate their resilience and growth.`,

        challenges: `Generate obstacles overcome:
- For cats: predators, rival cats, environmental dangers, human conflicts
- Difficulties they've successfully navigated
- Should show their problem-solving and adaptability.`,

        achievements: `Generate notable accomplishments:
- For cats: territory secured, family protected, skills mastered, bonds formed
- Things they've successfully achieved
- Should demonstrate their capabilities and growth.`,

        failures: `Generate significant setbacks:
- For cats: failed hunts, lost territory, broken relationships, survival mistakes
- Important things they failed at or lost
- Should add realism and explain current motivations.`,

        losses: `Generate important things lost:
- For cats: family members, territory, human companions, security
- Meaningful losses they've experienced
- Should explain grief, protective behaviors, or attachment patterns.`,

        victories: `Generate major triumphs:
- For cats: territorial victories, successful rescues, skill mastery, bond formation
- Their greatest successes and wins
- Should show their capabilities and what they value.`,

        reputation: `Generate how others see them:
- For cats: known as protector, trickster, wise elder, troublemaker
- Their standing in their community
- Should reflect their actions and personality impact.`,

        // ABILITIES SECTION - Extended capabilities
        specialAbilities: `Generate unique powers or exceptional skills:
- For cats: enhanced senses, supernatural luck, empathic abilities, magical talent
- Abilities that set them apart from others of their species
- Should feel natural to their character concept.`,

        powers: `Generate supernatural capabilities:
- For cats: telepathy with humans, precognition, phase-shifting, elemental control
- Extraordinary abilities beyond normal species traits
- Should match the story's magical or sci-fi elements.`,

        magicalAbilities: `Generate specific magical powers:
- For cats: familiar magic, protective wards, healing purrs, dimensional sight
- Concrete magical skills they can use
- Should have clear applications and limitations.`,

        magicType: `Generate their magic classification:
- For cats: Familiar Magic, Protective Magic, Elemental Magic, Spirit Magic
- The category or school of their magical abilities
- Should define their magical style and approach.`,

        magicSource: `Generate where their magic comes from:
- For cats: ancestral bloodline, bond with wizard, mystical artifact, natural gift
- The origin and foundation of their magical power
- Should explain why they have these abilities.`,

        magicLimitations: `Generate magical restrictions:
- For cats: tied to emotions, requires energy, limited by range, needs catalyst
- What limits or constrains their magical abilities
- Should create balance and story tension.`,

        superpowers: `Generate superhuman abilities:
- For cats: super speed, enhanced strength, invisibility, time manipulation
- Powers that exceed normal physical limitations
- Should fit the story's power level and genre.`,

        competencies: `Generate areas of excellence:
- For cats: hunting, stealth, social manipulation, territory defense
- Fields where they consistently perform well
- Should reflect their training and natural abilities.`,

        training: `Generate formal instruction received:
- For cats: elder cat mentorship, human training, survival education, magical instruction
- Structured learning they've undergone
- Should explain their organized skill development.`,

        experience: `Generate practical knowledge gained:
- For cats: street survival, household management, territory conflicts, crisis response
- Real-world experience that taught them skills
- Should explain their practical wisdom and capabilities.`,

        // STORY SECTION - Extended narrative elements
        objectives: `Generate specific targets:
- For cats: secure perfect territory, protect all family, master hunting skills
- Concrete, measurable goals they're working toward
- Should be more specific than general goals.`,

        wants: `Generate immediate desires:
- For cats: warm sunbeam, favorite treat, family attention, territory expansion
- What they want right now or in the near future
- Should be more immediate than long-term goals.`,

        obstacles: `Generate barriers to success:
- For cats: rival cats, dangerous predators, human conflicts, environmental hazards
- What stands between them and their goals
- Should create story conflict and tension.`,

        conflicts: `Generate internal and external struggles:
- For cats: independence vs. dependency, safety vs. curiosity, territory vs. family
- Competing desires or external opposition
- Should drive character development and plot.`,

        conflictSources: `Generate origins of their struggles:
- For cats: past trauma, species instincts, territorial disputes, family bonds
- Where their conflicts come from
- Should explain the roots of their challenges.`,

        stakes: `Generate what they stand to lose or gain:
- For cats: family safety, territory security, personal freedom, survival itself
- The consequences of success or failure
- Should create urgency and importance.`,

        consequences: `Generate results of failure:
- For cats: loss of territory, family harm, starvation, abandonment
- What happens if they don't succeed
- Should create tension and motivation.`,

        journey: `Generate their path through the story:
- For cats: from fearful to confident, isolated to bonded, dependent to independent
- How they move through the narrative
- Should show character development progression.`,

        transformation: `Generate how they change:
- For cats: overcome fears, develop new skills, form deeper bonds, accept responsibility
- The fundamental ways they're different by story's end
- Should represent meaningful character growth.`,

        growth: `Generate their development process:
- For cats: learning to trust, developing confidence, mastering abilities, embracing role
- How they mature and evolve
- Should show realistic character progression.`,

        connectionToEvents: `Generate how they relate to plot:
- For cats: catalyst for adventure, key to resolution, emotional heart, protective force
- Their specific connection to story events
- Should justify their inclusion in the narrative.`,

        plotRelevance: `Generate their story importance:
- For cats: saves the day, provides crucial information, emotional anchor, comic relief
- Why they matter to the main plot
- Should establish their narrative necessity.`,

        nativeLanguage: `Generate their primary communication:
- For cats: feline body language, specific meow patterns, purr frequencies
- Their first and most natural form of communication
- Should reflect their species and origin.`,

        accent: `Generate their speech characteristics:
- For cats: particular vocal tones, regional meow patterns, volume tendencies
- How their communication sounds distinctive
- Should reflect their background and personality.`,

        dialect: `Generate specific communication patterns:
- For cats: household vs. street cat communication, formal vs. casual interaction
- Their particular way of expressing themselves
- Should show their social background.`,

        voiceDescription: `Generate how they sound:
- For cats: melodic purr, raspy meow, chirping trill, silent communication
- The quality and character of their vocalizations
- Should match their personality and physical traits.`,

        speechPatterns: `Generate their communication style:
- For cats: frequent chirping, demand meowing, gentle purring, body language emphasis
- How they typically communicate
- Should reflect their relationship style and needs.`,

        vocabulary: `Generate their communication range:
- For cats: extensive meow vocabulary, body language fluency, scent marking
- The breadth and sophistication of their communication
- Should reflect their intelligence and social experience.`,

        catchphrases: `Generate repeated expressions:
- For cats: specific meow sounds, particular chirps, signature purrs
- Characteristic sounds or behaviors they often repeat
- Should be memorable and personality-appropriate.`,

        slang: `Generate informal communication:
- For cats: playful sounds, casual body language, relaxed postures
- How they communicate in comfortable, informal situations
- Should show their personality when relaxed.`,

        communicationStyle: `Generate interaction approach:
- For cats: direct and demanding, gentle and subtle, playful and engaging
- How they approach communication with others
- Should reflect their personality and social skills.`,

        parents: `Generate information about their parents:
- For cats: mother's temperament, father's traits, parental care received
- Details about their biological or adoptive parents
- Should explain inherited traits and early influences.`,

        siblings: `Generate brothers and sisters:
- For cats: littermates, adopted siblings, competitive or supportive relationships
- Their relationships with other young in their family
- Should explain social skills and family dynamics.`,

        spouse: `Generate life partner:
- For cats: bonded mate, companion cat, territorial partner
- Their committed relationship partner if any
- Should reflect their social and emotional maturity.`,

        children: `Generate offspring:
- For cats: kittens raised, young mentored, protective instincts
- Their parental relationships and responsibilities
- Should show their nurturing and protective sides.`,

        friends: `Generate close personal relationships:
- For cats: trusted companions, play partners, mutual protectors
- Their chosen close relationships
- Should reflect their social skills and loyalty.`,

        socialCircle: `Generate broader social network:
- For cats: neighborhood cats, household animals, regular contacts
- Their wider community of relationships
- Should show their social integration and influence.`,

        community: `Generate the group they belong to:
- For cats: household family, neighborhood cats, cat colony
- Their broader social and territorial community
- Should explain their social context and responsibilities.`,

        culture: `Generate cultural background:
- For cats: house cat culture, feral culture, mixed background
- The cultural environment that shaped them
- Should explain their values and social behaviors.`,

        traditions: `Generate customs they follow:
- For cats: territorial rituals, family bonding practices, seasonal behaviors
- Regular practices that connect them to their community
- Should show their social integration and values.`,

        customs: `Generate social practices they observe:
- For cats: greeting rituals, sharing behaviors, hierarchy respect
- Social rules and practices they follow
- Should demonstrate their social awareness and respect.`,

        religion: `Generate spiritual beliefs:
- For cats: natural spirituality, protective spirits, ancestor reverence
- Their understanding of the spiritual world
- Should reflect their species' natural mysticism.`,

        spirituality: `Generate spiritual practices:
- For cats: meditation in sunbeams, territorial blessing, ancestor honoring
- How they connect with the spiritual realm
- Should feel natural to their character and species.`,

        politicalViews: `Generate stance on authority and power:
- For cats: independent but loyal, respectful of territory, protective of community
- Their attitude toward leadership and social structures
- Should reflect their personality and experiences.`,
      };

      const specificPrompt = fieldSpecificPrompts[fieldKey] || `Generate appropriate ${fieldLabel.toLowerCase()} content for this character.`;

      prompt = `You are a professional character development expert. ${specificPrompt}

CHARACTER CONTEXT:
${characterContext}

CURRENT VALUE: ${currentValue || 'empty'}
${currentValue ? 'Improve or replace the current value with something better.' : 'Generate new content.'}

CRITICAL INSTRUCTIONS:
- Analyze ALL character information carefully
- Generate content specific to the ${fieldLabel} field
- Make it contextually relevant to this character's established traits
- For animal characters, use species-appropriate details
- If content already exists, generate something DIFFERENT for variety
- Use random variation (${Math.random().toString(36).substring(7)}) to ensure uniqueness
- Keep responses concise but meaningful
- RESPOND WITH ONLY THE CONTENT - no explanations or quotes

Generate ${fieldLabel.toLowerCase()}:`;
    }

    console.log(`Generating content for field: ${fieldKey}`);
    
    // Only record individual field requests for rate limiting
    if (isIndividualRequest) {
      recordFieldRequest();
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        temperature: 0.95, // Higher creativity for more varied responses
        maxOutputTokens: 300, // More tokens for detailed responses
        candidateCount: 1
      },
      contents: prompt,
    });

    const generatedContent = response.text?.trim() || '';
    console.log(`Generated content for ${fieldKey}: ${generatedContent || 'EMPTY RESPONSE FROM AI'}`);
    
    // Enhanced error handling - if AI returns empty, log the prompt to debug
    if (!generatedContent) {
      console.log(`AI returned empty response for ${fieldKey}. Prompt was:`, prompt.substring(0, 200) + '...');
    }

    if (!generatedContent) {
      console.log(`Empty response from AI for field ${fieldKey}, analyzing character for intelligent fallback`);
      
      // Intelligent contextual fallbacks that actually read character data
      let fallbackContent = `Generated ${fieldLabel}`;
      
      if (fieldKey === 'race') {
        // Smart race detection from character data
        const name = (character.name || '').toLowerCase();
        const desc = (character.description || '').toLowerCase();
        const background = (character.background || '').toLowerCase();
        const allText = `${name} ${desc} ${background}`.toLowerCase();
        
        if (name.includes('beans') || allText.includes('cat') || allText.includes('feline')) {
          fallbackContent = 'Cat';
        } else if (allText.includes('dog') || allText.includes('canine')) {
          fallbackContent = 'Dog';
        } else if (allText.includes('elf') || allText.includes('elven')) {
          fallbackContent = 'Elf';
        } else if (allText.includes('dwarf') || allText.includes('dwarven')) {
          fallbackContent = 'Dwarf';
        } else if (allText.includes('dragon')) {
          fallbackContent = 'Dragon';
        } else {
          fallbackContent = 'Human'; // Only default to human if no other clues
        }
      } else if (fieldKey === 'role' && isDropdownField) {
        // Smart role selection from dropdown options
        const name = (character.name || '').toLowerCase();
        const desc = (character.description || '').toLowerCase();
        const background = (character.background || '').toLowerCase();
        const allText = `${name} ${desc} ${background}`.toLowerCase();
        
        if (allText.includes('cat') || allText.includes('funny') || allText.includes('cute')) {
          fallbackContent = fieldOptions && fieldOptions.includes('Comic Relief') ? 'Comic Relief' : 'Supporting Character';
        } else if (allText.includes('hero') || allText.includes('main')) {
          fallbackContent = 'Protagonist';
        } else if (allText.includes('villain') || allText.includes('evil')) {
          fallbackContent = 'Antagonist';
        } else if (allText.includes('mentor') || allText.includes('teacher')) {
          fallbackContent = 'Mentor';
        } else {
          fallbackContent = 'Supporting Character'; // Default for dropdown
        }
      } else {
        // Enhanced contextual fallbacks that analyze character data intelligently
        // Add variety by using random selection and dynamic generation
        const randomSeed = Math.random();
        const contextualFallbacks: { [key: string]: string } = {
          // IDENTITY SECTION INTELLIGENT FALLBACKS
          name: (() => {
            if (character.race === 'Cat' || character.name?.toLowerCase() === 'beans') {
              const catNames = ['Whiskers', 'Shadow', 'Luna', 'Mochi', 'Pixel', 'Nova', 'Sage', 'Ash'];
              return catNames[Math.floor(randomSeed * catNames.length)];
            }
            if (character.race) {
              const humanNames = ['Alex Morgan', 'Jordan Blake', 'Casey Rivers', 'Riley Stone'];
              const fantasyNames = ['Wanderer', 'Seeker', 'Traveler', 'Keeper'];
              return character.race === 'Human' ? 
                humanNames[Math.floor(randomSeed * humanNames.length)] : 
                `${character.race} ${fantasyNames[Math.floor(randomSeed * fantasyNames.length)]}`;
            }
            const genericNames = ['Character Name', 'Unknown Hero', 'The Stranger', 'Nameless One'];
            return genericNames[Math.floor(randomSeed * genericNames.length)];
          })(),
          
          nicknames: (() => {
            if (character.race === 'Cat' || character.name?.toLowerCase() === 'beans') {
              const catNicknameSets = [
                'Kitty, Whiskers, Little One',
                'Bean, Beanie, Sweetie',
                'Furball, Paws, Cutie',
                'Shadow, Ninja, Sneaky',
                'Fluffy, Softie, Snuggles'
              ];
              return catNicknameSets[Math.floor(randomSeed * catNicknameSets.length)];
            }
            if (character.name) {
              const firstName = character.name.split(' ')[0];
              const endings = ['Buddy, Friend', 'Ace, Champ', 'Star, Hero', 'Chief, Boss'];
              return `${firstName.substring(0, 3) || firstName}, ${endings[Math.floor(randomSeed * endings.length)]}`;
            }
            const genericSets = ['Pal, Friend, Buddy', 'Ace, Champ, Hero', 'Star, Chief, Boss'];
            return genericSets[Math.floor(randomSeed * genericSets.length)];
          })(),
          
          title: (() => {
            if (character.race === 'Cat') return 'Sir Whiskers';
            if (character.class?.toLowerCase().includes('mage')) return 'The Wise';
            if (character.class?.toLowerCase().includes('warrior')) return 'The Brave';
            if (character.profession) return `The ${character.profession}`;
            return 'The Wanderer';
          })(),
          
          aliases: (() => {
            if (character.race === 'Cat') return 'Shadow Paws, Night Hunter';
            if (character.class?.toLowerCase().includes('rogue')) return 'Silent Blade, Shadow Walker';
            if (character.name) return `The ${character.name.split(' ')[0]}, Mystery Person`;
            return 'The Stranger, Unknown One';
          })(),
          
          role: (() => {
            if (character.race === 'Cat') return 'Companion';
            if (character.name?.toLowerCase().includes('hero') || character.class?.toLowerCase().includes('warrior')) return 'Protagonist';
            if (character.background?.toLowerCase().includes('evil') || character.class?.toLowerCase().includes('dark')) return 'Antagonist';
            return 'Supporting Character';
          })(),
          
          race: (() => {
            const name = (character.name || '').toLowerCase();
            const background = (character.background || '').toLowerCase();
            const desc = (character.description || '').toLowerCase();
            const allText = `${name} ${background} ${desc}`;
            
            if (name === 'beans' || allText.includes('cat') || allText.includes('feline')) return 'Cat';
            if (allText.includes('elf')) return 'Elf';
            if (allText.includes('dwarf')) return 'Dwarf';
            if (allText.includes('dragon')) return 'Dragon';
            return 'Human';
          })(),
          
          ethnicity: (() => {
            if (character.race === 'Cat') return 'Domestic Shorthair';
            if (character.race === 'Elf') return 'Wood Elf';
            if (character.race === 'Dwarf') return 'Mountain Dwarf';
            return 'Mixed Heritage';
          })(),
          
          age: (() => {
            if (character.race === 'Cat') return '3 years old';
            if (character.role?.toLowerCase().includes('mentor')) return '55';
            if (character.class?.toLowerCase().includes('young') || character.background?.toLowerCase().includes('student')) return '19';
            return '27';
          })(),
          
          birthdate: (() => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const month = months[Math.floor(Math.random() * 12)];
            const day = Math.floor(Math.random() * 28) + 1;
            const year = character.race === 'Cat' ? 'Spring of 2021' : `${month} ${day}, 1995`;
            return year;
          })(),
          
          zodiacSign: (() => {
            if (character.race === 'Cat') return 'Leo (playful and confident)';
            const signs = ['Aries (bold)', 'Taurus (steady)', 'Gemini (curious)', 'Cancer (caring)', 'Leo (confident)', 'Virgo (precise)', 'Libra (balanced)', 'Scorpio (intense)', 'Sagittarius (adventurous)', 'Capricorn (determined)', 'Aquarius (independent)', 'Pisces (intuitive)'];
            return signs[Math.floor(Math.random() * signs.length)];
          })(),
          
          class: (() => {
            if (character.race === 'Cat') return 'Familiar';
            if (character.background?.toLowerCase().includes('fight') || character.role?.toLowerCase().includes('warrior')) return 'Warrior';
            if (character.background?.toLowerCase().includes('magic') || character.role?.toLowerCase().includes('mage')) return 'Mage';
            if (character.background?.toLowerCase().includes('sneak') || character.role?.toLowerCase().includes('thief')) return 'Rogue';
            return 'Adventurer';
          })(),
          
          profession: (() => {
            if (character.race === 'Cat') return 'House Guardian';
            if (character.class === 'Warrior') return 'Town Guard';
            if (character.class === 'Mage') return 'Court Wizard';
            if (character.class === 'Rogue') return 'Information Broker';
            return 'Traveling Merchant';
          })(),
          
          occupation: (() => {
            if (character.race === 'Cat') return 'Professional Napper and Mouse Hunter';
            if (character.profession) return character.profession;
            if (character.class) return `Working ${character.class}`;
            return 'Jack of All Trades';
          })(),
          
          // PHYSICAL/APPEARANCE SECTION INTELLIGENT FALLBACKS
          height: (() => {
            if (character.race === 'Cat') return '11 inches at shoulder';
            if (character.build?.toLowerCase().includes('tall')) return '6\'1"';
            if (character.build?.toLowerCase().includes('short')) return '5\'4"';
            return '5\'8"';
          })(),
          
          weight: (() => {
            if (character.race === 'Cat') return '10 pounds';
            if (character.build?.toLowerCase().includes('muscular')) return 'Muscular build, 180 lbs';
            if (character.build?.toLowerCase().includes('slim')) return 'Lean build, 140 lbs';
            return 'Average build, 160 lbs';
          })(),
          
          build: (() => {
            if (character.race === 'Cat') return 'Sleek and agile feline build with graceful movements';
            if (character.class?.toLowerCase().includes('warrior')) return 'Muscular and athletic from training';
            if (character.class?.toLowerCase().includes('mage')) return 'Lean and scholarly build';
            return 'Well-proportioned and healthy';
          })(),
          
          eyeColor: (() => {
            if (character.race === 'Cat') return 'Bright amber with golden flecks';
            const colors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray'];
            return colors[Math.floor(Math.random() * colors.length)];
          })(),
          
          hairColor: (() => {
            if (character.race === 'Cat') return 'Orange tabby with white chest patch';
            const colors = ['Brown', 'Black', 'Blonde', 'Auburn', 'Dark Brown'];
            return colors[Math.floor(Math.random() * colors.length)];
          })(),
          
          hairStyle: (() => {
            if (character.race === 'Cat') return 'Short, soft fur that\'s well-groomed';
            if (character.class?.toLowerCase().includes('warrior')) return 'Practical, short cut';
            if (character.class?.toLowerCase().includes('noble')) return 'Elegant, well-styled';
            return 'Medium length, casually styled';
          })(),
          
          skinTone: (() => {
            if (character.race === 'Cat') return 'Pink skin beneath fur';
            const tones = ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Dark'];
            return tones[Math.floor(Math.random() * tones.length)];
          })(),
          
          physicalDescription: (() => {
            if (character.race === 'Cat') return 'A charming cat with bright, intelligent eyes and a graceful demeanor. Their sleek form moves with natural feline elegance, and their expressive face shows remarkable intelligence and curiosity.';
            return 'A well-proportioned individual with an approachable demeanor and confident bearing. Their expressive features and steady gaze suggest both intelligence and reliability.';
          })(),
          
          distinguishingMarks: (() => {
            if (character.race === 'Cat') return 'Unique white marking on forehead resembling a small star';
            const marks = ['Small scar above left eyebrow', 'Distinctive birthmark on left shoulder', 'Faint freckles across the nose', 'Small mole on right cheek'];
            return marks[Math.floor(Math.random() * marks.length)];
          })(),
          
          clothingStyle: (() => {
            if (character.race === 'Cat') return 'Simple leather collar with a small bell';
            if (character.class?.toLowerCase().includes('noble')) return 'Fine fabrics and elegant cuts in rich colors';
            if (character.class?.toLowerCase().includes('warrior')) return 'Practical, durable clothing suited for action';
            return 'Comfortable, practical clothing in earth tones';
          })(),
          
          bodyType: (() => {
            if (character.race === 'Cat') return 'Typical domestic cat build - lithe and agile';
            if (character.build?.toLowerCase().includes('athletic')) return 'Mesomorphic - naturally athletic';
            return 'Balanced build with good proportions';
          })(),
          
          facialFeatures: (() => {
            if (character.race === 'Cat') return 'Heart-shaped face with large, expressive eyes and prominent whiskers';
            return 'Well-defined features with an open, honest expression';
          })(),
          
          eyes: (() => {
            if (character.race === 'Cat') return 'Large, round eyes that seem to see everything';
            return 'Expressive eyes that reflect their inner thoughts';
          })(),
          
          hair: (() => {
            if (character.race === 'Cat') return 'Soft, dense fur with natural oils for healthy shine';
            return 'Healthy hair with natural body and shine';
          })(),
          
          skin: (() => {
            if (character.race === 'Cat') return 'Healthy pink skin beneath soft fur';
            return 'Clear, healthy skin with good tone';
          })(),
          
          complexion: (() => {
            if (character.race === 'Cat') return 'Healthy and well-maintained';
            return 'Clear complexion with natural warmth';
          })(),
          
          scars: (() => {
            if (character.race === 'Cat') return 'Small scar on left ear from a childhood accident';
            if (character.class?.toLowerCase().includes('warrior')) return 'Battle scar across knuckles from training';
            return 'No significant scars';
          })(),
          
          tattoos: (() => {
            if (character.race === 'Cat') return 'No tattoos (fur covered)';
            if (character.background?.toLowerCase().includes('sailor')) return 'Anchor tattoo on forearm';
            return 'No tattoos';
          })(),
          
          piercings: (() => {
            if (character.race === 'Cat') return 'No piercings';
            return 'Simple ear piercings';
          })(),
          
          birthmarks: (() => {
            if (character.race === 'Cat') return 'Unique fur pattern on belly';
            return 'Small birthmark behind right ear';
          })(),
          
          attire: (() => {
            if (character.race === 'Cat') return 'Wearing a comfortable leather collar with identification tag';
            return 'Currently dressed in practical, well-maintained clothing';
          })(),
          
          accessories: (() => {
            if (character.race === 'Cat') return 'Collar with small bell and ID tag';
            return 'Simple, practical accessories';
          })(),
          
          posture: (() => {
            if (character.race === 'Cat') return 'Alert and poised, with natural feline grace';
            return 'Confident posture with relaxed shoulders';
          })(),
          
          gait: (() => {
            if (character.race === 'Cat') return 'Silent, graceful movement with perfect balance';
            return 'Steady, purposeful walk with good balance';
          })(),
          
          gestures: (() => {
            if (character.race === 'Cat') return 'Expressive tail movements and head tilts';
            return 'Natural, understated hand gestures when speaking';
          })(),
          
          mannerisms: (() => {
            if (character.race === 'Cat') return 'Head tilts when curious, slow blinks when content, kneading with paws when happy';
            return 'Thoughtful pausing before speaking, gentle nods when listening';
          })(),

          // PERSONALITY SECTION INTELLIGENT FALLBACKS
          personalityTraits: (() => {
            if (character.race === 'Cat') {
              const catTraitSets = [
                'Curious, Independent, Playful, Affectionate',
                'Alert, Territorial, Loyal, Mischievous', 
                'Calm, Observant, Social, Protective',
                'Energetic, Clever, Friendly, Adventurous'
              ];
              return catTraitSets[Math.floor(randomSeed * catTraitSets.length)];
            }
            const humanTraitSets = [
              'Determined, Compassionate, Analytical, Loyal',
              'Creative, Outgoing, Practical, Honest',
              'Thoughtful, Brave, Empathetic, Resourceful'
            ];
            return humanTraitSets[Math.floor(randomSeed * humanTraitSets.length)];
          })(),
          
          temperament: (() => {
            if (character.race === 'Cat') {
              const catTemps = ['Curious and alert', 'Calm and content', 'Playful and energetic', 'Independent and observant'];
              return catTemps[Math.floor(randomSeed * catTemps.length)];
            }
            const humanTemps = ['Even-tempered and thoughtful', 'Optimistic and energetic', 'Calm and analytical'];
            return humanTemps[Math.floor(randomSeed * humanTemps.length)];
          })(),
          
          quirks: (() => {
            if (character.race === 'Cat') {
              const catQuirks = [
                'Chirps when excited, sleeps in sunbeams, brings "gifts"',
                'Head tilts when confused, kneads soft surfaces, chatters at birds',
                'Slow blinks to show affection, hides in boxes, patrol routine'
              ];
              return catQuirks[Math.floor(randomSeed * catQuirks.length)];
            }
            return 'Drums fingers when thinking, hums while working, organizes everything';
          })(),
          
          likes: (() => {
            if (character.race === 'Cat') {
              const catLikes = [
                'Sunny windowsills, gentle chin scratches, fresh catnip, warm laps',
                'High perches, tuna treats, cardboard boxes, morning routines',
                'Quiet corners, feather toys, gentle brushing, evening playtime'
              ];
              return catLikes[Math.floor(randomSeed * catLikes.length)];
            }
            return 'Good books, morning coffee, peaceful walks, meaningful conversations';
          })(),
          
          dislikes: (() => {
            if (character.race === 'Cat') {
              const catDislikes = [
                'Loud noises, water, unfamiliar scents, rough handling',
                'Closed doors, empty food bowls, vacuum cleaners, car rides',
                'Sudden movements, citrus smells, being ignored, schedule changes'
              ];
              return catDislikes[Math.floor(randomSeed * catDislikes.length)];
            }
            return 'Dishonesty, rushed decisions, loud environments, wasted time';
          })(),

          // BACKGROUND SECTION INTELLIGENT FALLBACKS  
          background: (() => {
            if (character.race === 'Cat') {
              const catBackgrounds = [
                'Found as a kitten and raised in a loving home, learned to trust humans through patient care and consistent routines.',
                'Born in a shelter and adopted young, developed strong bonds with adoptive family and learned house rules quickly.',
                'Rescued from the streets and slowly learned to feel safe indoors, now enjoys the security of home life.'
              ];
              return catBackgrounds[Math.floor(randomSeed * catBackgrounds.length)];
            }
            return 'Grew up in a supportive family environment, received good education, and developed strong moral values through life experiences.';
          })(),
          
          goals: (() => {
            if (character.race === 'Cat') {
              const catGoals = [
                'Maintain territory security, keep family safe, find perfect napping spots',
                'Master the art of getting treats, protect the household, enjoy daily comforts',
                'Explore every corner of the house, maintain hunting skills, strengthen family bonds'
              ];
              return catGoals[Math.floor(randomSeed * catGoals.length)];
            }
            return 'Build meaningful relationships, contribute to community, achieve personal growth';
          })(),
          
          motivations: (() => {
            if (character.race === 'Cat') {
              const catMotivations = [
                'Security and comfort, family loyalty, natural curiosity',
                'Survival instincts, pack bonding, territorial protection',
                'Food security, social connection, environmental mastery'
              ];
              return catMotivations[Math.floor(randomSeed * catMotivations.length)];
            }
            return 'Desire to help others, personal fulfillment, creating lasting impact';
          })(),
          
          fears: (() => {
            if (character.race === 'Cat') {
              const catFears = [
                'Loud sudden noises, being separated from family, unfamiliar environments',
                'Water, large predators, empty food bowls, abandonment',
                'Vet visits, car rides, aggressive animals, loss of territory'
              ];
              return catFears[Math.floor(randomSeed * catFears.length)];
            }
            return 'Failure to protect loved ones, losing important relationships, making wrong decisions';
          })(),

          // SKILLS & ABILITIES FALLBACKS
          skills: (() => {
            if (character.race === 'Cat') {
              const catSkills = [
                'Expert hunter, silent stalking, acrobatic climbing, reading human emotions',
                'Stealth movement, keen observation, social manipulation, territory mapping',
                'Precise jumping, scent tracking, vocal communication, comfort detection'
              ];
              return catSkills[Math.floor(randomSeed * catSkills.length)];
            }
            return 'Problem solving, communication, adaptability, teamwork';
          })(),
          
          abilities: (() => {
            if (character.race === 'Cat') {
              const catAbilities = [
                'Enhanced night vision, superior balance, acute hearing, emotional sensing',
                'Lightning reflexes, flexible spine, whisker navigation, temperature detection',
                'Silent movement, scent memory, territorial awareness, intuitive timing'
              ];
              return catAbilities[Math.floor(randomSeed * catAbilities.length)];
            }
            return 'Quick learning, pattern recognition, strategic thinking, leadership potential';
          })(),
          
          flaws: (() => {
            if (character.race === 'Cat') {
              const catFlaws = [
                'Stubbornness, territorial jealousy, dependency on routine',
                'Prideful independence, fear of change, resource guarding',
                'Attention-seeking behavior, selective hearing, curiosity risks'
              ];
              return catFlaws[Math.floor(randomSeed * catFlaws.length)];
            }
            return 'Overthinking decisions, self-doubt in new situations, perfectionist tendencies';
          })(),

          // PSYCHOLOGY SECTION FALLBACKS
          desires: (() => {
            if (character.race === 'Cat') {
              const catDesires = [
                'Perfect sunny windowsill, endless treats, family safety, territory mastery',
                'Comfortable routine, hunting success, human attention, peaceful sleep',
                'Adventure opportunities, social bonds, environmental control, abundant resources'
              ];
              return catDesires[Math.floor(randomSeed * catDesires.length)];
            }
            return 'Personal fulfillment, meaningful relationships, security, achievement';
          })(),

          needs: (() => {
            if (character.race === 'Cat') {
              const catNeeds = [
                'Safety, food security, territory, family bonds, mental stimulation',
                'Routine, comfort, respect, hunting opportunities, social connection',
                'Freedom, protection, resources, acknowledgment, play time'
              ];
              return catNeeds[Math.floor(randomSeed * catNeeds.length)];
            }
            return 'Love, purpose, security, growth, autonomy';
          })(),

          drives: (() => {
            if (character.race === 'Cat') {
              const catDrives = [
                'Survival instinct, territorial protection, family loyalty, curiosity',
                'Security seeking, comfort pursuit, dominance assertion, social bonding',
                'Resource acquisition, danger avoidance, relationship maintenance, exploration'
              ];
              return catDrives[Math.floor(randomSeed * catDrives.length)];
            }
            return 'Achievement, connection, growth, contribution, survival';
          })(),

          ambitions: (() => {
            if (character.race === 'Cat') {
              const catAmbitions = [
                'Ultimate territory security, perfect family harmony, legendary hunting status',
                'Complete environmental mastery, strongest social bonds, maximum comfort',
                'Legendary protector status, perfect life balance, universal respect'
              ];
              return catAmbitions[Math.floor(randomSeed * catAmbitions.length)];
            }
            return 'Master their craft, build lasting legacy, create positive impact';
          })(),

          phobias: (() => {
            if (character.race === 'Cat') {
              const catPhobias = [
                'Vacuum cleaners, thunderstorms, water, strangers at the door',
                'Car engines, large dogs, sudden loud noises, unfamiliar scents',
                'Veterinary equipment, closed doors, empty food bowls, abandonment'
              ];
              return catPhobias[Math.floor(randomSeed * catPhobias.length)];
            }
            return 'Public failure, loss of control, abandonment, heights';
          })(),

          anxieties: (() => {
            if (character.race === 'Cat') {
              const catAnxieties = [
                'Family safety, territory invasion, food scarcity, separation',
                'Environmental changes, rival threats, routine disruption, health concerns',
                'Social rejection, resource competition, predator presence, isolation'
              ];
              return catAnxieties[Math.floor(randomSeed * catAnxieties.length)];
            }
            return 'Performance pressure, social judgment, uncertainty, change';
          })(),

          insecurities: (() => {
            if (character.race === 'Cat') {
              const catInsecurities = [
                'Hunting ability, worthiness of love, territorial strength, social status',
                'Intelligence level, physical attractiveness, family value, survival skills',
                'Leadership capability, emotional sensitivity, independence level, usefulness'
              ];
              return catInsecurities[Math.floor(randomSeed * catInsecurities.length)];
            }
            return 'Competence doubts, social acceptance, worthiness, capability';
          })(),

          // BACKGROUND SECTION FALLBACKS
          backstory: (() => {
            if (character.race === 'Cat') {
              const catBackstories = [
                'Born in a loving home, learned trust and security through consistent care and gentle handling from devoted humans.',
                'Rescued from difficult circumstances and slowly learned that safety exists, now cherishes the security of home life.',
                'Adopted as a kitten from a shelter, developed strong family bonds and learned house rules through patient training.',
                'Found as a stray and welcomed into a warm household, discovered the joys of regular meals and comfortable sleeping spots.'
              ];
              return catBackstories[Math.floor(randomSeed * catBackstories.length)];
            }
            return 'Grew up in a supportive environment, faced challenges that built character, and developed strong values through life experiences.';
          })(),

          origin: (() => {
            if (character.race === 'Cat') {
              const catOrigins = [
                'Born in a cozy home to a beloved family cat',
                'Found as a tiny kitten and bottle-fed by caring humans',
                'Adopted from an animal shelter at a young age',
                'Born in a barn and learned independence early'
              ];
              return catOrigins[Math.floor(randomSeed * catOrigins.length)];
            }
            return 'Born in a small town and raised by loving parents';
          })(),

          upbringing: (() => {
            if (character.race === 'Cat') {
              const catUpbringings = [
                'Carefully socialized with humans and taught house rules through positive reinforcement',
                'Raised by an attentive mother cat who taught proper social behaviors',
                'Hand-reared by dedicated humans who provided constant care and attention',
                'Learned survival skills from elder cats while developing trust in humans'
              ];
              return catUpbringings[Math.floor(randomSeed * catUpbringings.length)];
            }
            return 'Raised with strong moral values and encouraged to pursue their interests';
          })(),

          // ABILITIES SECTION FALLBACKS
          specialAbilities: (() => {
            if (character.race === 'Cat') {
              const catSpecialAbilities = [
                'Supernatural luck that helps them always land on their feet, enhanced empathic connection with humans',
                'Exceptional night vision and hearing that borders on precognitive, ability to sense emotions',
                'Uncanny ability to find hidden passages and shortcuts, talent for predicting weather changes',
                'Extraordinary climbing skills and perfect balance, intuitive understanding of human needs'
              ];
              return catSpecialAbilities[Math.floor(randomSeed * catSpecialAbilities.length)];
            }
            return 'Exceptional intuition, natural leadership abilities, remarkable problem-solving skills';
          })(),

          powers: (() => {
            if (character.race === 'Cat') {
              const catPowers = [
                'Limited telepathy with bonded humans, ability to sense supernatural presences',
                'Precognitive dreams that warn of danger, natural protection magic around territory',
                'Dimensional sight that reveals hidden magical elements, healing purr vibrations',
                'Time dilation during critical moments, empathic projection of calm to others'
              ];
              return catPowers[Math.floor(randomSeed * catPowers.length)];
            }
            return 'Enhanced reflexes, exceptional memory, natural charisma, strategic thinking';
          })(),

          magicalAbilities: (() => {
            if (character.race === 'Cat') {
              const catMagicalAbilities = [
                'Familiar bond magic that strengthens nearby allies, protective ward creation around territory',
                'Healing purr that accelerates recovery, ability to sense magical auras and intentions',
                'Shadow walking through connected dark spaces, empathic communication with other animals',
                'Weather sensitivity magic, ability to detect lies through scent and body language'
              ];
              return catMagicalAbilities[Math.floor(randomSeed * catMagicalAbilities.length)];
            }
            return 'Energy manipulation, elemental affinity, protective barriers, enhanced senses';
          })(),

          // STORY SECTION FALLBACKS
          objectives: (() => {
            if (character.race === 'Cat') {
              const catObjectives = [
                'Secure every corner of their territory, master the art of perfect napping spots',
                'Achieve complete family harmony, develop legendary hunting reputation',
                'Create the ultimate comfortable routine, establish undisputed household authority'
              ];
              return catObjectives[Math.floor(randomSeed * catObjectives.length)];
            }
            return 'Complete current mission, master new skills, build stronger relationships';
          })(),

          wants: (() => {
            if (character.race === 'Cat') {
              const catWants = [
                'Immediate: warm sunny spot, favorite treats, gentle chin scratches',
                'Immediate: exciting hunt, family attention, cozy hiding place',
                'Immediate: peaceful environment, delicious meal, comfortable perch'
              ];
              return catWants[Math.floor(randomSeed * catWants.length)];
            }
            return 'Recognition for efforts, time with loved ones, new challenges';
          })(),

          obstacles: (() => {
            if (character.race === 'Cat') {
              const catObstacles = [
                'Rival cats threatening territory, environmental dangers, human misunderstandings',
                'Resource competition, predator threats, household disruptions, health challenges',
                'Social conflicts, territorial disputes, routine changes, family tensions'
              ];
              return catObstacles[Math.floor(randomSeed * catObstacles.length)];
            }
            return 'External opposition, resource limitations, time constraints, social barriers';
          })(),

          conflicts: (() => {
            if (character.race === 'Cat') {
              const catConflicts = [
                'Independence vs. family dependency, safety vs. curiosity, territory vs. sharing',
                'Hunting instincts vs. house rules, comfort vs. adventure, dominance vs. cooperation',
                'Privacy needs vs. social bonds, routine vs. spontaneity, protection vs. trust'
              ];
              return catConflicts[Math.floor(randomSeed * catConflicts.length)];
            }
            return 'Duty vs. desire, safety vs. growth, independence vs. connection';
          })(),

          journey: (() => {
            if (character.race === 'Cat') {
              const catJourneys = [
                'From fearful newcomer to confident family guardian, learning trust and responsibility',
                'From independent loner to devoted family member, discovering the value of bonds',
                'From anxious kitten to wise protector, developing courage and leadership skills'
              ];
              return catJourneys[Math.floor(randomSeed * catJourneys.length)];
            }
            return 'From uncertainty to confidence, from isolation to connection, from fear to courage';
          })(),

          transformation: (() => {
            if (character.race === 'Cat') {
              const catTransformations = [
                'Learns to balance independence with family loyalty, becomes protective leader',
                'Overcomes past trauma to trust again, develops deep emotional bonds',
                'Grows from playful youth to responsible guardian, masters territorial leadership'
              ];
              return catTransformations[Math.floor(randomSeed * catTransformations.length)];
            }
            return 'Develops emotional maturity, gains wisdom through experience, finds inner strength';
          })(),
          // REMAINING STANDARD FALLBACKS
          eyeColor: character.race === 'Cat' ? 'Golden amber' : 'Brown',
          hairColor: character.race === 'Cat' ? 'Tabby brown with white patches' : 'Brown', 
          parents: character.race === 'Cat' ? 'Loving mother cat who taught survival skills, unknown father with noble bearing' : 'Caring parents who provided stable upbringing',
          siblings: character.race === 'Cat' ? 'Two littermates who remained close, occasional territorial disputes but deep affection' : 'Supportive siblings who shaped their competitive nature',
          spouse: character.race === 'Cat' ? 'Bonded companion cat who shares territory and responsibilities' : 'Devoted partner who complements their strengths',
          children: character.race === 'Cat' ? 'Protective of several adopted kittens in the neighborhood' : 'Raising children with strong moral values',
          friends: character.race === 'Cat' ? 'Loyal group of neighborhood cats who share information and support' : 'Close circle of trusted friends from various backgrounds',
          socialCircle: character.race === 'Cat' ? 'Extended network of cats, dogs, and humans throughout the territory' : 'Professional and personal connections across the community',
          community: character.race === 'Cat' ? 'Household family plus neighborhood animals in mutual protection pact' : 'Active member of local community with strong civic involvement',
          culture: character.race === 'Cat' ? 'House cat culture with strong emphasis on family loyalty and territorial respect' : 'Traditional values balanced with progressive ideals',
          traditions: character.race === 'Cat' ? 'Daily territorial patrols, family grooming sessions, seasonal territory marking' : 'Family gatherings, seasonal celebrations, community service',
          customs: character.race === 'Cat' ? 'Respectful greeting rituals, proper territory acknowledgment, sharing of resources' : 'Polite social interactions, respect for elders, hospitality traditions',
          religion: character.race === 'Cat' ? 'Natural spirituality focused on territorial spirits and ancestor guidance' : 'Balanced spiritual beliefs combining tradition and personal experience',
          spirituality: character.race === 'Cat' ? 'Daily meditation in sunny spots, connection with natural cycles' : 'Regular reflection and connection with higher purpose',
          politicalViews: character.race === 'Cat' ? 'Strong believer in territorial rights balanced with community cooperation' : 'Moderate views favoring practical solutions and social responsibility',
          education: character.race === 'Cat' ? 'Trained by elder cats in survival, social skills, and territorial management' : 'Well-educated with focus on practical skills and moral development',
          appearance: character.race === 'Cat' ? 'Sleek feline with intelligent eyes and elegant movements' : 'Well-groomed with confident bearing',
          distinguishingFeatures: character.race === 'Cat' ? 'Unusually bright eyes and a distinctive tail marking' : 'A distinctive scar and penetrating gaze'
        };
        fallbackContent = contextualFallbacks[fieldKey] || `Generated ${fieldLabel}`;
      }
      
      console.log(`Using intelligent fallback for ${fieldKey}: ${fallbackContent}`);
      return { [fieldKey]: fallbackContent };
    }

    // Process array fields
    if (['personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 'languages', 'archetypes', 'tropes', 'tags'].includes(fieldKey)) {
      const arrayContent = generatedContent.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      return { [fieldKey]: arrayContent };
    }

    return { [fieldKey]: generatedContent };

  } catch (error) {
    console.error(`Error enhancing field ${fieldKey}:`, error);
    throw new Error(`Failed to enhance field ${fieldKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}