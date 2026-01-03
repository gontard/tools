#!/bin/bash
set -e

# Find all tools with api/ directories and copy to root /api/tool-name/
for tool_dir in */; do
  tool_name="${tool_dir%/}"
  if [ -d "$tool_dir/api" ]; then
    mkdir -p "api/$tool_name"
    cp -r "$tool_dir/api/"* "api/$tool_name/"

    # Install tool's dependencies if package.json exists
    if [ -f "$tool_dir/package.json" ]; then
      (cd "$tool_dir" && npm install --production)
    fi
  fi
done
