export const LOCATION_SECTIONS = [
  {
    id: 'identity',
    label: 'Identity',
    icon: 'MapPin',
    fields: [
      { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter location name...' },
      { key: 'nicknames', label: 'Nicknames', type: 'input', placeholder: 'Common names, shortened names...' },
      { key: 'aliases', label: 'Aliases & Other Names', type: 'textarea', placeholder: 'Historical names, names in other languages, formal titles...' },
      { key: 'locationType', label: 'Location Type', type: 'input', placeholder: 'City, village, forest, mountain, dungeon...' },
      { key: 'classification', label: 'Classification', type: 'input', placeholder: 'Capital, outpost, sacred site, trading post...' },
      { key: 'size', label: 'Size', type: 'input', placeholder: 'Small, medium, large, vast...' },
      { key: 'status', label: 'Status', type: 'input', placeholder: 'Thriving, declining, ruined, abandoned...' },
      { key: 'description', label: 'General Description', type: 'textarea', placeholder: 'Overall description of this location...' },
    ]
  },
  {
    id: 'physical',
    label: 'Physical',
    icon: 'Compass',
    fields: [
      { key: 'physicalDescription', label: 'Physical Description', type: 'textarea', placeholder: 'Detailed physical appearance and layout...' },
      { key: 'geography', label: 'Geography', type: 'textarea', placeholder: 'Geographic features, positioning...' },
      { key: 'terrain', label: 'Terrain', type: 'textarea', placeholder: 'Hills, valleys, rocky, marshy...' },
      { key: 'climate', label: 'Climate', type: 'input', placeholder: 'Tropical, temperate, arctic...' },
      { key: 'weather', label: 'Weather Patterns', type: 'input', placeholder: 'Rainy, dry, storms, fog...' },
      { key: 'naturalFeatures', label: 'Natural Features', type: 'textarea', placeholder: 'Rivers, mountains, forests, caves...' },
      { key: 'landmarks', label: 'Landmarks', type: 'textarea', placeholder: 'Notable features, monuments, distinctive sites...' }
    ]
  },
  {
    id: 'atmosphere',
    label: 'Atmosphere',
    icon: 'TreePine',
    fields: [
      { key: 'atmosphere', label: 'Overall Atmosphere', type: 'textarea', placeholder: 'The feeling and mood of this place...' },
      { key: 'mood', label: 'Mood & Tone', type: 'input', placeholder: 'Peaceful, ominous, bustling, melancholy...' },
      { key: 'ambiance', label: 'Ambiance', type: 'input', placeholder: 'Warm, cold, cozy, foreboding...' },
      { key: 'sounds', label: 'Sounds', type: 'textarea', placeholder: 'What sounds are heard here...' },
      { key: 'smells', label: 'Smells & Scents', type: 'textarea', placeholder: 'What scents fill the air...' },
      { key: 'lighting', label: 'Lighting', type: 'input', placeholder: 'Bright, dim, candlelit, natural...' },
      { key: 'colors', label: 'Colors & Hues', type: 'input', placeholder: 'Dominant colors and visual palette...' }
    ]
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: 'Building',
    fields: [
      { key: 'architecture', label: 'Architectural Style', type: 'textarea', placeholder: 'Building styles, design philosophy...' },
      { key: 'buildings', label: 'Buildings & Structures', type: 'textarea', placeholder: 'Key buildings, construction types...' },
      { key: 'materials', label: 'Construction Materials', type: 'textarea', placeholder: 'Stone, wood, metal, magical materials...' },
      { key: 'layout', label: 'Layout & Organization', type: 'textarea', placeholder: 'How the location is organized...' },
      { key: 'districts', label: 'Districts & Areas', type: 'textarea', placeholder: 'Different sections, quarters, zones...' },
      { key: 'infrastructure', label: 'Infrastructure', type: 'textarea', placeholder: 'Roads, utilities, systems...' }
    ]
  },
  {
    id: 'society',
    label: 'Society',
    icon: 'Crown',
    fields: [
      { key: 'population', label: 'Population', type: 'input', placeholder: 'Number of inhabitants, demographics...' },
      { key: 'inhabitants', label: 'Inhabitants', type: 'input', placeholder: 'Who lives here, species, groups...' },
      { key: 'culture', label: 'Culture', type: 'textarea', placeholder: 'Cultural practices, way of life...' },
      { key: 'governance', label: 'Governance', type: 'textarea', placeholder: 'How the location is governed...' },
      { key: 'leadership', label: 'Leadership', type: 'input', placeholder: 'Who leads or rules this place...' },
      { key: 'languages', label: 'Languages', type: 'array', placeholder: 'Languages spoken here...' },
      { key: 'customs', label: 'Customs & Traditions', type: 'textarea', placeholder: 'Local customs, traditions, social practices...' }
    ]
  },
  {
    id: 'history',
    label: 'History',
    icon: 'Scroll',
    fields: [
      { key: 'history', label: 'History', type: 'textarea', placeholder: 'The history of this location...' },
      { key: 'origin', label: 'Origin & Founding', type: 'textarea', placeholder: 'How this place came to be...' },
      { key: 'pastEvents', label: 'Past Events', type: 'textarea', placeholder: 'Important historical events...' },
      { key: 'legends', label: 'Legends & Myths', type: 'textarea', placeholder: 'Stories and legends about this place...' },
      { key: 'significance', label: 'Significance', type: 'textarea', placeholder: 'Why this location is important...' },
      { key: 'historicalFigures', label: 'Historical Figures', type: 'textarea', placeholder: 'Important people connected to this place...' }
    ]
  },
  {
    id: 'story',
    label: 'Story',
    icon: 'Camera',
    fields: [
      { key: 'narrativeRole', label: 'Narrative Role', type: 'input', placeholder: 'Role in the story...' },
      { key: 'storyImportance', label: 'Story Importance', type: 'input', placeholder: 'How important to the plot...' },
      { key: 'scenes', label: 'Scenes & Events', type: 'textarea', placeholder: 'What happens here in the story...' },
      { key: 'mysteries', label: 'Mysteries & Secrets', type: 'textarea', placeholder: 'Hidden aspects, secrets, mysteries...' },
      { key: 'encounters', label: 'Encounters & Interactions', type: 'textarea', placeholder: 'What characters might encounter here...' }
    ]
  },
  {
    id: 'meta',
    label: 'Meta',
    icon: 'Settings',
    fields: [
      { key: 'tags', label: 'Tags', type: 'array', placeholder: 'Tags for organization...' },
      { key: 'notes', label: 'Development Notes', type: 'textarea', placeholder: 'Your notes about this location...' },
      { key: 'inspiration', label: 'Inspiration', type: 'textarea', placeholder: 'What inspired this location...' },
      { key: 'references', label: 'References', type: 'textarea', placeholder: 'Reference materials, sources...' }
    ]
  }
];