// Single source of truth for character field structure
// This configuration drives both the form and the detail view

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'array';
  placeholder?: string;
  rows?: number;
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
      { key: 'role', label: 'Role in Story', type: 'text', placeholder: 'protagonist, antagonist, supporting' },
      { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, elf, alien, etc.' },
      { key: 'ethnicity', label: 'Ethnicity/Culture', type: 'text', placeholder: 'Cultural background' },
      { key: 'age', label: 'Age', type: 'text', placeholder: '25, young adult, ancient' },
      { key: 'birthdate', label: 'Birth Date', type: 'text', placeholder: 'When they were born' },
      { key: 'class', label: 'Class', type: 'text', placeholder: 'Warrior, mage, rogue, etc.' },
      { key: 'profession', label: 'Profession', type: 'text', placeholder: 'What they do for work' },
      { key: 'occupation', label: 'Current Occupation', type: 'text', placeholder: 'Current job or role' },
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
      { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'Brown, blue, green, hazel' },
      { key: 'hairColor', label: 'Hair Color', type: 'text', placeholder: 'Blonde, brunette, black, red' },
      { key: 'hairStyle', label: 'Hair Style', type: 'text', placeholder: 'Long, short, curly, straight' },
      { key: 'skinTone', label: 'Skin Tone', type: 'text', placeholder: 'Fair, olive, dark, tanned' },
      { key: 'physicalDescription', label: 'Overall Physical Description', type: 'textarea', placeholder: 'Detailed physical appearance description', rows: 4 },
      { key: 'distinguishingMarks', label: 'Distinguishing Marks', type: 'textarea', placeholder: 'Scars, tattoos, birthmarks, etc.', rows: 3 },
      { key: 'clothingStyle', label: 'Clothing Style', type: 'textarea', placeholder: 'How they typically dress', rows: 3 },
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
      { key: 'temperament', label: 'Temperament', type: 'text', placeholder: 'calm, fiery, melancholic, optimistic' },
      { key: 'beliefs', label: 'Beliefs & Values', type: 'textarea', placeholder: 'What they believe in, their core values', rows: 3 },
      { key: 'worldview', label: 'Worldview', type: 'textarea', placeholder: 'How they see the world, their philosophy', rows: 3 },
      { key: 'likes', label: 'Likes', type: 'textarea', placeholder: 'Things they enjoy', rows: 2 },
      { key: 'dislikes', label: 'Dislikes', type: 'textarea', placeholder: 'Things they hate or avoid', rows: 2 },
      { key: 'quirks', label: 'Quirks & Habits', type: 'textarea', placeholder: 'Unique mannerisms, habits', rows: 2 },
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
      { key: 'copingMechanisms', label: 'Coping Mechanisms', type: 'textarea', placeholder: 'How they deal with stress, pain, difficulty', rows: 3 },
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
      { key: 'formativeEvents', label: 'Formative Events', type: 'textarea', placeholder: 'Key events that shaped who they are', rows: 3 },
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
      { key: 'magicLimitations', label: 'Magic Limitations', type: 'textarea', placeholder: 'What restricts or limits their magical abilities', rows: 2 },
    ]
  },
  {
    id: 'story',
    title: 'Story Role & Arc',
    icon: 'BookOpen',
    description: 'Narrative function, goals, and character development',
    fields: [
      { key: 'goals', label: 'Goals', type: 'textarea', placeholder: 'What they want to achieve', rows: 3 },
      { key: 'obstacles', label: 'Obstacles', type: 'textarea', placeholder: 'What stands in their way', rows: 3 },
      { key: 'arc', label: 'Character Arc', type: 'textarea', placeholder: 'How they change throughout the story', rows: 3 },
      { key: 'conflicts', label: 'Conflicts', type: 'textarea', placeholder: 'Internal and external conflicts', rows: 3 },
      { key: 'allies', label: 'Allies & Friends', type: 'textarea', placeholder: 'Who supports them', rows: 2 },
      { key: 'enemies', label: 'Enemies & Rivals', type: 'textarea', placeholder: 'Who opposes them', rows: 2 },
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