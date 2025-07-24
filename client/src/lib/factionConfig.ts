// BloomWeaver Faction Configuration
// Based on authentic data from the BloomWeaver's Lament world bible

export const FACTION_SECTIONS = [
  {
    title: "Identity",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Faction Type", type: "select", 
        options: ["Cultist Group", "Stone Lords", "Regional Peoples", "Underground Movement", "Ancient Order", "Other"] },
      { name: "description", label: "Description", type: "textarea" },
      { name: "ideology", label: "Core Ideology", type: "textarea" }
    ]
  },
  {
    title: "Goals & Methods",
    fields: [
      { name: "goals", label: "Primary Goals", type: "textarea" },
      { name: "methods", label: "Methods (General)", type: "textarea" },
      { name: "methods_detailed", label: "Detailed Methods", type: "textarea" },
      { name: "corruption_techniques", label: "Corruption Techniques", type: "textarea" }
    ]
  },
  {
    title: "Organization",
    fields: [
      { name: "leadership", label: "Leadership", type: "textarea" },
      { name: "structure", label: "Organizational Structure", type: "textarea" },
      { name: "recruitment", label: "Recruitment Methods", type: "textarea" },
      { name: "key_figures", label: "Key Figures", type: "textarea" }
    ]
  },
  {
    title: "Power & Resources",
    fields: [
      { name: "resources", label: "Resources & Assets", type: "textarea" },
      { name: "strongholds", label: "Strongholds & Territories", type: "textarea" },
      { name: "threat_level", label: "Threat Level", type: "select",
        options: ["Low", "Moderate", "High", "Extreme", "Apocalyptic"] },
      { name: "current_operations", label: "Current Operations", type: "textarea" }
    ]
  },
  {
    title: "Relations & History",
    fields: [
      { name: "relationships", label: "Relationships", type: "textarea" },
      { name: "history", label: "History", type: "textarea" },
      { name: "origin_story", label: "Origin Story", type: "textarea" },
      { name: "weaknesses", label: "Known Weaknesses", type: "textarea" }
    ]
  },
  {
    title: "Status & Meta",
    fields: [
      { name: "status", label: "Current Status", type: "select",
        options: ["Active", "Dormant", "Growing", "Declining", "Destroyed", "Unknown"] },
      { name: "tags", label: "Tags", type: "array" }
    ]
  }
];

// BloomWeaver-specific faction types with authentic data
export const FACTION_TYPES = {
  "Cultist Group": {
    description: "Fanatical organizations seeking to harness dream power for absolute order",
    defaultValues: {
      ideology: "Belief that the Dream Weaver's 'uncontrolled' dreaming is the source of chaos; aim to harness dream power to impose absolute order",
      threat_level: "Extreme",
      corruption_techniques: "Psychological manipulation of dreams, implanting 'seed nightmares' and 'chaos patterns', ritualistic torture",
      methods_detailed: "Dreamscape engineering, nightmare control/summoning, mind-sculpting, forbidden rituals involving blood sacrifice"
    }
  },
  "Stone Lords": {
    description: "Ancient kings and lords who infused their essence into colossal stone monuments",
    defaultValues: {
      ideology: "Preservation of legacy through stone, wielding earth magic and historical echoes",
      threat_level: "High",
      origin_story: "Kings/lords harnessed magic to infuse life-essence into colossal stone monuments, cementing legacies",
      methods_detailed: "Echo harnessing, petrification/assimilation, geological transformation, chronal echoes"
    }
  },
  "Regional Peoples": {
    description: "Communities adapted to different regions of Umbra Floris",
    defaultValues: {
      ideology: "Survival and adaptation to their regional environment and magical influences",
      threat_level: "Low",
      structure: "Varies by region - from nomadic tribes to fortified settlements",
      methods: "Regional magic adaptation, traditional survival techniques, community cooperation"
    }
  }
};

export const BLOOMWEAVER_REGIONS = [
  "Somnus Verdant (Central Continent)",
  "Lithosclerosis (Western Mountains)", 
  "Psion Mire (Eastern Desert)",
  "Aqueous Sepulchre (Southern Archipelago)",
  "Chthonic Reverie (Underground)",
  "Borealis Crypt (Northern Wastes)"
];