import re

# Read the routes file
with open('server/routes.ts', 'r') as f:
    content = f.read()

# Define the update pattern to fix for all modules
update_fix_template = '''  app.put("/api/{module_path}/:id", async (req, res) => {{
    try {{
      const {{ id }} = req.params;
      console.log("Updating {module_name} with data:", req.body);
      
      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      );
      
      if (Object.keys(cleanedData).length === 0) {{
        return res.status(400).json({{ error: "No valid data provided for update" }});
      }}
      
      const {module_name}Data = insert{ModuleName}Schema.partial().parse(cleanedData);
      const {module_name} = await storage.update{ModuleName}(id, {module_name}Data);
      
      if (!{module_name}) {{
        return res.status(404).json({{ error: "{ModuleName} not found" }});
      }}
      
      res.json({module_name});
    }} catch (error) {{
      if (error instanceof z.ZodError) {{
        return res.status(400).json({{ error: error.errors }});
      }}
      console.error("Error updating {module_name}:", error);
      res.status(500).json({{ error: "Internal server error" }});
    }}
  }});'''

# Modules to fix (module_path, module_name, ModuleName)
modules = [
    ('items', 'item', 'Item'),
    ('organizations', 'organization', 'Organization'),
    ('magic-systems', 'magicSystem', 'MagicSystem'),
    ('timeline-events', 'timelineEvent', 'TimelineEvent'),
    ('creatures', 'creature', 'Creature'),
    ('languages', 'language', 'Language'),
    ('cultures', 'culture', 'Culture'),
    ('prophecies', 'prophecy', 'Prophecy'),
    ('themes', 'theme', 'Theme')
]

# Replace all update operations
for module_path, module_name, module_class in modules:
    # Pattern to match existing update operations
    pattern = rf'app\.put\("/api/{re.escape(module_path)}/.*?\n\s*\}}\);'
    
    # Generate replacement
    replacement = update_fix_template.format(
        module_path=module_path,
        module_name=module_name,
        ModuleName=module_class
    )
    
    # Replace in content
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back to file
with open('server/routes.ts', 'w') as f:
    f.write(content)

print("Fixed all CRUD update operations!")
