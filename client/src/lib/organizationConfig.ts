// Organization Configuration
// Universal organization structure suitable for any genre or story type

export const ORGANIZATION_SECTIONS = [
  {
    title: "Identity",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Organization Type", type: "select", 
        options: ["Corporation", "Government Agency", "Non-Profit", "Educational Institution", "Healthcare System", "Religious Organization", "Research Institute", "Professional Association", "Community Group", "International Body", "Think Tank", "Media Organization", "Trade Union", "Financial Institution", "Military Organization", "Other"] },
      { name: "description", label: "Description", type: "textarea" },
      { name: "mission", label: "Mission Statement", type: "textarea" },
      { name: "vision", label: "Vision Statement", type: "textarea" }
    ]
  },
  {
    title: "Purpose",
    fields: [
      { name: "goals", label: "Primary Goals", type: "textarea" },
      { name: "objectives", label: "Key Objectives", type: "textarea" },
      { name: "services", label: "Services Provided", type: "textarea" },
      { name: "target_audience", label: "Target Audience", type: "textarea" },
      { name: "activities", label: "Core Activities", type: "textarea" },
      { name: "strategic_plan", label: "Strategic Plan", type: "textarea" }
    ]
  },
  {
    title: "Structure",
    fields: [
      { name: "leadership", label: "Leadership Structure", type: "textarea" },
      { name: "structure", label: "Organizational Hierarchy", type: "textarea" },
      { name: "departments", label: "Departments/Divisions", type: "textarea" },
      { name: "membership", label: "Membership Requirements", type: "textarea" },
      { name: "hierarchy", label: "Chain of Command", type: "textarea" },
      { name: "roles_responsibilities", label: "Key Roles & Responsibilities", type: "textarea" }
    ]
  },
  {
    title: "Operations",
    fields: [
      { name: "resources", label: "Resources & Assets", type: "textarea" },
      { name: "locations", label: "Facilities & Locations", type: "textarea" },
      { name: "budget", label: "Funding & Budget", type: "textarea" },
      { name: "funding_sources", label: "Funding Sources", type: "textarea" },
      { name: "equipment", label: "Equipment & Technology", type: "textarea" },
      { name: "governance_model", label: "Governance Model", type: "textarea" }
    ]
  },
  {
    title: "Relations",
    fields: [
      { name: "relationships", label: "External Relationships", type: "textarea" },
      { name: "partnerships", label: "Partnerships & Alliances", type: "textarea" },
      { name: "stakeholders", label: "Key Stakeholders", type: "textarea" },
      { name: "competitors", label: "Competitors & Rivals", type: "textarea" },
      { name: "reputation", label: "Public Reputation", type: "textarea" },
      { name: "public_perception", label: "Public Perception", type: "textarea" }
    ]
  },
  {
    title: "History",
    fields: [
      { name: "history", label: "Organizational History", type: "textarea" },
      { name: "founding", label: "Founding Story", type: "textarea" },
      { name: "key_events", label: "Key Historical Events", type: "textarea" },
      { name: "evolution", label: "Evolution & Changes", type: "textarea" },
      { name: "achievements", label: "Major Achievements", type: "textarea" },
      { name: "legacy", label: "Legacy & Impact", type: "textarea" }
    ]
  },
  {
    title: "Culture",
    fields: [
      { name: "organizational_culture", label: "Organizational Culture", type: "textarea" },
      { name: "values", label: "Core Values", type: "array" },
      { name: "principles", label: "Guiding Principles", type: "textarea" },
      { name: "ethics", label: "Ethical Standards", type: "textarea" },
      { name: "code_of_conduct", label: "Code of Conduct", type: "textarea" },
      { name: "workplace_environment", label: "Workplace Environment", type: "textarea" }
    ]
  },
  {
    title: "Meta",
    fields: [
      { name: "status", label: "Current Status", type: "select",
        options: ["Active", "Expanding", "Restructuring", "Declining", "Merging", "Dissolved", "Unknown"] },
      { name: "challenges", label: "Current Challenges", type: "textarea" },
      { name: "future_goals", label: "Future Goals", type: "textarea" },
      { name: "tags", label: "Tags", type: "array" },
      { name: "notes", label: "Additional Notes", type: "textarea" }
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
      target_audience: "Customers, clients, and market segments",
      governance_model: "Corporate governance with shareholder oversight",
      funding_sources: "Revenue from operations, investments, and capital markets"
    }
  },
  "Government Agency": {
    description: "Public sector organization providing government services and oversight",
    defaultValues: {
      mission: "To serve the public interest and implement government policy",
      structure: "Director/Administrator, Department Heads, Civil Servants",
      target_audience: "Citizens and public stakeholders",
      governance_model: "Public administration with legislative oversight",
      funding_sources: "Government budget allocations and taxpayer funds"
    }
  },
  "Non-Profit": {
    description: "Mission-driven organization focused on social good rather than profit",
    defaultValues: {
      mission: "To advance our cause and serve our community",
      structure: "Board of Trustees, Executive Director, Program Staff, Volunteers",
      target_audience: "Beneficiaries and donor community",
      governance_model: "Board governance with community accountability",
      funding_sources: "Donations, grants, fundraising events, and endowments"
    }
  },
  "Educational Institution": {
    description: "Organization dedicated to teaching, learning, and knowledge advancement",
    defaultValues: {
      mission: "To educate students and advance knowledge through teaching and research",
      structure: "Board of Regents, President/Principal, Faculty, Administrative Staff",
      target_audience: "Students, parents, and academic community",
      governance_model: "Academic governance with shared decision-making",
      funding_sources: "Tuition, government funding, research grants, and endowments"
    }
  },
  "Research Institute": {
    description: "Organization focused on scientific research and innovation",
    defaultValues: {
      mission: "To advance knowledge and understanding through research and discovery",
      structure: "Director, Principal Investigators, Research Staff, Support Personnel",
      target_audience: "Scientific community and research sponsors",
      governance_model: "Research-driven governance with peer review processes",
      funding_sources: "Research grants, government contracts, and private sponsorship"
    }
  },
  "Professional Association": {
    description: "Organization representing members of a specific profession or industry",
    defaultValues: {
      mission: "To advance the profession and support our members",
      structure: "Board of Directors, Executive Committee, Professional Staff",
      target_audience: "Professional members and industry stakeholders",
      governance_model: "Member-driven governance with elected leadership",
      funding_sources: "Membership dues, certification fees, and conference revenue"
    }
  },
  "Healthcare System": {
    description: "Organization providing medical care and health services",
    defaultValues: {
      mission: "To provide quality healthcare and improve community health outcomes",
      structure: "Medical Director, Department Heads, Healthcare Professionals, Support Staff",
      target_audience: "Patients, families, and healthcare community",
      governance_model: "Medical governance with quality oversight",
      funding_sources: "Patient fees, insurance reimbursements, and government funding"
    }
  },
  "Military Organization": {
    description: "Disciplined organization focused on defense and security operations",
    defaultValues: {
      mission: "To defend and protect national or organizational interests",
      structure: "Command hierarchy, Officers, Non-commissioned Officers, Personnel",
      target_audience: "Nation, allies, and protected populations",
      governance_model: "Military command structure with chain of command",
      funding_sources: "Government defense budget and military appropriations"
    }
  }
};