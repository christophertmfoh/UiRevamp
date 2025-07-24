// Organization Configuration
// Universal organization structure suitable for any genre or story type

export const ORGANIZATION_SECTIONS = [
  {
    title: "Identity",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Organization Type", type: "select", 
        options: ["Corporation", "Government Agency", "Non-Profit", "Educational Institution", "Healthcare System", "Religious Organization", "Research Institute", "Professional Association", "Community Group", "International Body", "Think Tank", "Media Organization", "Other"] },
      { name: "description", label: "Description", type: "textarea" },
      { name: "mission", label: "Mission Statement", type: "textarea" }
    ]
  },
  {
    title: "Purpose",
    fields: [
      { name: "goals", label: "Primary Goals", type: "textarea" },
      { name: "objectives", label: "Key Objectives", type: "textarea" },
      { name: "services", label: "Services Provided", type: "textarea" },
      { name: "target_audience", label: "Target Audience", type: "textarea" }
    ]
  },
  {
    title: "Structure",
    fields: [
      { name: "leadership", label: "Leadership Structure", type: "textarea" },
      { name: "structure", label: "Organizational Hierarchy", type: "textarea" },
      { name: "departments", label: "Departments/Divisions", type: "textarea" },
      { name: "membership", label: "Membership Requirements", type: "textarea" }
    ]
  },
  {
    title: "Operations",
    fields: [
      { name: "resources", label: "Resources & Assets", type: "textarea" },
      { name: "locations", label: "Facilities & Locations", type: "textarea" },
      { name: "budget", label: "Funding & Budget", type: "textarea" },
      { name: "activities", label: "Key Activities", type: "textarea" }
    ]
  },
  {
    title: "Relations",
    fields: [
      { name: "relationships", label: "External Relationships", type: "textarea" },
      { name: "partnerships", label: "Partnerships & Alliances", type: "textarea" },
      { name: "history", label: "Organizational History", type: "textarea" },
      { name: "reputation", label: "Public Reputation", type: "textarea" }
    ]
  },
  {
    title: "Meta",
    fields: [
      { name: "status", label: "Current Status", type: "select",
        options: ["Active", "Expanding", "Restructuring", "Declining", "Merging", "Dissolved", "Unknown"] },
      { name: "tags", label: "Tags", type: "array" }
    ]
  }
];

// Universal organization types with generic descriptions
export const ORGANIZATION_TYPES = {
  "Corporation": {
    description: "Business organization focused on profit generation and commercial activities",
    defaultValues: {
      mission: "To deliver value to shareholders while serving customers and stakeholders",
      structure: "Board of Directors, Executive Team, Department Heads, Employees",
      target_audience: "Customers, clients, and market segments"
    }
  },
  "Government Agency": {
    description: "Public sector organization providing government services and oversight",
    defaultValues: {
      mission: "To serve the public interest and implement government policy",
      structure: "Director/Administrator, Department Heads, Civil Servants",
      target_audience: "Citizens and public stakeholders"
    }
  },
  "Non-Profit": {
    description: "Mission-driven organization focused on social good rather than profit",
    defaultValues: {
      mission: "To advance our cause and serve our community",
      structure: "Board of Trustees, Executive Director, Program Staff, Volunteers",
      target_audience: "Beneficiaries and donor community"
    }
  },
  "Educational Institution": {
    description: "Organization dedicated to teaching, learning, and knowledge advancement",
    defaultValues: {
      mission: "To educate students and advance knowledge through teaching and research",
      structure: "Board of Regents, President/Principal, Faculty, Administrative Staff",
      target_audience: "Students, parents, and academic community"
    }
  },
  "Research Institute": {
    description: "Organization focused on scientific research and innovation",
    defaultValues: {
      mission: "To advance knowledge and understanding through research and discovery",
      structure: "Director, Principal Investigators, Research Staff, Support Personnel",
      target_audience: "Scientific community and research sponsors"
    }
  },
  "Professional Association": {
    description: "Organization representing members of a specific profession or industry",
    defaultValues: {
      mission: "To advance the profession and support our members",
      structure: "Board of Directors, Executive Committee, Professional Staff",
      target_audience: "Professional members and industry stakeholders"
    }
  }
};