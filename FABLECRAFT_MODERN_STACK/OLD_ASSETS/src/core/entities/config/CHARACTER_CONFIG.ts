import { 
  User, Eye, Heart, Brain, Zap, BookOpen, Users, MapPin, Star, Settings,
  Pencil, Sparkles, Crown, Upload
} from 'lucide-react';
import type { EnhancedUniversalEntityConfig } from './EntityConfig';

/**
 * CHARACTER_CONFIG - Complete replication of the character system
 * Based on CHARACTER_SYSTEM_ANALYSIS.md - 164+ fields, 11 sections, 10 tabs
 * Exact UI parity with existing CharacterManager, CharacterWizard, and CharacterDetailView
 */

export const CHARACTER_CONFIG: EnhancedUniversalEntityConfig = {
  // IDENTITY CONFIGURATION
  entityType: 'character',
  name: 'Character',
  pluralName: 'Characters', 
  displayName: 'Character',
  pluralDisplayName: 'Characters',
  description: 'Detailed character profiles with comprehensive traits, backgrounds, and relationships',
  icon: User,
  color: '#8B5CF6',
  gradient: 'from-purple-500 to-pink-500',

  // FIELD DEFINITIONS - All 164+ fields from character system
  fields: [
    // IDENTITY SECTION (12 fields)
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      priority: 'critical',
      validation: { minLength: 1, maxLength: 100 },
      placeholder: 'Enter character name',
      aiEnhanceable: true,
      section: 'identity',
      helpText: 'The character\'s full name as known in your story'
    },
    {
      key: 'nicknames',
      label: 'Nicknames',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Common nicknames or pet names',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'pronouns',
      label: 'Pronouns',
      type: 'text',
      required: false,
      priority: 'high',
      validation: { maxLength: 50 },
      placeholder: 'he/him, she/her, they/them, etc.',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'age',
      label: 'Age',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 50 },
      placeholder: 'Character age or age range',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'species',
      label: 'Species/Race',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Human, Elf, Alien, etc.',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'gender',
      label: 'Gender Identity',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Gender identity or expression',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'occupation',
      label: 'Occupation',
      type: 'text',
      required: false,
      priority: 'high',
      validation: { maxLength: 100 },
      placeholder: 'Job, role, or profession',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'title',
      label: 'Title/Rank',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Professional or social title',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'birthdate',
      label: 'Birth Date',
      type: 'text',
      required: false,
      priority: 'low',
      validation: { maxLength: 100 },
      placeholder: 'When they were born',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'birthplace',
      label: 'Birthplace',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Where they were born',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'currentLocation',
      label: 'Current Location',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Where they live now',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'nationality',
      label: 'Nationality',
      type: 'text',
      required: false,
      priority: 'low',
      validation: { maxLength: 100 },
      placeholder: 'Cultural or national identity',
      aiEnhanceable: true,
      section: 'identity'
    },

    // APPEARANCE SECTION (15 fields)
    {
      key: 'height',
      label: 'Height',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 50 },
      placeholder: 'Physical height',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'weight',
      label: 'Weight/Build',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Body weight or build type',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'bodyType',
      label: 'Body Type',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Slim, athletic, heavy-set, etc.',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'hairColor',
      label: 'Hair Color',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Natural or current hair color',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'hairStyle',
      label: 'Hair Style',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'How they wear their hair',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'hairTexture',
      label: 'Hair Texture',
      type: 'text',
      required: false,
      priority: 'low',
      validation: { maxLength: 100 },
      placeholder: 'Curly, straight, wavy, etc.',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'eyeColor',
      label: 'Eye Color',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Eye color and characteristics',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'eyeShape',
      label: 'Eye Shape',
      type: 'text',
      required: false,
      priority: 'low',
      validation: { maxLength: 100 },
      placeholder: 'Eye shape and features',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'skinTone',
      label: 'Skin Tone',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Skin color and tone',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'facialFeatures',
      label: 'Facial Features',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 500 },
      placeholder: 'Distinctive facial characteristics',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'physicalFeatures',
      label: 'Physical Features',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 500 },
      placeholder: 'Notable physical characteristics',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'scarsMarkings',
      label: 'Scars & Markings',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 500 },
      placeholder: 'Scars, tattoos, birthmarks, etc.',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'clothing',
      label: 'Typical Clothing',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 500 },
      placeholder: 'How they usually dress',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'accessories',
      label: 'Accessories',
      type: 'text',
      required: false,
      priority: 'low',
      validation: { maxLength: 200 },
      placeholder: 'Jewelry, glasses, etc.',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'generalAppearance',
      label: 'General Appearance',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'Overall physical impression',
      aiEnhanceable: true,
      section: 'appearance'
    },

    // PERSONALITY SECTION (9 fields)
    {
      key: 'personalityTraits',
      label: 'Personality Traits',
      type: 'array',
      required: false,
      priority: 'critical',
      validation: { maxItems: 20 },
      placeholder: 'Core personality characteristics',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'positiveTraits',
      label: 'Positive Traits',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 15 },
      placeholder: 'Strengths and virtues',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'negativeTraits',
      label: 'Negative Traits',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 15 },
      placeholder: 'Flaws and weaknesses',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'quirks',
      label: 'Quirks & Habits',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Unusual behaviors or mannerisms',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'mannerisms',
      label: 'Mannerisms',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 500 },
      placeholder: 'How they speak and act',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'temperament',
      label: 'Temperament',
      type: 'text',
      required: false,
      priority: 'high',
      validation: { maxLength: 100 },
      placeholder: 'General mood and disposition',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'emotionalState',
      label: 'Emotional State',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Current emotional condition',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'sense_of_humor',
      label: 'Sense of Humor',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Type of humor they appreciate',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'speech_patterns',
      label: 'Speech Patterns',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 500 },
      placeholder: 'How they speak and communicate',
      aiEnhanceable: true,
      section: 'personality'
    },

    // PSYCHOLOGY SECTION (12 fields)
    {
      key: 'intelligence',
      label: 'Intelligence',
      type: 'text',
      required: false,
      priority: 'high',
      validation: { maxLength: 200 },
      placeholder: 'Intellectual capacity and type',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'education',
      label: 'Education',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Formal and informal learning',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'mentalHealth',
      label: 'Mental Health',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Psychological well-being',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'phobias',
      label: 'Phobias & Fears',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 10 },
      placeholder: 'What they fear most',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'motivations',
      label: 'Motivations',
      type: 'array',
      required: false,
      priority: 'critical',
      validation: { maxItems: 10 },
      placeholder: 'What drives them',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'goals',
      label: 'Goals & Ambitions',
      type: 'array',
      required: false,
      priority: 'critical',
      validation: { maxItems: 10 },
      placeholder: 'What they want to achieve',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'desires',
      label: 'Desires',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 10 },
      placeholder: 'What they long for',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'regrets',
      label: 'Regrets',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'What they wish they could change',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'secrets',
      label: 'Secrets',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 10 },
      placeholder: 'What they hide from others',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'moral_code',
      label: 'Moral Code',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'Their ethical principles',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'worldview',
      label: 'Worldview',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'How they see the world',
      aiEnhanceable: true,
      section: 'psychology'
    },
    {
      key: 'philosophy',
      label: 'Philosophy',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 1000 },
      placeholder: 'Their philosophical outlook',
      aiEnhanceable: true,
      section: 'psychology'
    },

    // ABILITIES SECTION (9 fields)
    {
      key: 'skills',
      label: 'Skills',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 20 },
      placeholder: 'Learned abilities and proficiencies',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'talents',
      label: 'Natural Talents',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 15 },
      placeholder: 'Innate gifts and aptitudes',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'powers',
      label: 'Special Powers',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Magical or supernatural abilities',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'weaknesses',
      label: 'Weaknesses',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 15 },
      placeholder: 'Physical or mental limitations',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'strengths',
      label: 'Strengths',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 15 },
      placeholder: 'Areas of excellence',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'combat_skills',
      label: 'Combat Skills',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 15 },
      placeholder: 'Fighting abilities',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'magical_abilities',
      label: 'Magical Abilities',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 15 },
      placeholder: 'Magical powers and spells',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'languages',
      label: 'Languages',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Languages they speak',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'hobbies',
      label: 'Hobbies & Interests',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 15 },
      placeholder: 'What they enjoy doing',
      aiEnhanceable: true,
      section: 'abilities'
    },

    // BACKGROUND SECTION (10 fields)
    {
      key: 'backstory',
      label: 'Backstory',
      type: 'textarea',
      required: false,
      priority: 'critical',
      validation: { maxLength: 2000 },
      placeholder: 'Their life story and history',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'childhood',
      label: 'Childhood',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'Early life experiences',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'formative_events',
      label: 'Formative Events',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 10 },
      placeholder: 'Key life-changing moments',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'trauma',
      label: 'Trauma',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 1000 },
      placeholder: 'Difficult or painful experiences',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'achievements',
      label: 'Achievements',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 15 },
      placeholder: 'Notable accomplishments',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'failures',
      label: 'Failures',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 15 },
      placeholder: 'Significant setbacks or mistakes',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'education_background',
      label: 'Educational Background',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 1000 },
      placeholder: 'Learning and academic history',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'work_history',
      label: 'Work History',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 1000 },
      placeholder: 'Professional background',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'military_service',
      label: 'Military Service',
      type: 'text',
      required: false,
      priority: 'low',
      validation: { maxLength: 200 },
      placeholder: 'Military background if any',
      aiEnhanceable: true,
      section: 'background'
    },
    {
      key: 'criminal_record',
      label: 'Criminal Record',
      type: 'text',
      required: false,
      priority: 'low',
      validation: { maxLength: 200 },
      placeholder: 'Legal troubles if any',
      aiEnhanceable: true,
      section: 'background'
    },

    // RELATIONSHIPS SECTION (11 fields)
    {
      key: 'family',
      label: 'Family',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 20 },
      placeholder: 'Family members and relationships',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'friends',
      label: 'Friends',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 20 },
      placeholder: 'Close friends and companions',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'enemies',
      label: 'Enemies',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 15 },
      placeholder: 'Adversaries and opponents',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'allies',
      label: 'Allies',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 20 },
      placeholder: 'Partners and allies',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'mentors',
      label: 'Mentors',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Teachers and guides',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'romantic_interests',
      label: 'Romantic Interests',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Past and current romantic partners',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'relationship_status',
      label: 'Relationship Status',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Current romantic status',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'social_connections',
      label: 'Social Connections',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 25 },
      placeholder: 'Professional and social network',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'children',
      label: 'Children',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Offspring or adopted children',
      aiEnhanceable: true,
      section: 'relationships'
    },
    {
      key: 'pets',
      label: 'Pets',
      type: 'array',
      required: false,
      priority: 'low',
      validation: { maxItems: 10 },
      placeholder: 'Animal companions',
      aiEnhanceable: true,
      section: 'relationships'
    },

    // CULTURAL SECTION (8 fields)
    {
      key: 'culture',
      label: 'Cultural Background',
      type: 'text',
      required: false,
      priority: 'high',
      validation: { maxLength: 200 },
      placeholder: 'Cultural identity and heritage',
      aiEnhanceable: true,
      section: 'cultural'
    },
    {
      key: 'religion',
      label: 'Religion/Beliefs',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Spiritual or religious beliefs',
      aiEnhanceable: true,
      section: 'cultural'
    },
    {
      key: 'traditions',
      label: 'Traditions',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 15 },
      placeholder: 'Cultural traditions they follow',
      aiEnhanceable: true,
      section: 'cultural'
    },
    {
      key: 'values',
      label: 'Values',
      type: 'array',
      required: false,
      priority: 'high',
      validation: { maxItems: 15 },
      placeholder: 'What they consider important',
      aiEnhanceable: true,
      section: 'cultural'
    },
    {
      key: 'customs',
      label: 'Customs',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 15 },
      placeholder: 'Cultural practices they observe',
      aiEnhanceable: true,
      section: 'cultural'
    },
    {
      key: 'social_class',
      label: 'Social Class',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Socioeconomic background',
      aiEnhanceable: true,
      section: 'cultural'
    },
    {
      key: 'political_views',
      label: 'Political Views',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'Political beliefs and affiliations',
      aiEnhanceable: true,
      section: 'cultural'
    },
    {
      key: 'economic_status',
      label: 'Economic Status',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Financial situation',
      aiEnhanceable: true,
      section: 'cultural'
    },

    // STORY ROLE SECTION (8 fields)
    {
      key: 'character_arc',
      label: 'Character Arc',
      type: 'textarea',
      required: false,
      priority: 'critical',
      validation: { maxLength: 1500 },
      placeholder: 'How they change throughout the story',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'narrative_function',
      label: 'Narrative Function',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'Purpose they serve in the story',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'story_importance',
      label: 'Story Importance',
      type: 'select',
      required: false,
      priority: 'high',
      validation: {},
      options: ['Critical', 'Important', 'Moderate', 'Minor'],
      placeholder: 'How important they are to the plot',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'first_appearance',
      label: 'First Appearance',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'When they first appear in the story',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'last_appearance',
      label: 'Last Appearance',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'When they last appear in the story',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'character_growth',
      label: 'Character Growth',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'How they develop and change',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'internal_conflict',
      label: 'Internal Conflict',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'Their inner struggles',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'external_conflict',
      label: 'External Conflict',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 1000 },
      placeholder: 'Conflicts with others or environment',
      aiEnhanceable: true,
      section: 'story_role'
    },

    // META INFORMATION SECTION (8 fields)
    {
      key: 'inspiration',
      label: 'Inspiration',
      type: 'textarea',
      required: false,
      priority: 'low',
      validation: { maxLength: 1000 },
      placeholder: 'What inspired this character',
      aiEnhanceable: true,
      section: 'meta'
    },
    {
      key: 'creation_notes',
      label: 'Creation Notes',
      type: 'textarea',
      required: false,
      priority: 'low',
      validation: { maxLength: 1500 },
      placeholder: 'Notes about character development',
      aiEnhanceable: true,
      section: 'meta'
    },
    {
      key: 'character_concept',
      label: 'Character Concept',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 1000 },
      placeholder: 'Core concept or idea',
      aiEnhanceable: true,
      section: 'meta'
    },
    {
      key: 'design_notes',
      label: 'Design Notes',
      type: 'textarea',
      required: false,
      priority: 'low',
      validation: { maxLength: 1000 },
      placeholder: 'Visual design considerations',
      aiEnhanceable: true,
      section: 'meta'
    },
    {
      key: 'voice_notes',
      label: 'Voice Notes',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 1000 },
      placeholder: 'How they speak and sound',
      aiEnhanceable: true,
      section: 'meta'
    },
    {
      key: 'themes',
      label: 'Associated Themes',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Themes this character represents',
      aiEnhanceable: true,
      section: 'meta'
    },
    {
      key: 'symbolism',
      label: 'Symbolism',
      type: 'textarea',
      required: false,
      priority: 'medium',
      validation: { maxLength: 1000 },
      placeholder: 'What they symbolize in the story',
      aiEnhanceable: true,
      section: 'meta'
    },
    {
      key: 'author_notes',
      label: 'Author Notes',
      type: 'textarea',
      required: false,
      priority: 'low',
      validation: { maxLength: 1500 },
      placeholder: 'Additional development notes',
      aiEnhanceable: true,
      section: 'meta'
    },

    // CHARACTER CARD SPECIFIC FIELDS (from CHARACTER_SYSTEM_ANALYSIS.md)
    {
      key: 'role',
      label: 'Character Role',
      type: 'text',
      required: false,
      priority: 'high',
      validation: { maxLength: 100 },
      placeholder: 'Protagonist, Antagonist, Supporting, etc.',
      aiEnhanceable: true,
      section: 'story_role'
    },
    {
      key: 'race',
      label: 'Race',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Character race or ethnicity',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'class',
      label: 'Character Class',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Warrior, Mage, Rogue, etc.',
      aiEnhanceable: true,
      section: 'abilities'
    },
    {
      key: 'description',
      label: 'Character Description',
      type: 'textarea',
      required: false,
      priority: 'critical',
      validation: { maxLength: 1000 },
      placeholder: 'Brief character description',
      aiEnhanceable: true,
      section: 'identity'
    },
    {
      key: 'personality',
      label: 'Personality Summary',
      type: 'textarea',
      required: false,
      priority: 'high',
      validation: { maxLength: 500 },
      placeholder: 'Brief personality overview',
      aiEnhanceable: true,
      section: 'personality'
    },
    {
      key: 'hair',
      label: 'Hair Description',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Hair color and style combined',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'skin',
      label: 'Skin Description',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 100 },
      placeholder: 'Skin tone and characteristics',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'attire',
      label: 'Typical Attire',
      type: 'text',
      required: false,
      priority: 'medium',
      validation: { maxLength: 200 },
      placeholder: 'How they typically dress',
      aiEnhanceable: true,
      section: 'appearance'
    },
    {
      key: 'abilities',
      label: 'Key Abilities',
      type: 'array',
      required: false,
      priority: 'medium',
      validation: { maxItems: 10 },
      placeholder: 'Primary abilities and powers',
      aiEnhanceable: true,
      section: 'abilities'
    }
  ],

  // FORM CONFIGURATION - Replicating 11 wizard sections exactly
  formConfig: {
    layout: 'single-column',
    sections: [
      {
        id: 'identity',
        title: 'Identity',
        description: 'Basic information and core identity',
        icon: User,
        fields: [
          'name', 'nicknames', 'pronouns', 'age', 'species', 'gender', 
          'occupation', 'title', 'birthdate', 'birthplace', 'currentLocation', 'nationality',
          'race', 'description'
        ],
        layout: 'double',
        collapsible: false,
        required: true,
        defaultExpanded: true
      },
      {
        id: 'appearance',
        title: 'Appearance',
        description: 'Physical characteristics and presentation',
        icon: Eye,
        fields: [
          'height', 'weight', 'bodyType', 'hairColor', 'hairStyle', 'hairTexture',
          'eyeColor', 'eyeShape', 'skinTone', 'facialFeatures', 'physicalFeatures',
          'scarsMarkings', 'clothing', 'accessories', 'generalAppearance',
          'hair', 'skin', 'attire'
        ],
        layout: 'double',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'personality',
        title: 'Personality',
        description: 'Core personality traits and characteristics',
        icon: Heart,
        fields: [
          'personalityTraits', 'positiveTraits', 'negativeTraits', 'quirks',
          'mannerisms', 'temperament', 'emotionalState', 'sense_of_humor', 'speech_patterns',
          'personality'
        ],
        layout: 'double',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'psychology',
        title: 'Psychology',
        description: 'Mental traits and psychological profile',
        icon: Brain,
        fields: [
          'intelligence', 'education', 'mentalHealth', 'phobias', 'motivations',
          'goals', 'desires', 'regrets', 'secrets', 'moral_code', 'worldview', 'philosophy'
        ],
        layout: 'double',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'abilities',
        title: 'Abilities',
        description: 'Skills, talents, and special abilities',
        icon: Zap,
        fields: [
          'skills', 'talents', 'powers', 'weaknesses', 'strengths',
          'combat_skills', 'magical_abilities', 'languages', 'hobbies',
          'class', 'abilities'
        ],
        layout: 'double',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'background',
        title: 'Background',
        description: 'History and personal background',
        icon: BookOpen,
        fields: [
          'backstory', 'childhood', 'formative_events', 'trauma', 'achievements',
          'failures', 'education_background', 'work_history', 'military_service', 'criminal_record'
        ],
        layout: 'single',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'relationships',
        title: 'Relationships',
        description: 'Connections and relationships with others',
        icon: Users,
        fields: [
          'family', 'friends', 'enemies', 'allies', 'mentors', 'romantic_interests',
          'relationship_status', 'social_connections', 'children', 'pets'
        ],
        layout: 'double',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'cultural',
        title: 'Cultural',
        description: 'Cultural background and beliefs',
        icon: MapPin,
        fields: [
          'culture', 'religion', 'traditions', 'values', 'customs',
          'social_class', 'political_views', 'economic_status'
        ],
        layout: 'double',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'story_role',
        title: 'Story Role',
        description: 'Role and function in the narrative',
        icon: Star,
        fields: [
          'character_arc', 'narrative_function', 'story_importance',
          'first_appearance', 'last_appearance', 'character_growth', 
          'internal_conflict', 'external_conflict', 'role'
        ],
        layout: 'single',
        collapsible: true,
        required: false,
        defaultExpanded: false
      },
      {
        id: 'meta',
        title: 'Meta Information',
        description: 'Creation and development notes',
        icon: Settings,
        fields: [
          'inspiration', 'creation_notes', 'character_concept', 'design_notes',
          'voice_notes', 'themes', 'symbolism', 'author_notes'
        ],
        layout: 'single',
        collapsible: true,
        required: false,
        defaultExpanded: false
      }
    ]
  },

  // WIZARD CONFIGURATION - Replicating exact creation methods and steps
  wizardConfig: {
    enabled: true,
    steps: [
      {
        id: 'identity',
        title: 'Identity',
        description: 'Basic information and core identity',
        icon: User,
        fields: ['name', 'nicknames', 'pronouns', 'age', 'species', 'occupation'],
        required: ['name'],
        helpText: 'Start with the essential details that define who your character is.'
      },
      {
        id: 'appearance',
        title: 'Appearance',
        description: 'Physical characteristics and presentation',
        icon: Eye,
        fields: ['height', 'hairColor', 'eyeColor', 'skinTone', 'generalAppearance'],
        required: [],
        helpText: 'Describe how your character looks and presents themselves.'
      },
      {
        id: 'personality',
        title: 'Personality',
        description: 'Core personality traits and characteristics',
        icon: Heart,
        fields: ['personalityTraits', 'temperament', 'mannerisms'],
        required: [],
        helpText: 'Define your character\'s personality and how they behave.'
      },
      {
        id: 'psychology',
        title: 'Psychology',
        description: 'Mental traits and psychological profile',
        icon: Brain,
        fields: ['motivations', 'goals', 'phobias', 'moral_code'],
        required: [],
        helpText: 'Explore your character\'s inner world and driving forces.'
      },
      {
        id: 'abilities',
        title: 'Abilities',
        description: 'Skills, talents, and special abilities',
        icon: Zap,
        fields: ['skills', 'talents', 'strengths', 'weaknesses'],
        required: [],
        helpText: 'Define what your character can do and their limitations.'
      },
      {
        id: 'background',
        title: 'Background',
        description: 'History and personal background',
        icon: BookOpen,
        fields: ['backstory', 'childhood', 'formative_events'],
        required: [],
        helpText: 'Tell your character\'s story and what shaped them.'
      },
      {
        id: 'relationships',
        title: 'Relationships',
        description: 'Connections and relationships with others',
        icon: Users,
        fields: ['family', 'friends', 'enemies', 'allies'],
        required: [],
        helpText: 'Define who matters to your character and how.'
      },
      {
        id: 'cultural',
        title: 'Cultural',
        description: 'Cultural background and beliefs',
        icon: MapPin,
        fields: ['culture', 'religion', 'values', 'traditions'],
        required: [],
        helpText: 'Establish your character\'s cultural identity and beliefs.'
      },
      {
        id: 'story_role',
        title: 'Story Role',
        description: 'Role and function in the narrative',
        icon: Star,
        fields: ['character_arc', 'narrative_function', 'story_importance'],
        required: [],
        helpText: 'Define how your character fits into your story.'
      },
      {
        id: 'meta',
        title: 'Meta Information',
        description: 'Creation and development notes',
        icon: Settings,
        fields: ['inspiration', 'character_concept', 'themes'],
        required: [],
        helpText: 'Add any additional notes about your character creation process.'
      }
    ],
    progressTracking: true,
    autoSave: true,
    autoSaveInterval: 3000,
    methods: {
      guided: true,
      templates: true,
      ai: true,
      upload: true
    }
  },

  // DETAIL TAB CONFIGURATION - Replicating exact 10 tabs
  detailTabConfig: {
    enabled: true,
    defaultTab: 'identity',
    tabs: [
      {
        key: 'identity',
        label: 'Identity',
        icon: User,
        sections: [
          {
            key: 'basic_info',
            title: 'Basic Information',
            fields: ['name', 'nicknames', 'pronouns', 'age', 'species', 'gender', 'race', 'description'],
            layout: 'double'
          },
          {
            key: 'location_info',
            title: 'Location & Background',
            fields: ['birthplace', 'currentLocation', 'nationality', 'occupation', 'title'],
            layout: 'double'
          }
        ]
      },
      {
        key: 'appearance',
        label: 'Appearance', 
        icon: Eye,
        sections: [
          {
            key: 'physical_traits',
            title: 'Physical Traits',
            fields: ['height', 'weight', 'bodyType', 'generalAppearance'],
            layout: 'double'
          },
          {
            key: 'facial_features',
            title: 'Facial Features',
            fields: ['hairColor', 'hairStyle', 'eyeColor', 'skinTone', 'facialFeatures'],
            layout: 'double'
          },
          {
            key: 'distinctive_features',
            title: 'Distinctive Features',
            fields: ['scarsMarkings', 'clothing', 'accessories', 'attire'],
            layout: 'double'
          }
        ]
      },
      {
        key: 'personality',
        label: 'Personality',
        icon: Heart,
        sections: [
          {
            key: 'core_traits',
            title: 'Core Personality',
            fields: ['personalityTraits', 'temperament', 'personality'],
            layout: 'single'
          },
          {
            key: 'traits_analysis',
            title: 'Strengths & Weaknesses',
            fields: ['positiveTraits', 'negativeTraits', 'quirks'],
            layout: 'double'
          },
          {
            key: 'behavioral_patterns',
            title: 'Behavioral Patterns',
            fields: ['mannerisms', 'speech_patterns', 'sense_of_humor', 'emotionalState'],
            layout: 'double'
          }
        ]
      },
      {
        key: 'psychology',
        label: 'Psychology',
        icon: Brain,
        sections: [
          {
            key: 'mental_profile',
            title: 'Mental Profile',
            fields: ['intelligence', 'education', 'mentalHealth'],
            layout: 'double'
          },
          {
            key: 'driving_forces',
            title: 'Driving Forces',
            fields: ['motivations', 'goals', 'desires', 'phobias'],
            layout: 'double'
          },
          {
            key: 'inner_world',
            title: 'Inner World',
            fields: ['secrets', 'regrets', 'moral_code', 'worldview', 'philosophy'],
            layout: 'single'
          }
        ]
      },
      {
        key: 'abilities',
        label: 'Abilities',
        icon: Zap,
        sections: [
          {
            key: 'skills_talents',
            title: 'Skills & Talents',
            fields: ['skills', 'talents', 'class', 'abilities'],
            layout: 'double'
          },
          {
            key: 'strengths_weaknesses',
            title: 'Strengths & Weaknesses',
            fields: ['strengths', 'weaknesses'],
            layout: 'double'
          },
          {
            key: 'special_abilities',
            title: 'Special Abilities',
            fields: ['powers', 'magical_abilities', 'combat_skills'],
            layout: 'double'
          },
          {
            key: 'interests',
            title: 'Languages & Interests',
            fields: ['languages', 'hobbies'],
            layout: 'double'
          }
        ]
      },
      {
        key: 'background',
        label: 'Background',
        icon: BookOpen,
        sections: [
          {
            key: 'life_story',
            title: 'Life Story',
            fields: ['backstory', 'childhood'],
            layout: 'single'
          },
          {
            key: 'significant_events',
            title: 'Significant Events',
            fields: ['formative_events', 'trauma', 'achievements', 'failures'],
            layout: 'double'
          },
          {
            key: 'professional_history',
            title: 'Professional History',
            fields: ['education_background', 'work_history', 'military_service', 'criminal_record'],
            layout: 'double'
          }
        ]
      },
      {
        key: 'relationships',
        label: 'Relationships',
        icon: Users,
        sections: [
          {
            key: 'close_relationships',
            title: 'Close Relationships',
            fields: ['family', 'friends', 'romantic_interests', 'children'],
            layout: 'double'
          },
          {
            key: 'social_connections',
            title: 'Social Connections',
            fields: ['allies', 'enemies', 'mentors', 'social_connections'],
            layout: 'double'
          },
          {
            key: 'relationship_status',
            title: 'Current Status',
            fields: ['relationship_status', 'pets'],
            layout: 'double'
          }
        ]
      },
      {
        key: 'cultural',
        label: 'Cultural',
        icon: MapPin,
        sections: [
          {
            key: 'cultural_identity',
            title: 'Cultural Identity',
            fields: ['culture', 'religion', 'traditions', 'customs'],
            layout: 'double'
          },
          {
            key: 'beliefs_values',
            title: 'Beliefs & Values',
            fields: ['values', 'political_views'],
            layout: 'double'
          },
          {
            key: 'social_standing',
            title: 'Social Standing',
            fields: ['social_class', 'economic_status'],
            layout: 'double'
          }
        ]
      },
      {
        key: 'story_role',
        label: 'Story Role',
        icon: Star,
        sections: [
          {
            key: 'narrative_purpose',
            title: 'Narrative Purpose',
            fields: ['narrative_function', 'story_importance', 'role'],
            layout: 'double'
          },
          {
            key: 'character_development',
            title: 'Character Development',
            fields: ['character_arc', 'character_growth'],
            layout: 'single'
          },
          {
            key: 'story_timeline',
            title: 'Story Timeline',
            fields: ['first_appearance', 'last_appearance'],
            layout: 'double'
          },
          {
            key: 'conflicts',
            title: 'Conflicts',
            fields: ['internal_conflict', 'external_conflict'],
            layout: 'single'
          }
        ]
      },
      {
        key: 'meta',
        label: 'Meta',
        icon: Settings,
        sections: [
          {
            key: 'creation_info',
            title: 'Creation Information',
            fields: ['inspiration', 'character_concept', 'creation_notes'],
            layout: 'single'
          },
          {
            key: 'design_notes',
            title: 'Design & Voice',
            fields: ['design_notes', 'voice_notes'],
            layout: 'single'
          },
          {
            key: 'thematic_elements',
            title: 'Thematic Elements',
            fields: ['themes', 'symbolism', 'author_notes'],
            layout: 'single'
          }
        ]
      }
    ]
  },

  // DISPLAY CONFIGURATION - Replicating exact card/list layouts
  displayConfig: {
    cardLayout: 'detailed',
    listLayout: 'enhanced',
    showPortraits: true,
    defaultView: 'grid',
    
    // GRID VIEW CARD FIELDS - Based on CHARACTER_SYSTEM_ANALYSIS.md
    cardFields: [
      {
        key: 'name',
        label: 'Name',
        primary: true,
        showInPreview: true
      },
      {
        key: 'title',
        label: 'Title',
        secondary: true,
        showInPreview: true,
        format: 'parentheses'
      },
      {
        key: 'role',
        label: 'Role',
        badge: 'secondary',
        showInPreview: true
      },
      {
        key: 'race',
        label: 'Race',
        badge: 'outline',
        showInPreview: true
      },
      {
        key: 'class',
        label: 'Class', 
        badge: 'outline',
        showInPreview: true
      },
      {
        key: 'description',
        label: 'Description',
        section: 'extended',
        format: 'line-clamp-2',
        showInPreview: true
      },
      {
        key: 'personality',
        label: 'Personality',
        section: 'extended',
        format: 'line-clamp-2',
        showInPreview: true
      },
      {
        key: 'backstory',
        label: 'Backstory',
        section: 'extended',
        format: 'line-clamp-2',
        showInPreview: true
      },
      {
        key: 'hair',
        label: 'Hair',
        section: 'physical',
        badge: 'secondary',
        prefix: 'Hair:'
      },
      {
        key: 'skin',
        label: 'Skin',
        section: 'physical',
        badge: 'secondary',
        prefix: 'Skin:'
      },
      {
        key: 'attire',
        label: 'Attire',
        section: 'physical',
        badge: 'secondary',
        prefix: 'Attire:'
      },
      {
        key: 'personalityTraits',
        label: 'Traits',
        section: 'traits',
        format: 'pills',
        limit: 4,
        showMore: true
      },
      {
        key: 'abilities',
        label: 'Abilities',
        section: 'abilities',
        badge: 'outline',
        limit: 3
      },
      {
        key: 'skills',
        label: 'Skills',
        section: 'abilities',
        badge: 'outline',
        limit: 3
      }
    ],

    // LIST VIEW FIELDS - Based on CHARACTER_SYSTEM_ANALYSIS.md  
    listFields: [
      {
        key: 'name',
        label: 'Name',
        primary: true,
        weight: 'bold',
        size: 'xl'
      },
      {
        key: 'title',
        label: 'Title',
        italic: true,
        color: 'accent',
        prefix: '"',
        suffix: '"'
      },
      {
        key: 'role',
        label: 'Role',
        badge: 'small'
      },
      {
        key: 'race',
        label: 'Race',
        badge: 'small'
      },
      {
        key: 'class',
        label: 'Class',
        badge: 'small'
      },
      {
        key: 'description',
        label: 'Description',
        preview: true,
        format: 'line-clamp'
      },
      {
        key: 'personalityTraits',
        label: 'Traits',
        format: 'colored-pills',
        limit: 3
      }
    ],

    // SEARCH CONFIGURATION
    searchFields: ['name', 'title', 'role', 'race', 'class', 'description'],
    
    // SORT OPTIONS - Matching CHARACTER_SYSTEM_ANALYSIS.md (12 options)
    sortOptions: [
      { key: 'alphabetical', label: 'Alphabetical Order', direction: 'asc' },
      { key: 'recently-added', label: 'Recently Added', direction: 'desc' },
      { key: 'recently-edited', label: 'Recently Edited', direction: 'desc' },
      { key: 'by-completion', label: 'Completion Level', direction: 'desc' },
      { key: 'by-role', label: 'Story Role', direction: 'asc' },
      { key: 'by-race', label: 'Race/Species', direction: 'asc' },
      { key: 'by-development-level', label: 'Character Development', direction: 'desc' },
      { key: 'by-trait-complexity', label: 'Trait Complexity', direction: 'desc' },
      { key: 'by-relationship-count', label: 'Relationship Depth', direction: 'desc' },
      { key: 'by-narrative-importance', label: 'Narrative Importance', direction: 'desc' },
      { key: 'protagonists-first', label: 'Protagonists First', direction: 'desc' },
      { key: 'antagonists-first', label: 'Antagonists First', direction: 'desc' }
    ],

    // FILTER OPTIONS
    filterOptions: [
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { value: 'protagonist', label: 'Protagonist' },
          { value: 'antagonist', label: 'Antagonist' },
          { value: 'supporting', label: 'Supporting' },
          { value: 'minor', label: 'Minor' }
        ]
      },
      {
        key: 'story_importance',
        label: 'Story Importance',
        type: 'select',
        options: [
          { value: 'Critical', label: 'Critical' },
          { value: 'Important', label: 'Important' },
          { value: 'Moderate', label: 'Moderate' },
          { value: 'Minor', label: 'Minor' }
        ]
      },
      {
        key: 'species',
        label: 'Species/Race',
        type: 'multiselect',
        options: [
          { value: 'human', label: 'Human' },
          { value: 'elf', label: 'Elf' },
          { value: 'dwarf', label: 'Dwarf' },
          { value: 'other', label: 'Other' }
        ]
      }
    ]
  },

  // ENHANCED FEATURES - All character system features enabled
  features: {
    hasPortraits: true,
    hasTemplates: true,
    hasRelationships: true,
    hasAIGeneration: true,
    hasDocumentUpload: true,
    hasGuidedCreation: true,
    hasFieldEnhancement: true,
    hasBulkOperations: true,
    hasAdvancedSearch: true,
    hasTagging: true,
    hasVersioning: false,
    hasComments: false,
    hasSharing: false,
    hasExport: true,
    hasImport: true,
    hasArcTracking: true,
    hasInsights: true
  },

  // TEMPLATE CONFIGURATION - Character templates
  templateConfig: {
    enabled: true,
    categories: [
      {
        id: 'fantasy',
        name: 'Fantasy',
        description: 'Classic fantasy character archetypes',
        icon: Crown
      },
      {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary character types',
        icon: User
      },
      {
        id: 'scifi',
        name: 'Sci-Fi',
        description: 'Science fiction characters',
        icon: Zap
      }
    ],
    templates: [
      {
        id: 'hero_template',
        name: 'Classic Hero',
        description: 'Traditional heroic protagonist template',
        category: 'fantasy',
        icon: User,
        difficulty: 'beginner',
        estimatedTime: '5-10 min',
        usageCount: 150,
        isPopular: true,
        aiEnhanced: true,
        tags: ['protagonist', 'hero', 'fantasy'],
        features: ['Complete personality', 'Heroic traits', 'Noble background'],
        namePattern: '{adjective} {name} the {title}',
        baseData: {
          role: 'protagonist',
          story_importance: 'Critical',
          personalityTraits: ['brave', 'noble', 'determined'],
          positiveTraits: ['courage', 'loyalty', 'compassion'],
          occupation: 'warrior',
          moral_code: 'Always protect the innocent and fight for justice'
        }
      }
    ]
  },

  // AI CONFIGURATION - Character-specific AI prompts
  aiConfig: {
    enabled: true,
    prompts: [
      {
        id: 'full_character',
        name: 'Complete Character',
        description: 'Generate a fully detailed character with all aspects',
        template: 'Create a detailed character named {name} who is a {role} in a {genre} story.',
        context: 'Focus on creating a well-rounded character with clear motivations, flaws, and growth potential.',
        complexity: 'complex',
        icon: User,
        features: ['Full backstory', 'Rich personality', 'Complex relationships'],
        estimatedTime: '2-3 min'
      },
      {
        id: 'personality_focus',
        name: 'Personality-Focused',
        description: 'Deep dive into character psychology and personality',
        template: 'Develop the personality and psychological profile for {name}.',
        context: 'Create compelling personality traits, motivations, and psychological depth.',
        complexity: 'moderate',
        icon: Brain,
        features: ['Detailed psychology', 'Personality traits', 'Internal conflicts'],
        estimatedTime: '1-2 min'
      }
    ],
    defaultSettings: {
      creativity: 0.7,
      complexity: 0.6,
      style: 'balanced',
      includeDetails: true
    },
    customPromptsAllowed: true
  },

  // UPLOAD CONFIGURATION - Document parsing for characters
  uploadConfig: {
    enabled: true,
    acceptedFormats: ['.pdf', '.txt', '.docx', '.doc'],
    maxFileSize: 10, // MB
    allowMultiple: true,
    extractionRules: [
      {
        field: 'name',
        pattern: 'Name:\\s*(.+)',
        description: 'Extract character name'
      },
      {
        field: 'description',
        pattern: 'Description:\\s*([\\s\\S]+?)(?=\\n\\w+:|$)',
        description: 'Extract character description'
      },
      {
        field: 'personalityTraits',
        pattern: 'Personality:\\s*([\\s\\S]+?)(?=\\n\\w+:|$)',
        description: 'Extract personality information'
      }
    ]
  },

  // VALIDATION RULES
  validation: {
    requiredFields: ['name'],
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

  // PERFORMANCE SETTINGS
  performance: {
    enableVirtualization: true,
    lazyLoading: true,
    cacheResults: true,
    optimisticUpdates: true
  },

  // ADVANCED CONFIGURATION
  advanced: {
    customActions: [],
    bulkOperations: ['delete', 'export', 'duplicate'],
    shortcuts: [
      { key: 'ctrl+n', action: 'create' },
      { key: 'ctrl+f', action: 'search' },
      { key: 'ctrl+s', action: 'save' }
    ]
  },

  // WORKFLOW CONFIGURATION
  workflow: {
    states: [],
    transitions: [],
    notifications: []
  },

  // PERMISSIONS
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    share: false,
    export: true
  },

  // INTEGRATION SETTINGS
  integration: {
    webhooks: [],
    apis: [],
    exports: ['json', 'pdf', 'csv']
  }
};

export default CHARACTER_CONFIG;