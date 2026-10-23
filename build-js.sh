#!/bin/bash

# Zielordner
OUTPUT_DIR="assets/js"
TEMP_FILE="$OUTPUT_DIR/all.js"
MINIFIED_FILE="$OUTPUT_DIR/all.min.js"

# Reihenfolge der JS-Dateien – wie in deinem HTML
JS_FILES=(
  "scrollTop.js"
  "chronik-content.js"
  "events.js"
  "highlights.js"
  "trainingImageRotator.js"
  "turniereImageRotator.js"
  "chronik.js"
  "impressum.js"
  "kontaktScroll.js"
  "email-obfuscation.js"
  "kontakt-form.js"
)

# Leere die Zieldatei
> "$TEMP_FILE"

# Zusammenführen der Dateien
echo "🔧 Zusammenführen der JS-Dateien …"
for file in "${JS_FILES[@]}"; do
  if [[ -f "$OUTPUT_DIR/$file" ]]; then
    echo "➡️  $file"
    echo "// $file" >> "$TEMP_FILE"
    cat "$OUTPUT_DIR/$file" >> "$TEMP_FILE"
    echo -e "\n" >> "$TEMP_FILE"
  else
    echo "⚠️  Datei nicht gefunden: $OUTPUT_DIR/$file"
  fi
done

# Minifizieren mit terser
echo "⚙️  Minifiziere all.js zu all.min.js …"
npx terser "$TEMP_FILE" -o "$MINIFIED_FILE" --compress --mangle

echo "✅ Fertig! Minifizierte Datei: $MINIFIED_FILE"
