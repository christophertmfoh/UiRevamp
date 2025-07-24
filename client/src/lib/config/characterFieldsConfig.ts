export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'array';
  placeholder?: string;
  options?: string[];
  rows?: number;
}

export interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  fields: FieldConfig[];
}

// EXACT MATCH TO CharacterFormExpanded.tsx
export const CHARACTER_SECTIONS: SectionConfig[] = [
  {
    id: 'identity',
    title: 'Identity',
    icon: 'User',
    description: 'Basic character information and core identity',
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Character\'s full name' },
      { key: 'nicknames', label: 'Nicknames', type: 'text', placeholder: 'Pet names, shortened names' },
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Lord, Dr., Captain, etc.' },
      { key: 'aliases', label: 'Aliases', type: 'text', placeholder: 'Code names, false identities' },
      { key: 'role', label: 'Role in Story', type: 'text', placeholder: 'Protagonist, Antagonist, Supporting' },
      { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, Elf, Dwarf, Alien, etc.' },
      { key: 'ethnicity', label: 'Ethnicity/Culture', type: 'text', placeholder: 'Cultural/ethnic background' },
      { key: 'age', label: 'Age', type: 'text', placeholder: '25, mid-thirties, ancient' },
      { key: 'birthdate', label: 'Birth Date', type: 'text', placeholder: 'March 15, 1985' },
      { key: 'zodiacSign', label: 'Zodiac Sign', type: 'text', placeholder: 'Pisces, Leo, etc.' },
      { key: 'class', label: 'Class', type: 'text', placeholder: 'Warrior, Mage, Rogue' },
      { key: 'profession', label: 'Profession', type: 'text', placeholder: 'Doctor, Teacher, Blacksmith' },
      { key: 'occupation', label: 'Current Occupation', type: 'text', placeholder: 'Current job or role' },
    ]
  },
  {
    id: 'physical',
    title: 'Physical',
    icon: 'Eye',
    description: 'Physical traits, appearance, and distinguishing features',
    fields: [
      { key: 'height', label: 'Height', type: 'text', placeholder: '5\'8", tall, short' },
      { key: 'weight', label: 'Weight/Build', type: 'text', placeholder: 'Lean, muscular, heavy-set' },
      { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'Brown, blue, green, hazel' },
      { key: 'hairColor', label: 'Hair Color', type: 'text', placeholder: 'Blonde, brunette, black, red' },
      { key: 'hairStyle', label: 'Hair Style', type: 'text', placeholder: 'Long, short, curly, straight' },
      { key: 'skinTone', label: 'Skin Tone', type: 'text', placeholder: 'Fair, olive, dark, tanned' },
      { key: 'physicalDescription', label: 'Overall Physical Description', type: 'textarea', placeholder: 'Detailed physical appearance description', rows: 4 },
      { key: 'distinguishingMarks', label: 'Distinguishing Marks', type: 'textarea', placeholder: 'Scars, tattoos, birthmarks, etc.', rows: 3 },
      { key: 'clothingStyle', label: 'Clothing Style', type: 'textarea', placeholder: 'How they typically dress', rows: 3 },
      { key: 'build', label: 'Build', type: 'text', placeholder: 'Athletic, slim, stocky, etc.' },
      { key: 'bodyType', label: 'Body Type', type: 'text', placeholder: 'Ectomorph, mesomorph, endomorph' },
      { key: 'facialFeatures', label: 'Facial Features', type: 'textarea', placeholder: 'Shape of face, distinctive features', rows: 2 },
      { key: 'eyes', label: 'Eyes Description', type: 'text', placeholder: 'Shape, expression, etc.' },
      { key: 'hair', label: 'Hair Description', type: 'text', placeholder: 'Texture, thickness, etc.' },
      { key: 'facialHair', label: 'Facial Hair', type: 'text', placeholder: 'Beard, mustache, goatee, etc.' },
      { key: 'skin', label: 'Skin Description', type: 'text', placeholder: 'Texture, condition, notable features' },
      { key: 'complexion', label: 'Complexion', type: 'text', placeholder: 'Clear, freckled, weathered, etc.' },
      { key: 'scars', label: 'Scars', type: 'textarea', placeholder: 'Visible scars and their stories', rows: 2 },
      { key: 'tattoos', label: 'Tattoos', type: 'textarea', placeholder: 'Tattoos and their meanings', rows: 2 },
      { key: 'piercings', label: 'Piercings', type: 'text', placeholder: 'Ear, nose, lip piercings, etc.' },
      { key: 'birthmarks', label: 'Birthmarks', type: 'text', placeholder: 'Notable birthmarks or moles' },
      { key: 'attire', label: 'Attire', type: 'textarea', placeholder: 'Current outfit or typical clothing', rows: 2 },
      { key: 'accessories', label: 'Accessories', type: 'text', placeholder: 'Jewelry, watches, bags, etc.' },
      { key: 'posture', label: 'Posture', type: 'text', placeholder: 'How they carry themselves' },
      { key: 'gait', label: 'Gait', type: 'text', placeholder: 'How they walk or move' },
      { key: 'gestures', label: 'Gestures', type: 'text', placeholder: 'Hand movements, body language' },
      { key: 'mannerisms', label: 'Mannerisms', type: 'textarea', placeholder: 'Distinctive behaviors and expressions', rows: 2 },
    ]
  },
  {
    id: 'personality',
    title: 'Personality',
    icon: 'Brain',
    description: 'Character traits, temperament, and behavioral patterns',
    fields: [
      { key: 'personality', label: 'Overall Personality', type: 'textarea', placeholder: 'General personality description', rows: 4 },
      { key: 'personalityTraits', label: 'Personality Traits', type: 'array', placeholder: 'brave, stubborn, kind, sarcastic' },
      { key: 'temperament', label: 'Temperament', type: 'text', placeholder: 'Calm, fiery, melancholic, optimistic' },
      { key: 'disposition', label: 'Disposition', type: 'text', placeholder: 'General attitude and mood tendencies' },
      { key: 'worldview', label: 'Worldview', type: 'textarea', placeholder: 'How they see the world, their philosophy', rows: 3 },
      { key: 'beliefs', label: 'Beliefs', type: 'textarea', placeholder: 'What they believe in, their core values', rows: 3 },
      { key: 'values', label: 'Values', type: 'textarea', placeholder: 'What they value most in life', rows: 2 },
      { key: 'principles', label: 'Principles', type: 'textarea', placeholder: 'Their guiding principles', rows: 2 },
      { key: 'morals', label: 'Morals', type: 'textarea', placeholder: 'Their moral code', rows: 2 },
      { key: 'ethics', label: 'Ethics', type: 'textarea', placeholder: 'Their ethical framework', rows: 2 },
      { key: 'virtues', label: 'Virtues', type: 'text', placeholder: 'Their positive qualities' },
      { key: 'vices', label: 'Vices', type: 'text', placeholder: 'Their negative tendencies' },
      { key: 'habits', label: 'Habits', type: 'textarea', placeholder: 'Regular behaviors and routines', rows: 2 },
      { key: 'quirks', label: 'Quirks', type: 'textarea', placeholder: 'Unique mannerisms, habits', rows: 2 },
      { key: 'idiosyncrasies', label: 'Idiosyncrasies', type: 'text', placeholder: 'Peculiar characteristics' },
      { key: 'petPeeves', label: 'Pet Peeves', type: 'text', placeholder: 'Things that annoy them' },
      { key: 'likes', label: 'Likes', type: 'textarea', placeholder: 'Things they enjoy', rows: 2 },
      { key: 'dislikes', label: 'Dislikes', type: 'textarea', placeholder: 'Things they hate or avoid', rows: 2 },
      { key: 'hobbies', label: 'Hobbies', type: 'text', placeholder: 'What they do for fun' },
      { key: 'interests', label: 'Interests', type: 'text', placeholder: 'What captures their attention' },
      { key: 'passions', label: 'Passions', type: 'text', placeholder: 'What they feel strongly about' },
    ]
  },
  {
    id: 'psychology',
    title: 'Psychology',
    icon: 'Brain',
    description: 'Deep psychological profile, motivations, and inner conflicts',
    fields: [
      { key: 'motivations', label: 'Motivations', type: 'textarea', placeholder: 'What drives them, their deepest desires', rows: 3 },
      { key: 'desires', label: 'Desires', type: 'textarea', placeholder: 'What they want or crave', rows: 2 },
      { key: 'needs', label: 'Needs', type: 'textarea', placeholder: 'What they require to feel whole', rows: 2 },
      { key: 'drives', label: 'Drives', type: 'textarea', placeholder: 'Internal forces that push them forward', rows: 2 },
      { key: 'ambitions', label: 'Ambitions', type: 'textarea', placeholder: 'Their goals and aspirations', rows: 2 },
      { key: 'fears', label: 'Fears', type: 'textarea', placeholder: 'What they\'re afraid of, phobias', rows: 3 },
      { key: 'phobias', label: 'Phobias', type: 'text', placeholder: 'Specific irrational fears' },
      { key: 'anxieties', label: 'Anxieties', type: 'text', placeholder: 'Things that make them anxious' },
      { key: 'insecurities', label: 'Insecurities', type: 'text', placeholder: 'Areas where they lack confidence' },
      { key: 'secrets', label: 'Secrets', type: 'textarea', placeholder: 'What they\'re hiding, dark secrets', rows: 3 },
      { key: 'shame', label: 'Shame', type: 'textarea', placeholder: 'Things they are ashamed of', rows: 2 },
      { key: 'guilt', label: 'Guilt', type: 'textarea', placeholder: 'Things they feel guilty about', rows: 2 },
      { key: 'regrets', label: 'Regrets', type: 'textarea', placeholder: 'Things they wish they had done differently', rows: 2 },
      { key: 'trauma', label: 'Trauma', type: 'textarea', placeholder: 'Past hurts, emotional wounds, trauma', rows: 3 },
      { key: 'wounds', label: 'Emotional Wounds', type: 'textarea', placeholder: 'Deep emotional injuries', rows: 2 },
      { key: 'copingMechanisms', label: 'Coping Mechanisms', type: 'textarea', placeholder: 'How they deal with stress, pain, difficulty', rows: 3 },
      { key: 'defenses', label: 'Defenses', type: 'text', placeholder: 'How they protect themselves emotionally' },
      { key: 'vulnerabilities', label: 'Vulnerabilities', type: 'textarea', placeholder: 'Emotional weak points, what can hurt them', rows: 3 },
      { key: 'weaknesses', label: 'Weaknesses', type: 'textarea', placeholder: 'Areas where they are vulnerable or lacking', rows: 2 },
      { key: 'blindSpots', label: 'Blind Spots', type: 'text', placeholder: 'Things they cannot see about themselves' },
      { key: 'mentalHealth', label: 'Mental Health', type: 'text', placeholder: 'Their psychological well-being' },
      { key: 'emotionalState', label: 'Emotional State', type: 'text', placeholder: 'Current emotional condition' },
      { key: 'maturityLevel', label: 'Maturity Level', type: 'text', placeholder: 'How emotionally mature they are' },
      { key: 'intelligenceType', label: 'Intelligence Type', type: 'text', placeholder: 'How they are smart (analytical, creative, emotional, etc.)' },
      { key: 'learningStyle', label: 'Learning Style', type: 'text', placeholder: 'How they best learn and process information' },
    ]
  },
  {
    id: 'background',
    title: 'Background',
    icon: 'BookOpen',
    description: 'Life story, upbringing, and formative experiences',
    fields: [
      { key: 'background', label: 'Background', type: 'textarea', placeholder: 'General background information', rows: 4 },
      { key: 'backstory', label: 'Backstory', type: 'textarea', placeholder: 'Their life story, history, background', rows: 5 },
      { key: 'origin', label: 'Origin', type: 'textarea', placeholder: 'Where they come from', rows: 2 },
      { key: 'upbringing', label: 'Upbringing', type: 'textarea', placeholder: 'How they were raised', rows: 3 },
      { key: 'childhood', label: 'Childhood', type: 'textarea', placeholder: 'Their early years, formative experiences', rows: 3 },
      { key: 'familyHistory', label: 'Family History', type: 'textarea', placeholder: 'Family background and lineage', rows: 3 },
      { key: 'socialClass', label: 'Social Class', type: 'text', placeholder: 'Upper class, middle class, working class, etc.' },
      { key: 'economicStatus', label: 'Economic Status', type: 'text', placeholder: 'Wealthy, comfortable, struggling, poor' },
      { key: 'education', label: 'Education', type: 'textarea', placeholder: 'Schooling, training, mentors', rows: 3 },
      { key: 'academicHistory', label: 'Academic History', type: 'textarea', placeholder: 'Formal education and achievements', rows: 2 },
      { key: 'formativeEvents', label: 'Formative Events', type: 'textarea', placeholder: 'Key events that shaped who they are', rows: 3 },
      { key: 'lifeChangingMoments', label: 'Life Changing Moments', type: 'textarea', placeholder: 'Pivotal moments that altered their path', rows: 3 },
      { key: 'personalStruggle', label: 'Personal Struggle', type: 'textarea', placeholder: 'Major personal challenges they\'ve faced', rows: 3 },
      { key: 'challenges', label: 'Challenges', type: 'textarea', placeholder: 'Difficulties and obstacles overcome', rows: 2 },
      { key: 'achievements', label: 'Achievements', type: 'textarea', placeholder: 'Notable accomplishments and successes', rows: 2 },
      { key: 'failures', label: 'Failures', type: 'textarea', placeholder: 'Significant failures and setbacks', rows: 2 },
      { key: 'losses', label: 'Losses', type: 'textarea', placeholder: 'Important things or people they\'ve lost', rows: 2 },
      { key: 'victories', label: 'Victories', type: 'textarea', placeholder: 'Major wins and triumphs', rows: 2 },
      { key: 'reputation', label: 'Reputation', type: 'textarea', placeholder: 'How they are known and perceived by others', rows: 2 },
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities',
    icon: 'Zap',
    description: 'Skills, talents, powers, and competencies',
    fields: [
      { key: 'abilities', label: 'Abilities', type: 'array', placeholder: 'flight, telepathy, super strength' },
      { key: 'skills', label: 'Skills', type: 'array', placeholder: 'swordsmanship, medicine, persuasion' },
      { key: 'talents', label: 'Talents', type: 'array', placeholder: 'music, art, leadership' },
      { key: 'expertise', label: 'Expertise', type: 'array', placeholder: 'Areas of specialized knowledge' },
      { key: 'specialAbilities', label: 'Special Abilities', type: 'textarea', placeholder: 'Detailed description of unique powers or abilities', rows: 4 },
      { key: 'powers', label: 'Powers', type: 'textarea', placeholder: 'Supernatural or extraordinary abilities', rows: 3 },
      { key: 'magicalAbilities', label: 'Magical Abilities', type: 'textarea', placeholder: 'Specific magical powers and spells', rows: 3 },
      { key: 'magicType', label: 'Magic Type', type: 'text', placeholder: 'Elemental, Divine, Arcane, etc.' },
      { key: 'magicSource', label: 'Magic Source', type: 'textarea', placeholder: 'Where their magic comes from (bloodline, training, artifact, etc.)', rows: 2 },
      { key: 'magicLimitations', label: 'Magic Limitations', type: 'textarea', placeholder: 'What restricts or limits their magical abilities', rows: 2 },
      { key: 'superpowers', label: 'Superpowers', type: 'textarea', placeholder: 'Superhuman abilities', rows: 2 },
      { key: 'strengths', label: 'Strengths', type: 'text', placeholder: 'determination, intelligence, empathy' },
      { key: 'competencies', label: 'Competencies', type: 'textarea', placeholder: 'Areas where they excel', rows: 2 },
      { key: 'training', label: 'Training', type: 'textarea', placeholder: 'Formal training and instruction received', rows: 2 },
      { key: 'experience', label: 'Experience', type: 'textarea', placeholder: 'Practical experience and knowledge gained', rows: 2 },
    ]
  },
  {
    id: 'story',
    title: 'Story',
    icon: 'BookOpen',
    description: 'Narrative function, goals, and character development',
    fields: [
      { key: 'goals', label: 'Goals', type: 'textarea', placeholder: 'What they want to achieve', rows: 3 },
      { key: 'objectives', label: 'Objectives', type: 'textarea', placeholder: 'Specific targets and aims', rows: 2 },
      { key: 'wants', label: 'Wants', type: 'textarea', placeholder: 'What they desire', rows: 2 },
      { key: 'obstacles', label: 'Obstacles', type: 'textarea', placeholder: 'What stands in their way', rows: 3 },
      { key: 'conflicts', label: 'Conflicts', type: 'textarea', placeholder: 'Internal and external conflicts', rows: 3 },
      { key: 'conflictSources', label: 'Conflict Sources', type: 'textarea', placeholder: 'Where conflicts originate from', rows: 2 },
      { key: 'stakes', label: 'Stakes', type: 'textarea', placeholder: 'What they stand to lose or gain', rows: 2 },
      { key: 'consequences', label: 'Consequences', type: 'textarea', placeholder: 'What happens if they fail', rows: 2 },
      { key: 'arc', label: 'Character Arc', type: 'textarea', placeholder: 'How they change throughout the story', rows: 3 },
      { key: 'journey', label: 'Journey', type: 'textarea', placeholder: 'Their path through the story', rows: 3 },
      { key: 'transformation', label: 'Transformation', type: 'textarea', placeholder: 'How they transform', rows: 2 },
      { key: 'growth', label: 'Growth', type: 'textarea', placeholder: 'How they develop and mature', rows: 2 },
      { key: 'allies', label: 'Allies', type: 'text', placeholder: 'Friends and supporters' },
      { key: 'enemies', label: 'Enemies', type: 'text', placeholder: 'Opponents and rivals' },
      { key: 'mentors', label: 'Mentors', type: 'text', placeholder: 'Teachers and guides' },
      { key: 'rivals', label: 'Rivals', type: 'text', placeholder: 'Competitive relationships' },
      { key: 'connectionToEvents', label: 'Connection To Events', type: 'textarea', placeholder: 'How they relate to story events', rows: 2 },
      { key: 'plotRelevance', label: 'Plot Relevance', type: 'textarea', placeholder: 'Their importance to the main plot', rows: 2 },
      { key: 'storyFunction', label: 'Story Function', type: 'textarea', placeholder: 'Their role in the narrative structure', rows: 2 },
      { key: 'languages', label: 'Languages', type: 'array', placeholder: 'Languages they speak' },
      { key: 'nativeLanguage', label: 'Native Language', type: 'text', placeholder: 'Their first language' },
      { key: 'accent', label: 'Accent', type: 'text', placeholder: 'Regional or cultural accent' },
      { key: 'dialect', label: 'Dialect', type: 'text', placeholder: 'Specific regional speech patterns' },
      { key: 'voiceDescription', label: 'Voice Description', type: 'text', placeholder: 'How their voice sounds' },
      { key: 'speechPatterns', label: 'Speech Patterns', type: 'text', placeholder: 'How they speak and communicate' },
      { key: 'vocabulary', label: 'Vocabulary', type: 'text', placeholder: 'Level and type of words they use' },
      { key: 'catchphrases', label: 'Catchphrases', type: 'text', placeholder: 'Phrases they often say' },
      { key: 'slang', label: 'Slang', type: 'text', placeholder: 'Informal language they use' },
      { key: 'communicationStyle', label: 'Communication Style', type: 'text', placeholder: 'How they interact with others' },
      { key: 'family', label: 'Family', type: 'textarea', placeholder: 'Parents, siblings, family relationships', rows: 3 },
      { key: 'parents', label: 'Parents', type: 'textarea', placeholder: 'Information about their parents', rows: 2 },
      { key: 'siblings', label: 'Siblings', type: 'textarea', placeholder: 'Brothers and sisters', rows: 2 },
      { key: 'spouse', label: 'Spouse', type: 'text', placeholder: 'Marriage partner' },
      { key: 'children', label: 'Children', type: 'text', placeholder: 'Their offspring' },
      { key: 'friends', label: 'Friends', type: 'textarea', placeholder: 'Close personal relationships', rows: 2 },
      { key: 'socialCircle', label: 'Social Circle', type: 'textarea', placeholder: 'Their broader social network', rows: 2 },
      { key: 'community', label: 'Community', type: 'textarea', placeholder: 'The community they belong to', rows: 2 },
      { key: 'culture', label: 'Culture', type: 'textarea', placeholder: 'Cultural background and influences', rows: 2 },
      { key: 'traditions', label: 'Traditions', type: 'text', placeholder: 'Cultural or family traditions they follow' },
      { key: 'customs', label: 'Customs', type: 'text', placeholder: 'Social customs they observe' },
      { key: 'religion', label: 'Religion', type: 'text', placeholder: 'Religious beliefs and practices' },
      { key: 'spirituality', label: 'Spirituality', type: 'text', placeholder: 'Spiritual beliefs and practices' },
      { key: 'politicalViews', label: 'Political Views', type: 'text', placeholder: 'Political beliefs and affiliations' },
    ]
  },
  {
    id: 'meta',
    title: 'Meta',
    icon: 'PenTool',
    description: 'Writer\'s notes, tags, and development information',
    fields: [
      { key: 'archetypes', label: 'Archetypes', type: 'array', placeholder: 'hero, mentor, trickster, shadow' },
      { key: 'tropes', label: 'Tropes', type: 'array', placeholder: 'chosen one, dark past, redemption arc' },
      { key: 'inspiration', label: 'Inspiration', type: 'text', placeholder: 'Real people, characters, or concepts that inspired this character' },
      { key: 'basedOn', label: 'Based On', type: 'text', placeholder: 'Historical figures, other characters, etc.' },
      { key: 'tags', label: 'Tags', type: 'array', placeholder: 'major character, love interest, comic relief' },
      { key: 'genre', label: 'Genre', type: 'text', placeholder: 'Fantasy, Sci-Fi, Romance, etc.' },
      { key: 'proseVibe', label: 'Prose Vibe', type: 'text', placeholder: 'Writing style and tone for this character' },
      { key: 'narrativeRole', label: 'Narrative Role', type: 'text', placeholder: 'Their function in the story structure' },
      { key: 'characterType', label: 'Character Type', type: 'text', placeholder: 'Protagonist, antagonist, foil, etc.' },
      { key: 'importance', label: 'Importance', type: 'text', placeholder: 'Major, minor, supporting, background' },
      { key: 'screenTime', label: 'Screen Time', type: 'text', placeholder: 'How much of the story they appear in' },
      { key: 'firstAppearance', label: 'First Appearance', type: 'text', placeholder: 'When they first appear in the story' },
      { key: 'lastAppearance', label: 'Last Appearance', type: 'text', placeholder: 'When they last appear in the story' },
      { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Writer\'s notes, development thoughts, reminders', rows: 5 },
      { key: 'development', label: 'Development', type: 'textarea', placeholder: 'Character development notes', rows: 3 },
      { key: 'evolution', label: 'Evolution', type: 'textarea', placeholder: 'How the character concept evolved', rows: 3 },
      { key: 'alternatives', label: 'Alternatives', type: 'textarea', placeholder: 'Alternative versions or ideas considered', rows: 2 },
      { key: 'unused', label: 'Unused', type: 'textarea', placeholder: 'Unused character ideas or elements', rows: 2 },
      { key: 'research', label: 'Research', type: 'textarea', placeholder: 'Research done for this character', rows: 2 },
      { key: 'references', label: 'References', type: 'textarea', placeholder: 'Reference materials used', rows: 2 },
      { key: 'mood', label: 'Mood', type: 'text', placeholder: 'Overall mood or atmosphere they bring' },
      { key: 'theme', label: 'Theme', type: 'text', placeholder: 'Themes they represent' },
      { key: 'symbolism', label: 'Symbolism', type: 'text', placeholder: 'What they symbolize in the story' },
    ]
  },
];

// Helper function to get all field keys for type safety
export function getAllFieldKeys(): string[] {
  return CHARACTER_SECTIONS.flatMap(section => section.fields.map(field => field.key));
}

// Helper function to get a field config by key
export function getFieldConfig(key: string): FieldConfig | undefined {
  for (const section of CHARACTER_SECTIONS) {
    const field = section.fields.find(f => f.key === key);
    if (field) return field;
  }
  return undefined;
}

// Icon mapping for components
export const ICON_MAP = {
  User: 'User',
  Eye: 'Eye', 
  Brain: 'Brain',
  Zap: 'Zap',
  BookOpen: 'BookOpen',
  Users: 'Users',
  PenTool: 'PenTool',
};