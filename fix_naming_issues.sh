#!/bin/bash

echo "Starting comprehensive naming cleanup..."

# Define all modules and their proper names
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

# Fix character-specific references in all copied files
for module_kebab in "${!MODULES[@]}"; do
  module_pascal="${MODULES[$module_kebab]}"
  module_lower=$(echo "$module_pascal" | tr '[:upper:]' '[:lower:]')
  
  echo "Cleaning up $module_pascal module..."
  
  # Fix all TypeScript files in the module
  find "client/src/components/$module_kebab" -name "*.tsx" -exec sed -i "
    s/character\.id/item.id/g;
    s/character\.name/item.name/g;
    s/character\.role/item.type/g;
    s/character\.race/item.category/g;
    s/character\.class/item.rarity/g;
    s/character\.age/item.condition/g;
    s/character\.title/item.subtitle/g;
    s/character\.oneLine/item.summary/g;
    s/character\.imageUrl/item.imageUrl/g;
    s/character\.portraits/item.images/g;
    s/characters\.find(c => c\.id/items.find(i => i.id/g;
    s/characters\.map(c => /items.map(i => /g;
    s/const location = locations\.find(c =>/const location = locations.find(l =>/g;
    s/const faction = factions\.find(c =>/const faction = factions.find(f =>/g;
    s/\.find(c => c\.id/.find(item => item.id/g;
  " {} \;
done

echo "Fixed character-specific references in all modules"

# Fix Location-specific issues
sed -i 's/location\.type/location.category/g' client/src/components/location/*.tsx
sed -i 's/location\.scale/location.size/g' client/src/components/location/*.tsx

echo "Fixed location-specific naming issues"

# Fix import paths that reference wrong types
find client/src/components -name "*.tsx" -exec sed -i "
  s/type { Character }/type { Location }/g;
  s/import.*Character.*from.*lib\/types/import type { Location } from '..\/..\/lib\/types'/g;
" client/src/components/location/*.tsx \;

echo "Fixed import statements"

echo "Naming cleanup completed!"
