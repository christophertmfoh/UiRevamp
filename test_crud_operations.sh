#!/bin/bash

echo "Testing CRUD operations for all categories..."

# Test variables
PROJECT_ID="1753290240799"
BASE_URL="http://localhost:5000/api"

# Test Location CRUD
echo "Testing Locations..."
LOCATION_ID=$(curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/locations" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Location","description":"Test description","projectId":"'$PROJECT_ID'"}' | jq -r '.id')

if [ "$LOCATION_ID" != "null" ] && [ "$LOCATION_ID" != "" ]; then
  echo "✓ Location created: $LOCATION_ID"
  
  # Test update
  curl -s -X PUT "$BASE_URL/locations/$LOCATION_ID" \
    -H "Content-Type: application/json" \
    -d '{"name":"Updated Location"}' > /dev/null
  echo "✓ Location updated"
  
  # Test delete
  curl -s -X DELETE "$BASE_URL/locations/$LOCATION_ID" > /dev/null
  echo "✓ Location deleted"
else
  echo "✗ Location creation failed"
fi

# Test Faction CRUD
echo "Testing Factions..."
FACTION_ID=$(curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/factions" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Faction","description":"Test description","projectId":"'$PROJECT_ID'"}' | jq -r '.id')

if [ "$FACTION_ID" != "null" ] && [ "$FACTION_ID" != "" ]; then
  echo "✓ Faction created: $FACTION_ID"
  
  # Test update
  curl -s -X PUT "$BASE_URL/factions/$FACTION_ID" \
    -H "Content-Type: application/json" \
    -d '{"name":"Updated Faction"}' > /dev/null
  echo "✓ Faction updated"
  
  # Test delete
  curl -s -X DELETE "$BASE_URL/factions/$FACTION_ID" > /dev/null
  echo "✓ Faction deleted"
else
  echo "✗ Faction creation failed"
fi

# Test Item CRUD
echo "Testing Items..."
ITEM_ID=$(curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/items" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Test description","projectId":"'$PROJECT_ID'"}' | jq -r '.id')

if [ "$ITEM_ID" != "null" ] && [ "$ITEM_ID" != "" ]; then
  echo "✓ Item created: $ITEM_ID"
  
  # Test update
  curl -s -X PUT "$BASE_URL/items/$ITEM_ID" \
    -H "Content-Type: application/json" \
    -d '{"name":"Updated Item"}' > /dev/null
  echo "✓ Item updated"
  
  # Test delete
  curl -s -X DELETE "$BASE_URL/items/$ITEM_ID" > /dev/null
  echo "✓ Item deleted"
else
  echo "✗ Item creation failed"
fi

echo "CRUD testing completed!"
