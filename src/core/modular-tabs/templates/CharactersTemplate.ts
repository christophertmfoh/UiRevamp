import { Users } from 'lucide-react';
import type { ModularTabConfig, TabFeatures, TabUIConfig, TabDataConfig, TabComponentMappings, TabFieldConfig, TabSectionConfig, TabSortOption } from '../types/TabConfig';

// All sort options from the original CharacterManager (12+ options)
const CHARACTER_SORT_OPTIONS: TabSortOption[] = [
  { key: 'alphabetical', label: 'Alphabetical Order', direction: 'asc', category: 'basic' },
  { key: 'recently-added', label: 'Recently Added', direction: 'desc', category: 'basic' },
  { key: 'recently-edited', label: 'Recently Edited', direction: 'desc', category: 'basic' },
  { key: 'by-completion', label: 'Completion Level', direction: 'desc', category: 'progress' },
  { key: 'by-role', label: 'Story Role', direction: 'asc', category: 'story' },
  { key: 'by-race', label: 'Race/Species', direction: 'asc', category: 'identity' },
  { key: 'by-development-level', label: 'Character Development', direction: 'desc', category: 'progress' },
  { key: 'by-trait-complexity', label: 'Trait Complexity', direction: 'desc', category: 'personality' },
  { key: 'by-relationship-count', label: 'Relationship Depth', direction: 'desc', category: 'social' },
  { key: 'by-narrative-importance', label: 'Narrative Importance', direction: 'desc', category: 'story' },
  { key: 'protagonists-first', label: 'Protagonists First', direction: 'asc', category: 'story' },
  { key: 'antagonists-first', label: 'Antagonists First', direction: 'asc', category: 'story' }
];

// All features from Character Manager (preserves 100% functionality)
const CHARACTER_FEATURES: TabFeatures = {
  // Core Character Features
  hasAIGeneration: true,
  hasTemplates: true,
  hasGuidedCreation: true,
  hasDocumentUpload: true,
  hasPortraits: true,
  hasPortraitGeneration: true,
  hasPortraitUpload: true,
  
  // Data Management
  hasBulkOperations: true,
  hasBulkSelection: true,
  hasBulkDelete: true,
  hasAdvancedSearch: true,
  hasAdvancedFiltering: true,
  
  // Sorting Options (all 12+ from original)
  hasSorting: true,
  sortOptions: CHARACTER_SORT_OPTIONS,
  
  // View Modes
  hasViewModes: true,
  supportedViewModes: ['grid', 'list'],
  
  // Analytics & Progress
  hasCompletionTracking: true,
  hasProgressIndicators: true,
  hasStatistics: true,
  
  // Export & Import
  hasExport: true,
  hasImport: true,
  
  // Relationships
  hasRelationships: true,
  
  // Customization
  hasCustomFields: true,
  hasFieldValidation: true,
  
  // UI Enhancements
  hasPremiumCards: true,
  hasHoverEffects: true,
  hasAnimations: true,
  
  // Integration
  hasAPIIntegration: true,
  hasRealTimeUpdates: true
};

// UI Configuration (preserves premium Character Manager styling)
const CHARACTER_UI_CONFIG: TabUIConfig = {
  // Colors & Theming
  primaryColor: '#f59e0b', // amber-500
  secondaryColor: '#f3f4f6', // gray-100
  accentColor: '#3b82f6', // blue-500
  
  // Layout
  defaultViewMode: 'grid',
  cardLayout: 'premium',
  
  // Display Fields (what shows in cards/lists)
  displayFields: {
    card: ['name', 'title', 'role', 'race', 'class', 'age', 'description', 'personalityTraits'],
    list: ['name', 'role', 'description'],
    preview: ['name', 'title', 'role', 'description']
  },
  
  // Icons & Branding
  icon: Users,
  iconColor: '#f59e0b',
  
  // Behavior
  enableHoverEffects: true,
  enableAnimations: true,
  showProgressBars: true
};

