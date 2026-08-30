#!/bin/bash
# Jeu d'essai — Trouve ton Artisan — exécution réelle contre l'API locale
# Les identifiants sont lus dans .env : aucune valeur sensible dans ce fichier.
set -a; . ./.env; set +a
API="http://localhost:${PORT:-3000}/api/artisans"
KEY="$API_KEY"
OUT=/tmp/jeu_essai.txt
: > $OUT

run() { # $1 = numéro, $2 = libellé, reste = args curl
  local n="$1"; local label="$2"; shift 2
  echo "===== CAS $n : $label" >> $OUT
  local body
  body=$(curl -s -o /tmp/b.json -w "%{http_code}" "$@")
  echo "HTTP $body" >> $OUT
  head -c 600 /tmp/b.json >> $OUT
  echo "" >> $OUT
}

run 1 "GET /artisans sans clé API" "$API"
run 2 "GET /artisans avec clé API invalide" -H "x-api-key: mauvaise-cle" "$API"
run 3 "GET /artisans avec clé API valide" -H "x-api-key: $KEY" "$API"
echo "-> nombre d'artisans : $(jq length /tmp/b.json)" >> $OUT

run 4 "GET /artisans/categories" -H "x-api-key: $KEY" "$API/categories"
echo "-> nombre de catégories : $(jq length /tmp/b.json) / noms : $(jq -c '[.[].nom]' /tmp/b.json)" >> $OUT

run 5 "GET /artisans/top/artisans" -H "x-api-key: $KEY" "$API/top/artisans"
echo "-> nombre d'artisans du mois : $(jq length /tmp/b.json) / noms : $(jq -c '[.[].nom]' /tmp/b.json)" >> $OUT

run 6 "GET /artisans/categorie/2 (jointure filtrée)" -H "x-api-key: $KEY" "$API/categorie/2"
echo "-> résultats : $(jq length /tmp/b.json) / $(jq -c '[.[] | {nom, specialite: .Specialite.nom}]' /tmp/b.json)" >> $OUT

run 7 "GET /artisans/recherche/bou" -H "x-api-key: $KEY" "$API/recherche/bou"
echo "-> résultats : $(jq length /tmp/b.json) / $(jq -c '[.[].nom]' /tmp/b.json)" >> $OUT

run 8 "GET /artisans/9999 (identifiant inexistant)" -H "x-api-key: $KEY" "$API/9999"

run 9 "GET /artisans/recherche/' OR '1'='1 (injection SQL)" -H "x-api-key: $KEY" --get --data-urlencode "x=1" "$API/recherche/%27%20OR%20%271%27%3D%271"
echo "-> résultats : $(jq length /tmp/b.json)" >> $OUT

run 10 "POST /artisans/1/contact — corps vide" -X POST -H "x-api-key: $KEY" -H "Content-Type: application/json" -d '{}' "$API/1/contact"

run 11 "POST /artisans/1/contact — email invalide" -X POST -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"nom":"Florent","email":"florent-at-example","objet":"Devis","message":"Bonjour"}' "$API/1/contact"

run 12 "POST /artisans/1/contact — message de 5001 caractères" -X POST -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d "{\"nom\":\"Florent\",\"email\":\"florent@example.com\",\"objet\":\"Devis\",\"message\":\"$(head -c 5001 /dev/zero | tr '\0' 'a')\"}" "$API/1/contact"

run 13 "POST /artisans/1/contact — demande valide" -X POST -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"nom":"Florent Vidal","email":"florent@example.com","objet":"Demande de devis","message":"Bonjour,\nPouvez-vous me faire un devis ?\nMerci."}' "$API/1/contact"

run 14 "POST /artisans/1/contact — nom contenant <script> (XSS)" -X POST -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"nom":"<script>alert(1)</script>","email":"pirate@example.com","objet":"Test","message":"<img src=x onerror=alert(2)>"}' "$API/1/contact"

run 15 "POST /artisans/9999/contact — artisan inexistant" -X POST -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"nom":"Florent","email":"florent@example.com","objet":"Test","message":"Bonjour"}' "$API/9999/contact"

echo "===== CAS 16 : 6e envoi en moins d'une heure (limitation de débit)" >> $OUT
for i in 1 2 3; do
  curl -s -o /tmp/b.json -w "envoi supplémentaire -> HTTP %{http_code}\n" -X POST -H "x-api-key: $KEY" \
    -H "Content-Type: application/json" \
    -d '{"nom":"Florent","email":"florent@example.com","objet":"Spam","message":"Test"}' "$API/1/contact" >> $OUT
done
head -c 400 /tmp/b.json >> $OUT
echo "" >> $OUT

echo "===== VÉRIFICATION BASE APRÈS INJECTION SQL" >> $OUT
mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT COUNT(*) AS artisans_restants FROM artisan;" 2>/dev/null >> $OUT

cat $OUT
