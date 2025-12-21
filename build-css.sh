#!/bin/bash

# Zielordner
OUTPUT_DIR="assets/css"
TEMP_FILE="$OUTPUT_DIR/all.css"
MINIFIED_FILE="$OUTPUT_DIR/all.min.css"

# Liste der CSS-Dateien in der gewünschten Reihenfolge
CSS_FILES=(
  "global.css"
  "header.css"
  "aktuell.css"
  "footer.css"
  "tiles.css"
  "chronik.css"
  "impressum.css"
  "events.css"
  "highlights.css"
  "kontakt.css"
  "training.css"
  "turniere.css"
)

# Leere die Zieldatei
> "$TEMP_FILE"

# Zusammenführen der Dateien
echo "🔧 Zusammenführen der CSS-Dateien …"
for file in "${CSS_FILES[@]}"; do
  if [[ -f "$OUTPUT_DIR/$file" ]]; then
    echo "➡️  $file"
    echo "/* $file */" >> "$TEMP_FILE"
    cat "$OUTPUT_DIR/$file" >> "$TEMP_FILE"
    echo "" >> "$TEMP_FILE"
  else
    echo "⚠️  Datei nicht gefunden: $OUTPUT_DIR/$file"
  fi
done

# Minifizieren mit clean-css
echo "⚙️  Minifiziere all.css zu all.min.css …"
npx cleancss -o "$MINIFIED_FILE" "$TEMP_FILE"

echo "✅ Fertig! Minifizierte Datei: $MINIFIED_FILE"