// All character fields (preserves every field from Character interface)
const CHARACTER_FIELDS: TabFieldConfig[] = [
  // Identity Section
  { key: 'name', label: 'Name', type: 'text', section: 'identity', required: true, displayInCard: true, displayInList: true, aiEnhanceable: false },
  { key: 'nicknames', label: 'Nicknames', type: 'text', section: 'identity', placeholder: 'Common nicknames or aliases' },
  { key: 'title', label: 'Title', type: 'text', section: 'identity', placeholder: 'Sir, Lady, Dr., etc.', displayInCard: true },
  { key: 'aliases', label: 'Aliases', type: 'text', section: 'identity', placeholder: 'Secret identities or alternate names' },
  { key: 'race', label: 'Race', type: 'text', section: 'identity', placeholder: 'Human, Elf, Dwarf, etc.', displayInCard: true },
  { key: 'ethnicity', label: 'Ethnicity', type: 'text', section: 'identity', placeholder: 'Cultural or ethnic background' },
  { key: 'class', label: 'Class', type: 'text', section: 'identity', placeholder: 'Warrior, Mage, Rogue, etc.', displayInCard: true },
  { key: 'profession', label: 'Profession', type: 'text', section: 'identity', placeholder: 'Job or career' },
  { key: 'occupation', label: 'Occupation', type: 'text', section: 'identity', placeholder: 'Current work or role' },
  { key: 'age', label: 'Age', type: 'text', section: 'identity', placeholder: '25, Ancient, Timeless, etc.', displayInCard: true },
  { key: 'birthdate', label: 'Birthdate', type: 'text', section: 'identity', placeholder: 'Date of birth' },
  { key: 'zodiacSign', label: 'Zodiac Sign', type: 'text', section: 'identity', placeholder: 'Astrological sign' },
  { key: 'role', label: 'Story Role', type: 'text', section: 'identity', placeholder: 'Protagonist, Antagonist, Supporting, etc.', displayInCard: true, displayInList: true },
  { key: 'gender', label: 'Gender', type: 'text', section: 'identity', placeholder: 'Gender identity' },

  // Core Description
  { key: 'description', label: 'Description', type: 'textarea', section: 'core', placeholder: 'Overall character description', displayInCard: true, displayInList: true },
  { key: 'characterSummary', label: 'Character Summary', type: 'textarea', section: 'core', placeholder: 'Brief character overview' },
  { key: 'oneLine', label: 'One-Line Description', type: 'text', section: 'core', placeholder: 'Single sentence character summary' },

  // Physical Appearance
  { key: 'physicalDescription', label: 'Physical Description', type: 'textarea', section: 'physical', placeholder: 'Overall physical appearance' },
  { key: 'height', label: 'Height', type: 'text', section: 'physical', placeholder: "5'8\", tall, short, etc." },
  { key: 'weight', label: 'Weight', type: 'text', section: 'physical', placeholder: 'Heavy, light, average, etc.' },
  { key: 'build', label: 'Build', type: 'text', section: 'physical', placeholder: 'Athletic, slim, stocky, etc.' },
  { key: 'bodyType', label: 'Body Type', type: 'text', section: 'physical', placeholder: 'Body structure and shape' },
  { key: 'facialFeatures', label: 'Facial Features', type: 'textarea', section: 'physical', placeholder: 'Detailed facial description' },
  { key: 'eyes', label: 'Eyes', type: 'text', section: 'physical', placeholder: 'Eye description' },
  { key: 'eyeColor', label: 'Eye Color', type: 'text', section: 'physical', placeholder: 'Blue, brown, green, etc.' },
  { key: 'hair', label: 'Hair', type: 'text', section: 'physical', placeholder: 'Hair description' },
  { key: 'hairColor', label: 'Hair Color', type: 'text', section: 'physical', placeholder: 'Blonde, black, red, etc.' },
  { key: 'hairStyle', label: 'Hair Style', type: 'text', section: 'physical', placeholder: 'Long, short, curly, etc.' },
  { key: 'facialHair', label: 'Facial Hair', type: 'text', section: 'physical', placeholder: 'Beard, mustache, clean-shaven, etc.' },
  { key: 'skin', label: 'Skin', type: 'text', section: 'physical', placeholder: 'Skin description' },
  { key: 'skinTone', label: 'Skin Tone', type: 'text', section: 'physical', placeholder: 'Fair, dark, olive, etc.' },
  { key: 'complexion', label: 'Complexion', type: 'text', section: 'physical', placeholder: 'Skin condition and appearance' },
  { key: 'scars', label: 'Scars', type: 'text', section: 'physical', placeholder: 'Visible scars and marks' },
  { key: 'tattoos', label: 'Tattoos', type: 'text', section: 'physical', placeholder: 'Tattoo descriptions' },
  { key: 'piercings', label: 'Piercings', type: 'text', section: 'physical', placeholder: 'Body piercings' },
  { key: 'birthmarks', label: 'Birthmarks', type: 'text', section: 'physical', placeholder: 'Natural birthmarks' },
  { key: 'distinguishingMarks', label: 'Distinguishing Marks', type: 'text', section: 'physical', placeholder: 'Unique physical features' },
  { key: 'attire', label: 'Attire', type: 'text', section: 'physical', placeholder: 'Typical clothing' },
  { key: 'clothingStyle', label: 'Clothing Style', type: 'text', section: 'physical', placeholder: 'Fashion preference' },
  { key: 'accessories', label: 'Accessories', type: 'text', section: 'physical', placeholder: 'Jewelry, glasses, etc.' },
  { key: 'posture', label: 'Posture', type: 'text', section: 'physical', placeholder: 'How they carry themselves' },
  { key: 'gait', label: 'Gait', type: 'text', section: 'physical', placeholder: 'Walking style' },
  { key: 'gestures', label: 'Gestures', type: 'text', section: 'physical', placeholder: 'Hand movements and gestures' },
  { key: 'mannerisms', label: 'Mannerisms', type: 'text', section: 'physical', placeholder: 'Physical habits and tics' },

  // Personality
  { key: 'personality', label: 'Personality', type: 'textarea', section: 'personality', placeholder: 'Core personality traits and characteristics', displayInCard: true },
  { key: 'personalityTraits', label: 'Personality Traits', type: 'array', section: 'personality', placeholder: 'Brave, cunning, compassionate, etc.' },
  { key: 'temperament', label: 'Temperament', type: 'text', section: 'personality', placeholder: 'Hot-headed, calm, unpredictable, etc.' },
  { key: 'disposition', label: 'Disposition', type: 'text', section: 'personality', placeholder: 'General attitude and outlook' },
  { key: 'worldview', label: 'Worldview', type: 'text', section: 'personality', placeholder: 'How they see the world' },
  { key: 'beliefs', label: 'Beliefs', type: 'text', section: 'personality', placeholder: 'Religious, philosophical beliefs' },
  { key: 'values', label: 'Values', type: 'text', section: 'personality', placeholder: 'What the character believes in' },
  { key: 'principles', label: 'Principles', type: 'text', section: 'personality', placeholder: 'Core principles and guidelines' },
  { key: 'morals', label: 'Morals', type: 'text', section: 'personality', placeholder: 'Moral compass and ethics' },
  { key: 'ethics', label: 'Ethics', type: 'text', section: 'personality', placeholder: 'Ethical framework' },
  { key: 'virtues', label: 'Virtues', type: 'text', section: 'personality', placeholder: 'Positive character traits' },
  { key: 'vices', label: 'Vices', type: 'text', section: 'personality', placeholder: 'Character flaws and negative traits' },
  { key: 'habits', label: 'Habits', type: 'text', section: 'personality', placeholder: 'Regular behaviors and routines' },
  { key: 'quirks', label: 'Quirks', type: 'text', section: 'personality', placeholder: 'Unique behaviors or habits' },
  { key: 'idiosyncrasies', label: 'Idiosyncrasies', type: 'text', section: 'personality', placeholder: 'Peculiar traits' },
  { key: 'petPeeves', label: 'Pet Peeves', type: 'text', section: 'personality', placeholder: 'Things that annoy them' },
  { key: 'likes', label: 'Likes', type: 'text', section: 'personality', placeholder: 'Things the character enjoys' },
  { key: 'dislikes', label: 'Dislikes', type: 'text', section: 'personality', placeholder: 'Things the character avoids' },
  { key: 'hobbies', label: 'Hobbies', type: 'text', section: 'personality', placeholder: 'Leisure activities and interests' },
  { key: 'interests', label: 'Interests', type: 'text', section: 'personality', placeholder: 'Areas of interest' },
  { key: 'passions', label: 'Passions', type: 'text', section: 'personality', placeholder: 'Deep interests and drives' },

  // Psychology
  { key: 'motivations', label: 'Motivations', type: 'text', section: 'psychology', placeholder: 'What drives the character', displayInCard: true },
  { key: 'desires', label: 'Desires', type: 'text', section: 'psychology', placeholder: 'What they want most' },
  { key: 'needs', label: 'Needs', type: 'text', section: 'psychology', placeholder: 'Essential psychological needs' },
  { key: 'drives', label: 'Drives', type: 'text', section: 'psychology', placeholder: 'Internal driving forces' },
  { key: 'ambitions', label: 'Ambitions', type: 'text', section: 'psychology', placeholder: 'Long-term goals and aspirations' },
  { key: 'fears', label: 'Fears', type: 'text', section: 'psychology', placeholder: 'What the character is afraid of' },
  { key: 'phobias', label: 'Phobias', type: 'text', section: 'psychology', placeholder: 'Specific irrational fears' },
  { key: 'anxieties', label: 'Anxieties', type: 'text', section: 'psychology', placeholder: 'Sources of worry and stress' },
  { key: 'insecurities', label: 'Insecurities', type: 'text', section: 'psychology', placeholder: 'Self-doubt and uncertainties' },
  { key: 'secrets', label: 'Secrets', type: 'text', section: 'psychology', placeholder: 'Hidden information about the character' },
  { key: 'shame', label: 'Shame', type: 'text', section: 'psychology', placeholder: 'Sources of shame' },
  { key: 'guilt', label: 'Guilt', type: 'text', section: 'psychology', placeholder: 'Guilt and regret' },
  { key: 'regrets', label: 'Regrets', type: 'text', section: 'psychology', placeholder: 'Past decisions they regret' },
  { key: 'trauma', label: 'Trauma', type: 'text', section: 'psychology', placeholder: 'Past traumatic experiences' },
  { key: 'wounds', label: 'Emotional Wounds', type: 'text', section: 'psychology', placeholder: 'Deep emotional injuries' },
  { key: 'copingMechanisms', label: 'Coping Mechanisms', type: 'text', section: 'psychology', placeholder: 'How they deal with stress' },
  { key: 'defenses', label: 'Defense Mechanisms', type: 'text', section: 'psychology', placeholder: 'Psychological defenses' },
  { key: 'vulnerabilities', label: 'Vulnerabilities', type: 'text', section: 'psychology', placeholder: 'Emotional weak points' },
  { key: 'weaknesses', label: 'Weaknesses', type: 'text', section: 'psychology', placeholder: 'Character flaws and limitations' },
  { key: 'blindSpots', label: 'Blind Spots', type: 'text', section: 'psychology', placeholder: 'Areas of self-ignorance' },
  { key: 'mentalHealth', label: 'Mental Health', type: 'text', section: 'psychology', placeholder: 'Psychological well-being' },
  { key: 'emotionalState', label: 'Emotional State', type: 'text', section: 'psychology', placeholder: 'Current emotional condition' },
  { key: 'maturityLevel', label: 'Maturity Level', type: 'text', section: 'psychology', placeholder: 'Emotional and psychological maturity' },
  { key: 'intelligenceType', label: 'Intelligence Type', type: 'text', section: 'psychology', placeholder: 'Type of intelligence (logical, emotional, etc.)' },
  { key: 'learningStyle', label: 'Learning Style', type: 'text', section: 'psychology', placeholder: 'How they learn and process information' },

  // Background & History
  { key: 'background', label: 'Background', type: 'textarea', section: 'background', placeholder: 'General background information' },
  { key: 'backstory', label: 'Backstory', type: 'textarea', section: 'background', placeholder: 'Character history and background' },
  { key: 'origin', label: 'Origin', type: 'text', section: 'background', placeholder: 'Where they came from' },
  { key: 'upbringing', label: 'Upbringing', type: 'text', section: 'background', placeholder: 'How they were raised' },
  { key: 'childhood', label: 'Childhood', type: 'textarea', section: 'background', placeholder: 'Early life experiences' },
  { key: 'familyHistory', label: 'Family History', type: 'text', section: 'background', placeholder: 'Family background and lineage' },
  { key: 'socialClass', label: 'Social Class', type: 'text', section: 'background', placeholder: 'Noble, merchant, peasant, etc.' },
  { key: 'economicStatus', label: 'Economic Status', type: 'text', section: 'background', placeholder: 'Financial situation' },
  { key: 'education', label: 'Education', type: 'text', section: 'background', placeholder: 'Formal education and training' },
  { key: 'academicHistory', label: 'Academic History', type: 'text', section: 'background', placeholder: 'Educational achievements' },
  { key: 'formativeEvents', label: 'Formative Events', type: 'text', section: 'background', placeholder: 'Key life-shaping events' },
  { key: 'lifeChangingMoments', label: 'Life-Changing Moments', type: 'text', section: 'background', placeholder: 'Pivotal experiences' },
  { key: 'personalStruggle', label: 'Personal Struggles', type: 'text', section: 'background', placeholder: 'Major challenges faced' },
  { key: 'challenges', label: 'Challenges', type: 'text', section: 'background', placeholder: 'Obstacles overcome' },
  { key: 'achievements', label: 'Achievements', type: 'text', section: 'background', placeholder: 'Notable accomplishments' },
  { key: 'failures', label: 'Failures', type: 'text', section: 'background', placeholder: 'Past failures and setbacks' },
  { key: 'losses', label: 'Losses', type: 'text', section: 'background', placeholder: 'Things lost along the way' },
  { key: 'victories', label: 'Victories', type: 'text', section: 'background', placeholder: 'Major wins and successes' },
  { key: 'reputation', label: 'Reputation', type: 'text', section: 'background', placeholder: 'How others perceive them' },

  // Abilities & Skills
  { key: 'abilities', label: 'Abilities', type: 'array', section: 'abilities', placeholder: 'Special abilities and powers' },
  { key: 'skills', label: 'Skills', type: 'array', section: 'abilities', placeholder: 'Learned skills and expertise' },
  { key: 'talents', label: 'Talents', type: 'array', section: 'abilities', placeholder: 'Natural talents and gifts' },
  { key: 'expertise', label: 'Expertise', type: 'array', section: 'abilities', placeholder: 'Areas of expert knowledge' },
  { key: 'specialAbilities', label: 'Special Abilities', type: 'text', section: 'abilities', placeholder: 'Unique supernatural abilities' },
  { key: 'powers', label: 'Powers', type: 'text', section: 'abilities', placeholder: 'Magical or superhuman powers' },
  { key: 'abilityLimitations', label: 'Ability Limitations', type: 'text', section: 'abilities', placeholder: 'Limits on their abilities' },
  { key: 'superpowers', label: 'Superpowers', type: 'text', section: 'abilities', placeholder: 'Extraordinary powers' },
  { key: 'strengths', label: 'Strengths', type: 'text', section: 'abilities', placeholder: 'Character strengths and advantages' },
  { key: 'competencies', label: 'Competencies', type: 'text', section: 'abilities', placeholder: 'Areas of competence' },
  { key: 'training', label: 'Training', type: 'text', section: 'abilities', placeholder: 'Specialized training received' },
  { key: 'experience', label: 'Experience', type: 'text', section: 'abilities', placeholder: 'Relevant experience' },

  // Story Elements
  { key: 'goals', label: 'Goals', type: 'text', section: 'story', placeholder: 'What the character wants to achieve' },
  { key: 'objectives', label: 'Objectives', type: 'text', section: 'story', placeholder: 'Specific objectives and targets' },
  { key: 'wants', label: 'Wants', type: 'text', section: 'story', placeholder: 'What they desire' },
  { key: 'obstacles', label: 'Obstacles', type: 'text', section: 'story', placeholder: 'What stands in their way' },
  { key: 'conflicts', label: 'Conflicts', type: 'text', section: 'story', placeholder: 'Internal and external conflicts' },
  { key: 'conflictSources', label: 'Conflict Sources', type: 'text', section: 'story', placeholder: 'Sources of conflict' },
  { key: 'stakes', label: 'Stakes', type: 'text', section: 'story', placeholder: 'What they stand to gain or lose' },
  { key: 'consequences', label: 'Consequences', type: 'text', section: 'story', placeholder: 'Potential outcomes of their actions' },
  { key: 'arc', label: 'Character Arc', type: 'textarea', section: 'story', placeholder: 'How the character changes throughout the story' },
  { key: 'journey', label: 'Character Journey', type: 'textarea', section: 'story', placeholder: 'The path of character development' },
  { key: 'transformation', label: 'Transformation', type: 'text', section: 'story', placeholder: 'How they change' },
  { key: 'growth', label: 'Character Growth', type: 'text', section: 'story', placeholder: 'Areas of personal growth' },
  { key: 'relationships', label: 'Relationships', type: 'text', section: 'story', placeholder: 'Key relationships with other characters' },
  { key: 'allies', label: 'Allies', type: 'text', section: 'story', placeholder: 'Friends and supporters' },
  { key: 'enemies', label: 'Enemies', type: 'text', section: 'story', placeholder: 'Foes and opponents' },
  { key: 'mentors', label: 'Mentors', type: 'text', section: 'story', placeholder: 'Teachers and guides' },
  { key: 'rivals', label: 'Rivals', type: 'text', section: 'story', placeholder: 'Competitors and rivals' },
  { key: 'connectionToEvents', label: 'Connection to Events', type: 'text', section: 'story', placeholder: 'How they relate to major plot events' },
  { key: 'plotRelevance', label: 'Plot Relevance', type: 'text', section: 'story', placeholder: 'Importance to the main plot' },
  { key: 'storyFunction', label: 'Story Function', type: 'text', section: 'story', placeholder: 'Role in the narrative structure' },

  // Language & Communication
  { key: 'spokenLanguages', label: 'Spoken Languages', type: 'text', section: 'communication', placeholder: 'Languages they speak' },
  { key: 'accent', label: 'Accent', type: 'text', section: 'communication', placeholder: 'Regional or cultural accent' },
  { key: 'dialect', label: 'Dialect', type: 'text', section: 'communication', placeholder: 'Specific way of speaking' },
  { key: 'voiceDescription', label: 'Voice Description', type: 'text', section: 'communication', placeholder: 'How their voice sounds' },
  { key: 'speechPatterns', label: 'Speech Patterns', type: 'text', section: 'communication', placeholder: 'How they typically speak' },
  { key: 'vocabulary', label: 'Vocabulary', type: 'text', section: 'communication', placeholder: 'Types of words they use' },
  { key: 'catchphrases', label: 'Catchphrases', type: 'text', section: 'communication', placeholder: 'Signature phrases' },
  { key: 'slang', label: 'Slang', type: 'text', section: 'communication', placeholder: 'Informal language they use' },
  { key: 'communicationStyle', label: 'Communication Style', type: 'text', section: 'communication', placeholder: 'How they interact with others' },

  // Social & Cultural
  { key: 'family', label: 'Family', type: 'text', section: 'social', placeholder: 'Family members and relationships' },
  { key: 'parents', label: 'Parents', type: 'text', section: 'social', placeholder: 'Information about parents' },
  { key: 'siblings', label: 'Siblings', type: 'text', section: 'social', placeholder: 'Brothers and sisters' },
  { key: 'spouse', label: 'Spouse', type: 'text', section: 'social', placeholder: 'Marriage partner' },
  { key: 'children', label: 'Children', type: 'text', section: 'social', placeholder: 'Offspring' },
  { key: 'friends', label: 'Friends', type: 'text', section: 'social', placeholder: 'Close friends and companions' },
  { key: 'socialCircle', label: 'Social Circle', type: 'text', section: 'social', placeholder: 'Social network and acquaintances' },
  { key: 'community', label: 'Community', type: 'text', section: 'social', placeholder: 'Community they belong to' },
  { key: 'culturalBackground', label: 'Cultural Background', type: 'text', section: 'social', placeholder: 'Cultural heritage and background' },
  { key: 'traditions', label: 'Traditions', type: 'text', section: 'social', placeholder: 'Cultural traditions they follow' },
  { key: 'customs', label: 'Customs', type: 'text', section: 'social', placeholder: 'Social customs and practices' },
  { key: 'religion', label: 'Religion', type: 'text', section: 'social', placeholder: 'Religious beliefs and practices' },
  { key: 'spirituality', label: 'Spirituality', type: 'text', section: 'social', placeholder: 'Spiritual beliefs and practices' },
  { key: 'politicalViews', label: 'Political Views', type: 'text', section: 'social', placeholder: 'Political beliefs and affiliations' },

  // Meta Information
  { key: 'archetypes', label: 'Archetypes', type: 'array', section: 'meta', placeholder: 'Hero, Mentor, Trickster, etc.' },
  { key: 'tropes', label: 'Tropes', type: 'array', section: 'meta', placeholder: 'Literary tropes they embody' },
  { key: 'inspiration', label: 'Inspiration', type: 'text', section: 'meta', placeholder: 'Real-world or fictional inspiration' },
  { key: 'basedOn', label: 'Based On', type: 'text', section: 'meta', placeholder: 'Real people or characters they are based on' },
  { key: 'tags', label: 'Tags', type: 'array', section: 'meta', placeholder: 'Organizational tags' },
  { key: 'genre', label: 'Genre', type: 'text', section: 'meta', placeholder: 'Genre they fit into' },
  { key: 'proseVibe', label: 'Prose Vibe', type: 'text', section: 'meta', placeholder: 'Writing style and tone' },
  { key: 'narrativeRole', label: 'Narrative Role', type: 'text', section: 'meta', placeholder: 'Function in the narrative' },
  { key: 'characterType', label: 'Character Type', type: 'text', section: 'meta', placeholder: 'Type of character (flat, round, static, dynamic)' },
  { key: 'importance', label: 'Importance', type: 'text', section: 'meta', placeholder: 'Importance to the story' },
  { key: 'screenTime', label: 'Screen Time', type: 'text', section: 'meta', placeholder: 'How much they appear in the story' },
  { key: 'firstAppearance', label: 'First Appearance', type: 'text', section: 'meta', placeholder: 'When they first appear' },
  { key: 'lastAppearance', label: 'Last Appearance', type: 'text', section: 'meta', placeholder: 'When they last appear' },
  { key: 'notes', label: 'Writer Notes', type: 'textarea', section: 'meta', placeholder: 'Development notes and ideas' },
  { key: 'development', label: 'Development', type: 'text', section: 'meta', placeholder: 'Character development notes' },
  { key: 'evolution', label: 'Evolution', type: 'text', section: 'meta', placeholder: 'How the character has evolved' },
  { key: 'alternatives', label: 'Alternatives', type: 'text', section: 'meta', placeholder: 'Alternative versions or ideas' },
  { key: 'unused', label: 'Unused Ideas', type: 'text', section: 'meta', placeholder: 'Ideas not used' },
  { key: 'research', label: 'Research', type: 'text', section: 'meta', placeholder: 'Research notes' },
  { key: 'references', label: 'References', type: 'text', section: 'meta', placeholder: 'Reference materials' },
  { key: 'mood', label: 'Mood', type: 'text', section: 'meta', placeholder: 'Overall mood and atmosphere' },
  { key: 'personalTheme', label: 'Personal Theme', type: 'text', section: 'meta', placeholder: 'Character themes' },
  { key: 'symbolism', label: 'Symbolism', type: 'text', section: 'meta', placeholder: 'What they symbolize' }
];

