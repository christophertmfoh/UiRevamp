#!/bin/bash

# Define modules and their proper casing
declare -A MODULES=(
  ["location"]="Location"
  ["faction"]="Faction" 
  ["item"]="Item"
  ["organization"]="Organization"
  ["magic-system"]="MagicSystem"
  ["timeline-event"]="TimelineEvent"
  ["creature"]="Creature"
  ["language"]="Language"
  ["culture"]="Culture"
  ["prophecy"]="Prophecy"
  ["theme"]="Theme"
)

# Define all character components to copy
COMPONENTS=("Card" "DetailAccordion" "DetailView" "Form" "FormExpanded" "GenerationModal" "Manager" "PortraitModal" "UnifiedView")

echo "Starting systematic copying of complete character system..."

for module_kebab in "${!MODULES[@]}"; do
  module_pascal="${MODULES[$module_kebab]}"
  module_lower=$(echo "$module_pascal" | tr '[:upper:]' '[:lower:]')
  
  echo "Processing module: $module_pascal (kebab: $module_kebab, lower: $module_lower)"
  
  # Create directory if it doesn't exist
  mkdir -p "client/src/components/$module_kebab"
  
  # Copy each component with proper naming
  for component in "${COMPONENTS[@]}"; do
    src_file="client/src/components/character/Character${component}.tsx"
    dest_file="client/src/components/$module_kebab/${module_pascal}${component}.tsx"
    
    if [ -f "$src_file" ]; then
      echo "  Copying $src_file -> $dest_file"
      
      # Copy file and replace all instances
      sed "s/Character/${module_pascal}/g" "$src_file" | \
      sed "s/character/${module_lower}/g" | \
      sed "s/characters/${module_lower}s/g" > "$dest_file"
      
    else
      echo "  WARNING: Source file $src_file not found"
    fi
  done
  
  # Create index.ts file for clean imports
  cat > "client/src/components/$module_kebab/index.ts" << INDEXEOF
export { ${module_pascal}Manager } from './${module_pascal}Manager';
export { ${module_pascal}Card } from './${module_pascal}Card';
export { ${module_pascal}Form } from './${module_pascal}Form';
export { ${module_pascal}FormExpanded } from './${module_pascal}FormExpanded';
export { ${module_pascal}DetailView } from './${module_pascal}DetailView';
export { ${module_pascal}DetailAccordion } from './${module_pascal}DetailAccordion';
export { ${module_pascal}UnifiedView } from './${module_pascal}UnifiedView';
export { ${module_pascal}GenerationModal } from './${module_pascal}GenerationModal';
export { ${module_pascal}PortraitModal } from './${module_pascal}PortraitModal';
INDEXEOF

done

echo "Systematic copying completed!"
