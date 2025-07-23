import { 
  FileText, List, Users, MapPin, Flag, Sword, Brain, Sparkles, 
  Lightbulb, Settings, BookOpen, Scroll, History, StickyNote,
  Telescope, Map, Eye, Castle, User, Binary, Link, Edit,
  ChevronRight, Plus, Trash2, Bot, Grip, Cog, ArrowLeft,
  Loader2, BrainCircuit, Palette, UploadCloud, CheckCircle2,
  Image as ImageIcon, Star, BookText, DraftingCompass, FileUp,
  BookUp, AlertTriangle, X, ChevronDown
} from 'lucide-react';

export const iconMap: { [key: string]: any } = {
  'file-text': FileText,
  'list': List,
  'users': Users,
  'map-pin': MapPin,
  'flag': Flag,
  'sword': Sword,
  'brain': Brain,
  'sparkles': Sparkles,
  'lightbulb': Lightbulb,
  'settings': Settings,
  'book-open': BookOpen,
  'scroll': Scroll,
  'history': History,
  'sticky-note': StickyNote,
  'telescope': Telescope,
  'map': Map,
  'eye': Eye,
  'castle': Castle,
  'user': User,
  'binary': Binary,
  'link': Link,
  'edit': Edit,
  'chevron-right': ChevronRight,
  'plus': Plus,
  'trash-2': Trash2,
  'bot': Bot,
  'grip': Grip,
  'cog': Cog,
  'arrow-left': ArrowLeft,
  'loader-2': Loader2,
  'brain-circuit': BrainCircuit,
  'palette': Palette,
  'upload-cloud': UploadCloud,
  'check-circle-2': CheckCircle2,
  'image': ImageIcon,
  'star': Star,
  'book-text': BookText,
  'drafting-compass': DraftingCompass,
  'file-up': FileUp,
  'book-up': BookUp,
  'alert-triangle': AlertTriangle,
  'x': X,
  'chevron-down': ChevronDown
};

export const AI_CONFIGURABLE_TOOLS = [
  'manuscript-editor',
  'outline-tool',
  'character-generator',
  'world-builder',
  'ai-coach'
];

export const characterArchetypes = [
  'The Hero',
  'The Mentor',
  'The Threshold Guardian',
  'The Herald',
  'The Shapeshifter',
  'The Shadow',
  'The Ally',
  'The Trickster',
  'The Innocent',
  'The Explorer',
  'The Sage',
  'The Outlaw',
  'The Magician',
  'The Regular Guy',
  'The Lover',
  'The Jester',
  'The Caregiver',
  'The Creator',
  'The Ruler'
];

export const BUILT_IN_CRAFT_KNOWLEDGE = {
  'story-structure': true,
  'character-development': true,
  'dialogue-techniques': true,
  'world-building': true,
  'pacing': true,
  'theme-development': true,
  'conflict-creation': true,
  'scene-construction': true
};

export const ALL_ON_AI_CRAFT_CONFIG = {
  'story-structure': true,
  'character-development': true,
  'dialogue-techniques': true,
  'world-building': true,
  'pacing': true,
  'theme-development': true,
  'conflict-creation': true,
  'scene-construction': true,
  'grammar-style': true,
  'plot-consistency': true,
  'character-voice': true,
  'emotional-beats': true
};

export const ALL_OFF_AI_CRAFT_CONFIG = {
  'story-structure': false,
  'character-development': false,
  'dialogue-techniques': false,
  'world-building': false,
  'pacing': false,
  'theme-development': false,
  'conflict-creation': false,
  'scene-construction': false,
  'grammar-style': false,
  'plot-consistency': false,
  'character-voice': false,
  'emotional-beats': false
};