// Character sections (organized and comprehensive)
const CHARACTER_SECTIONS: TabSectionConfig[] = [
  { key: 'identity', label: 'Identity', fields: ['name', 'nicknames', 'title', 'aliases', 'race', 'ethnicity', 'class', 'profession', 'occupation', 'age', 'birthdate', 'zodiacSign', 'role', 'gender'], defaultExpanded: true },
  { key: 'core', label: 'Core Description', fields: ['description', 'characterSummary', 'oneLine'], defaultExpanded: true },
  { key: 'physical', label: 'Physical Appearance', fields: ['physicalDescription', 'height', 'weight', 'build', 'bodyType', 'facialFeatures', 'eyes', 'eyeColor', 'hair', 'hairColor', 'hairStyle', 'facialHair', 'skin', 'skinTone', 'complexion', 'scars', 'tattoos', 'piercings', 'birthmarks', 'distinguishingMarks', 'attire', 'clothingStyle', 'accessories', 'posture', 'gait', 'gestures', 'mannerisms'] },
  { key: 'personality', label: 'Personality', fields: ['personality', 'personalityTraits', 'temperament', 'disposition', 'worldview', 'beliefs', 'values', 'principles', 'morals', 'ethics', 'virtues', 'vices', 'habits', 'quirks', 'idiosyncrasies', 'petPeeves', 'likes', 'dislikes', 'hobbies', 'interests', 'passions'] },
  { key: 'psychology', label: 'Psychology', fields: ['motivations', 'desires', 'needs', 'drives', 'ambitions', 'fears', 'phobias', 'anxieties', 'insecurities', 'secrets', 'shame', 'guilt', 'regrets', 'trauma', 'wounds', 'copingMechanisms', 'defenses', 'vulnerabilities', 'weaknesses', 'blindSpots', 'mentalHealth', 'emotionalState', 'maturityLevel', 'intelligenceType', 'learningStyle'] },
  { key: 'background', label: 'Background & History', fields: ['background', 'backstory', 'origin', 'upbringing', 'childhood', 'familyHistory', 'socialClass', 'economicStatus', 'education', 'academicHistory', 'formativeEvents', 'lifeChangingMoments', 'personalStruggle', 'challenges', 'achievements', 'failures', 'losses', 'victories', 'reputation'] },
  { key: 'abilities', label: 'Abilities & Skills', fields: ['abilities', 'skills', 'talents', 'expertise', 'specialAbilities', 'powers', 'abilityLimitations', 'superpowers', 'strengths', 'competencies', 'training', 'experience'] },
  { key: 'story', label: 'Story Elements', fields: ['goals', 'objectives', 'wants', 'obstacles', 'conflicts', 'conflictSources', 'stakes', 'consequences', 'arc', 'journey', 'transformation', 'growth', 'relationships', 'allies', 'enemies', 'mentors', 'rivals', 'connectionToEvents', 'plotRelevance', 'storyFunction'] },
  { key: 'communication', label: 'Language & Communication', fields: ['spokenLanguages', 'accent', 'dialect', 'voiceDescription', 'speechPatterns', 'vocabulary', 'catchphrases', 'slang', 'communicationStyle'] },
  { key: 'social', label: 'Social & Cultural', fields: ['family', 'parents', 'siblings', 'spouse', 'children', 'friends', 'socialCircle', 'community', 'culturalBackground', 'traditions', 'customs', 'religion', 'spirituality', 'politicalViews'] },
  { key: 'meta', label: 'Meta Information', fields: ['archetypes', 'tropes', 'inspiration', 'basedOn', 'tags', 'genre', 'proseVibe', 'narrativeRole', 'characterType', 'importance', 'screenTime', 'firstAppearance', 'lastAppearance', 'notes', 'development', 'evolution', 'alternatives', 'unused', 'research', 'references', 'mood', 'personalTheme', 'symbolism'] }
];

