#!/bin/bash

echo "Fixing form components for all problematic modules..."

# List of modules that need fixes
modules=("organization" "item" "magic" "timeline" "creature" "language" "culture" "prophecy" "theme")

for module in "${modules[@]}"; do
  # Map module names to their directory names
  case $module in
    "magic") dir="magicSystem" ;;
    "timeline") dir="timelineEvent" ;;
    *) dir="$module" ;;
  esac
  
  form_file="client/src/components/$dir/${dir^}Form.tsx"
  
  if [ -f "$form_file" ]; then
    echo "Fixing $form_file..."
    
    # Replace character-specific fields with module-specific fields
    sed -i "s/character/${module}/g" "$form_file"
    sed -i "s/Character/${module^}/g" "$form_file"
    
    # Fix common field mappings based on module type
    case $module in
      "organization")
        sed -i 's/physicalDescription/type/g' "$form_file"
        sed -i 's/backstory/structure/g' "$form_file"
        ;;
      "item")
        sed -i 's/physicalDescription/powers/g' "$form_file"
        sed -i 's/backstory/history/g' "$form_file"
        ;;
    esac
    
    echo "✓ Fixed $form_file"
  else
    echo "⚠ File not found: $form_file"
  fi
done

echo "Form component fixes completed!"
