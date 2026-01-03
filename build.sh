#!/bin/bash
set -e

# Build Output API structure
# https://vercel.com/docs/build-output-api/v3

OUTPUT_DIR=".vercel/output"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/static"
mkdir -p "$OUTPUT_DIR/functions"

# Copy static files (everything except special dirs)
for item in */; do
  name="${item%/}"
  # Skip special directories
  if [[ "$name" == "node_modules" || "$name" == ".vercel" ]]; then
    continue
  fi
  cp -r "$item" "$OUTPUT_DIR/static/$name"
done

# Copy root files
cp -f index.html "$OUTPUT_DIR/static/" 2>/dev/null || true

# Process tools with api/ folders - create serverless functions
for tool_dir in */; do
  tool_name="${tool_dir%/}"
  if [ -d "$tool_dir/api" ]; then
    # Install tool's dependencies if package.json exists
    if [ -f "$tool_dir/package.json" ]; then
      (cd "$tool_dir" && npm install --production)
    fi

    # Create function for each .js file in api/
    for api_file in "$tool_dir/api/"*.js; do
      if [ -f "$api_file" ]; then
        func_name=$(basename "$api_file" .js)
        func_dir="$OUTPUT_DIR/functions/api/$tool_name/$func_name.func"
        mkdir -p "$func_dir"

        # Copy the function file
        cp "$api_file" "$func_dir/index.js"

        # Copy node_modules if they exist
        if [ -d "$tool_dir/node_modules" ]; then
          cp -r "$tool_dir/node_modules" "$func_dir/"
        fi

        # Create .vc-config.json
        cat > "$func_dir/.vc-config.json" << 'VCCONFIG'
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "launcherType": "Nodejs"
}
VCCONFIG
      fi
    done

    # Remove api/ folder from static output (keep frontend only)
    rm -rf "$OUTPUT_DIR/static/$tool_name/api"
  fi
done

# Remove node_modules from static output
find "$OUTPUT_DIR/static" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Create config.json with routes
cat > "$OUTPUT_DIR/config.json" << 'CONFIG'
{
  "version": 3,
  "routes": [
    { "src": "/hello-world", "dest": "/hello-world/index.html" },
    { "src": "/hello-api", "dest": "/hello-api/index.html" },
    {
      "src": "/api/(.*)",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      "continue": true
    }
  ]
}
CONFIG

echo "Build complete. Output in $OUTPUT_DIR"
echo "Functions:"
find "$OUTPUT_DIR/functions" -name "*.func" -type d 2>/dev/null || echo "  (none)"
echo "Static files:"
ls "$OUTPUT_DIR/static/"