// Data configuration
const CHARACTER_DATA_CONFIG: TabDataConfig = {
  entityType: 'characters',
  fields: CHARACTER_FIELDS,
  sections: CHARACTER_SECTIONS,
  validation: {
    requiredFields: ['name'],
    uniqueFields: ['name'],
    customValidators: {
      name: (value: string) => {
        if (!value || value.trim().length === 0) {
          return 'Character name is required';
        }
        if (value.length > 100) {
          return 'Character name must be less than 100 characters';
        }
        return true;
      }
    }
  },
  defaultValues: {
    role: 'Character'
  },
  customProperties: []
};

// Component mappings (preserves exact Character Manager functionality)
const CHARACTER_COMPONENT_MAPPINGS: TabComponentMappings = {
  // Main Manager Component
  manager: 'AdvancedCharacterManager',
  
  // Creation Components
  creationLaunch: 'CharacterCreationLaunch',
  guidedCreation: 'CharacterGuidedCreation',
  templates: 'CharacterTemplates',
  aiGeneration: 'CharacterGenerationModal',
  documentUpload: 'CharacterDocumentUpload',
  
  // Detail & Edit Components
  detailView: 'CharacterDetailView',
  form: 'CharacterForm',
  
  // Enhancement Components
  portraitModal: 'CharacterPortraitModalImproved',
  aiAssist: 'AIAssistModal',
  fieldAI: 'FieldAIAssist',
  
  // Card Components
  card: 'CharacterCard',
  listItem: 'CharacterListItem',
  
  // Modals & Overlays
  confirmDelete: 'ConfirmDeleteModal',
  bulkActions: 'BulkActionsModal',
  export: 'ExportModal',
  
  // Custom Components
  customComponents: {}
};

// Complete Characters Template Configuration
export const CHARACTERS_TEMPLATE: ModularTabConfig = {
  id: 'characters-template',
  name: 'characters',
  displayName: 'Characters',
  description: 'Complete character management with all original functionality preserved',
  icon: Users,
  color: '#f59e0b',
  gradient: 'from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30',
  
  // Metadata
  isCustom: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // Features (100% preserved)
  features: CHARACTER_FEATURES,
  
  // UI Configuration
  ui: CHARACTER_UI_CONFIG,
  
  // Data Configuration
  dataConfig: CHARACTER_DATA_CONFIG,
  
  // Component Mappings
  componentMappings: CHARACTER_COMPONENT_MAPPINGS
};