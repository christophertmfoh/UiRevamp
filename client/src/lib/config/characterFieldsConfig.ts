// Single source of truth for character field structure
// This configuration drives both the form and the detail view

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'array' | 'select';
  placeholder?: string;
  rows?: number;
  options?: string[];
}

export interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  fields: FieldConfig[];
}

export const CHARACTER_SECTIONS: SectionConfig[] = [
  {
    id: 'identity',
    title: 'Identity',
    icon: 'User',
    description: 'Basic character information and core identity',
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Character name' },
      { key: 'nicknames', label: 'Nicknames', type: 'text', placeholder: 'Common nicknames' },
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Sir, Dr., Captain, etc.' },
      { key: 'aliases', label: 'Aliases', type: 'text', placeholder: 'Secret identities, code names' },
      { key: 'role', label: 'Role in Story', type: 'select', options: ['protagonist', 'antagonist', 'supporting', 'love-interest', 'mentor', 'sidekick', 'villain', 'anti-hero', 'comic-relief', 'mysterious-figure', 'wise-elder', 'innocent', 'rebel', 'guardian', 'trickster'] },
      { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, elf, alien, etc.' },
      { key: 'ethnicity', label: 'Ethnicity/Culture', type: 'text', placeholder: 'Cultural background' },
      { key: 'age', label: 'Age', type: 'text', placeholder: '25, young adult, ancient' },
      { key: 'birthdate', label: 'Birth Date', type: 'text', placeholder: 'When they were born' },
      { key: 'class', label: 'Class', type: 'select', options: ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger', 'Paladin', 'Barbarian', 'Bard', 'Wizard', 'Sorcerer', 'Warlock', 'Druid', 'Monk', 'Fighter', 'Assassin', 'Knight', 'Scholar', 'Merchant', 'Noble', 'Commoner', 'Outlaw', 'Healer', 'Hunter', 'Craftsperson', 'Artist', 'Diplomat', 'Spy', 'Detective', 'Scientist', 'Engineer', 'Pilot', 'Soldier', 'Doctor', 'Teacher', 'Leader', 'Rebel', 'Explorer', 'Survivor'] },
      { key: 'profession', label: 'Profession', type: 'text', placeholder: 'What they do for work' },
      { key: 'occupation', label: 'Current Occupation', type: 'text', placeholder: 'Current job or role' },
      { key: 'zodiacSign', label: 'Zodiac Sign', type: 'text', placeholder: 'Astrological sign' },
    ]
  },
  {
    id: 'physical',
    title: 'Physical Appearance',
    icon: 'Eye',
    description: 'Physical traits, appearance, and distinguishing features',
    fields: [
      { key: 'height', label: 'Height', type: 'text', placeholder: '5\'8", tall, short' },
      { key: 'weight', label: 'Weight/Build', type: 'text', placeholder: 'Lean, muscular, heavy-set' },
      { key: 'build', label: 'Build', type: 'text', placeholder: 'Athletic, slim, stocky, etc.' },
      { key: 'bodyType', label: 'Body Type', type: 'text', placeholder: 'Ectomorph, mesomorph, endomorph' },
      { key: 'facialFeatures', label: 'Facial Features', type: 'textarea', placeholder: 'Shape of face, distinctive features', rows: 2 },
      { key: 'eyes', label: 'Eyes Description', type: 'text', placeholder: 'Shape, expression, etc.' },
      { key: 'eyeColor', label: 'Eye Color', type: 'select', options: ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber', 'Violet', 'Black', 'Red', 'Gold', 'Silver', 'Heterochromia', 'Glowing', 'Changing', 'Other'] },
      { key: 'hairColor', label: 'Hair Color', type: 'select', options: ['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Strawberry Blonde', 'White', 'Silver', 'Gray', 'Blue', 'Green', 'Purple', 'Pink', 'Multicolored', 'Bald', 'Other'] },
      { key: 'hairStyle', label: 'Hair Style', type: 'select', options: ['Long', 'Short', 'Medium', 'Curly', 'Straight', 'Wavy', 'Braided', 'Ponytail', 'Bun', 'Mohawk', 'Buzz Cut', 'Afro', 'Dreadlocks', 'Shaved', 'Messy', 'Neat', 'Wild', 'Other'] },
      { key: 'facialHair', label: 'Facial Hair', type: 'text', placeholder: 'Beard, mustache, goatee, etc.' },
      { key: 'skin', label: 'Skin Description', type: 'text', placeholder: 'Texture, condition, notable features' },
      { key: 'skinTone', label: 'Skin Tone', type: 'select', options: ['Very Fair', 'Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Brown', 'Dark', 'Very Dark', 'Pale', 'Rosy', 'Golden', 'Ashen', 'Translucent', 'Scaled', 'Furry', 'Other'] },
      { key: 'complexion', label: 'Complexion', type: 'text', placeholder: 'Clear, freckled, weathered, etc.' },
      { key: 'scars', label: 'Scars', type: 'textarea', placeholder: 'Visible scars and their stories', rows: 2 },
      { key: 'tattoos', label: 'Tattoos', type: 'textarea', placeholder: 'Tattoos and their meanings', rows: 2 },
      { key: 'piercings', label: 'Piercings', type: 'text', placeholder: 'Ear, nose, lip piercings, etc.' },
      { key: 'birthmarks', label: 'Birthmarks', type: 'text', placeholder: 'Notable birthmarks or moles' },
      { key: 'physicalDescription', label: 'Overall Physical Description', type: 'textarea', placeholder: 'Detailed physical appearance description', rows: 4 },
      { key: 'distinguishingMarks', label: 'Distinguishing Marks', type: 'textarea', placeholder: 'Scars, tattoos, birthmarks, etc.', rows: 3 },
      { key: 'attire', label: 'Attire', type: 'textarea', placeholder: 'Current outfit or typical clothing', rows: 2 },
      { key: 'clothingStyle', label: 'Clothing Style', type: 'textarea', placeholder: 'How they typically dress', rows: 3 },
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
      { key: 'temperament', label: 'Temperament', type: 'select', options: ['Calm', 'Fiery', 'Melancholic', 'Optimistic', 'Pessimistic', 'Aggressive', 'Passive', 'Volatile', 'Steady', 'Anxious', 'Confident', 'Impulsive', 'Thoughtful', 'Energetic', 'Lethargic', 'Balanced', 'Extreme', 'Peaceful', 'Confrontational', 'Adaptable'] },
      { key: 'beliefs', label: 'Beliefs & Values', type: 'textarea', placeholder: 'What they believe in, their core values', rows: 3 },
      { key: 'worldview', label: 'Worldview', type: 'textarea', placeholder: 'How they see the world, their philosophy', rows: 3 },
      { key: 'likes', label: 'Likes', type: 'textarea', placeholder: 'Things they enjoy', rows: 2 },
      { key: 'dislikes', label: 'Dislikes', type: 'textarea', placeholder: 'Things they hate or avoid', rows: 2 },
      { key: 'disposition', label: 'Disposition', type: 'text', placeholder: 'General attitude and mood tendencies' },
      { key: 'values', label: 'Values', type: 'textarea', placeholder: 'What they value most in life', rows: 2 },
      { key: 'principles', label: 'Principles', type: 'textarea', placeholder: 'Their guiding principles', rows: 2 },
      { key: 'morals', label: 'Morals', type: 'textarea', placeholder: 'Their moral code', rows: 2 },
      { key: 'ethics', label: 'Ethics', type: 'textarea', placeholder: 'Their ethical framework', rows: 2 },
      { key: 'virtues', label: 'Virtues', type: 'text', placeholder: 'Their positive qualities' },
      { key: 'vices', label: 'Vices', type: 'text', placeholder: 'Their negative tendencies' },
      { key: 'habits', label: 'Habits', type: 'textarea', placeholder: 'Regular behaviors and routines', rows: 2 },
      { key: 'quirks', label: 'Quirks & Habits', type: 'textarea', placeholder: 'Unique mannerisms, habits', rows: 2 },
      { key: 'idiosyncrasies', label: 'Idiosyncrasies', type: 'text', placeholder: 'Peculiar characteristics' },
      { key: 'petPeeves', label: 'Pet Peeves', type: 'text', placeholder: 'Things that annoy them' },
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
      { key: 'fears', label: 'Fears', type: 'textarea', placeholder: 'What they\'re afraid of, phobias', rows: 3 },
      { key: 'secrets', label: 'Secrets', type: 'textarea', placeholder: 'What they\'re hiding, dark secrets', rows: 3 },
      { key: 'trauma', label: 'Trauma & Wounds', type: 'textarea', placeholder: 'Past hurts, emotional wounds, trauma', rows: 3 },
      { key: 'vulnerabilities', label: 'Vulnerabilities', type: 'textarea', placeholder: 'Emotional weak points, what can hurt them', rows: 3 },
      { key: 'desires', label: 'Desires', type: 'textarea', placeholder: 'What they want or crave', rows: 2 },
      { key: 'needs', label: 'Needs', type: 'textarea', placeholder: 'What they require to feel whole', rows: 2 },
      { key: 'drives', label: 'Drives', type: 'textarea', placeholder: 'Internal forces that push them forward', rows: 2 },
      { key: 'ambitions', label: 'Ambitions', type: 'textarea', placeholder: 'Their goals and aspirations', rows: 2 },
      { key: 'phobias', label: 'Phobias', type: 'text', placeholder: 'Specific irrational fears' },
      { key: 'anxieties', label: 'Anxieties', type: 'text', placeholder: 'Things that make them anxious' },
      { key: 'insecurities', label: 'Insecurities', type: 'text', placeholder: 'Areas where they lack confidence' },
      { key: 'shame', label: 'Shame', type: 'textarea', placeholder: 'Things they are ashamed of', rows: 2 },
      { key: 'guilt', label: 'Guilt', type: 'textarea', placeholder: 'Things they feel guilty about', rows: 2 },
      { key: 'regrets', label: 'Regrets', type: 'textarea', placeholder: 'Things they wish they had done differently', rows: 2 },
      { key: 'wounds', label: 'Emotional Wounds', type: 'textarea', placeholder: 'Deep emotional injuries', rows: 2 },
      { key: 'copingMechanisms', label: 'Coping Mechanisms', type: 'textarea', placeholder: 'How they deal with stress, pain, difficulty', rows: 3 },
      { key: 'defenses', label: 'Defenses', type: 'text', placeholder: 'How they protect themselves emotionally' },
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
    title: 'Background & History',
    icon: 'BookOpen',
    description: 'Life story, upbringing, and formative experiences',
    fields: [
      { key: 'backstory', label: 'Backstory', type: 'textarea', placeholder: 'Their life story, history, background', rows: 5 },
      { key: 'childhood', label: 'Childhood', type: 'textarea', placeholder: 'Their early years, formative experiences', rows: 3 },
      { key: 'family', label: 'Family', type: 'textarea', placeholder: 'Parents, siblings, family relationships', rows: 3 },
      { key: 'education', label: 'Education', type: 'textarea', placeholder: 'Schooling, training, mentors', rows: 3 },
      { key: 'origin', label: 'Origin', type: 'textarea', placeholder: 'Where they come from', rows: 2 },
      { key: 'upbringing', label: 'Upbringing', type: 'textarea', placeholder: 'How they were raised', rows: 3 },
      { key: 'formativeEvents', label: 'Formative Events', type: 'textarea', placeholder: 'Key events that shaped who they are', rows: 3 },
      { key: 'socialClass', label: 'Social Class', type: 'text', placeholder: 'Upper class, middle class, working class, etc.' },
      { key: 'homeland', label: 'Homeland', type: 'text', placeholder: 'Where they consider home' },
      { key: 'culturalBackground', label: 'Cultural Background', type: 'textarea', placeholder: 'Their cultural heritage and influences', rows: 2 },
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities & Skills',
    icon: 'Zap',
    description: 'Skills, talents, powers, and competencies',
    fields: [
      { key: 'abilities', label: 'Abilities', type: 'array', placeholder: 'flight, telepathy, super strength' },
      { key: 'skills', label: 'Skills', type: 'array', placeholder: 'swordsmanship, medicine, persuasion' },
      { key: 'talents', label: 'Talents', type: 'array', placeholder: 'music, art, leadership' },
      { key: 'strengths', label: 'Strengths', type: 'text', placeholder: 'determination, intelligence, empathy' },
      { key: 'specialAbilities', label: 'Special Abilities', type: 'textarea', placeholder: 'Detailed description of unique powers or abilities', rows: 4 },
      { key: 'magicalAbilities', label: 'Magical Abilities', type: 'textarea', placeholder: 'Specific magical powers and spells', rows: 3 },
      { key: 'magicType', label: 'Magic Type', type: 'text', placeholder: 'Elemental, Divine, Arcane, etc.' },
      { key: 'magicSource', label: 'Magic Source', type: 'textarea', placeholder: 'Where their magic comes from (bloodline, training, artifact, etc.)', rows: 2 },
      { key: 'expertise', label: 'Expertise', type: 'array', placeholder: 'Areas of specialized knowledge' },
      { key: 'languages', label: 'Languages', type: 'array', placeholder: 'Languages they speak' },
      { key: 'equipment', label: 'Equipment', type: 'textarea', placeholder: 'Gear, tools, and items they carry', rows: 3 },
      { key: 'weapons', label: 'Weapons', type: 'text', placeholder: 'Weapons they are skilled with' },
      { key: 'magicLimitations', label: 'Magic Limitations', type: 'textarea', placeholder: 'What restricts or limits their magical abilities', rows: 2 },
    ]
  },
  {
    id: 'story',
    title: 'Story Role & Arc',
    icon: 'BookOpen',
    description: 'Narrative function, goals, and character development',
    fields: [
      { key: 'storyGoals', label: 'Story Goals', type: 'textarea', placeholder: 'What they want to achieve in this story', rows: 3 },
      { key: 'internalConflict', label: 'Internal Conflict', type: 'textarea', placeholder: 'Inner struggles and conflicts', rows: 3 },
      { key: 'externalConflict', label: 'External Conflict', type: 'textarea', placeholder: 'External challenges they face', rows: 3 },
      { key: 'goals', label: 'Goals', type: 'textarea', placeholder: 'What they want to achieve', rows: 3 },
      { key: 'obstacles', label: 'Obstacles', type: 'textarea', placeholder: 'What stands in their way', rows: 3 },
      { key: 'stakes', label: 'Stakes', type: 'textarea', placeholder: 'What they stand to lose or gain', rows: 2 },
      { key: 'arc', label: 'Character Arc', type: 'textarea', placeholder: 'How they change throughout the story', rows: 3 },
      { key: 'conflicts', label: 'Conflicts', type: 'textarea', placeholder: 'Internal and external conflicts', rows: 3 },
      { key: 'allies', label: 'Allies & Friends', type: 'textarea', placeholder: 'Who supports them', rows: 2 },
      { key: 'enemies', label: 'Enemies & Rivals', type: 'textarea', placeholder: 'Who opposes them', rows: 2 },
      { key: 'relationships', label: 'Relationships', type: 'textarea', placeholder: 'Key relationships with other characters', rows: 4 },
      { key: 'mentors', label: 'Mentors', type: 'text', placeholder: 'Teachers and guides' },
      { key: 'rivals', label: 'Rivals', type: 'text', placeholder: 'Competitive relationships' },
    ]
  },
  {
    id: 'meta',
    title: 'Meta Information',
    icon: 'PenTool',
    description: 'Writer\'s notes, tags, and development information',
    fields: [
      { key: 'tags', label: 'Tags', type: 'array', placeholder: 'major character, love interest, comic relief' },
      { key: 'inspiration', label: 'Inspiration', type: 'text', placeholder: 'Real people, characters, or concepts that inspired this character' },
      { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Writer\'s notes, development thoughts, reminders', rows: 5 },
      { key: 'voiceActorIdeas', label: 'Voice Actor Ideas', type: 'text', placeholder: 'Ideas for voice actors who could play this character' },
      { key: 'faceClaim', label: 'Face Claim', type: 'text', placeholder: 'Actor or person who looks like this character' },
      { key: 'playlist', label: 'Character Playlist', type: 'text', placeholder: 'Songs that represent this character' },
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