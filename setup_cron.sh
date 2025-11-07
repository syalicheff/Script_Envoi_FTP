#!/bin/bash
# Script pour configurer la tâche cron automatiquement

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Erreur: Fichier .env introuvable"
    echo "Veuillez créer un fichier .env à partir de env.example"
    exit 1
fi

# Récupérer le répertoire actuel
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_SCRIPT="$SCRIPT_DIR/send_to_suppliers.js"

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Erreur: Node.js n'est pas installé"
    echo "Veuillez installer Node.js en suivant les instructions du README.md"
    exit 1
fi

# Trouver le chemin complet de node
NODE_PATH=$(which node)

# Définir l'heure et les minutes (par défaut 09:00)
HOUR=${CRON_HOUR:-09}
MINUTE=${CRON_MINUTE:-00}

# Valider les valeurs
if ! [[ "$HOUR" =~ ^[0-9]+$ ]] || [ "$HOUR" -lt 0 ] || [ "$HOUR" -gt 23 ]; then
    echo "❌ Erreur: CRON_HOUR doit être un nombre entre 0 et 23"
    exit 1
fi

if ! [[ "$MINUTE" =~ ^[0-9]+$ ]] || [ "$MINUTE" -lt 0 ] || [ "$MINUTE" -gt 59 ]; then
    echo "❌ Erreur: CRON_MINUTE doit être un nombre entre 0 et 59"
    exit 1
fi

# Créer la ligne cron pour les jours ouvrables (lundi à vendredi)
CRON_LINE="$MINUTE $HOUR * * 1-5 cd $SCRIPT_DIR && $NODE_PATH $NODE_SCRIPT >> $SCRIPT_DIR/cron.log 2>&1"

# Vérifier si une entrée existe déjà
if crontab -l 2>/dev/null | grep -q "$NODE_SCRIPT"; then
    echo "⚠️  Une tâche cron existe déjà pour ce script."
    echo "Voulez-vous la remplacer? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Opération annulée"
        exit 0
    fi
    # Supprimer l'ancienne entrée
    crontab -l 2>/dev/null | grep -v "$NODE_SCRIPT" | crontab -
    echo "✅ Ancienne tâche supprimée"
fi

# Ajouter la nouvelle tâche cron
(crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -

echo ""
echo "✅ Tâche cron configurée avec succès!"
echo ""
echo "📋 Détails:"
echo "   Exécution: Du lundi au vendredi à ${HOUR}:${MINUTE}"
echo "   Script: $NODE_SCRIPT"
echo "   Node.js: $NODE_PATH"
echo "   Logs: $SCRIPT_DIR/cron.log"
echo ""
echo "📌 Commandes utiles:"
echo "   Voir vos tâches cron:     crontab -l"
echo "   Modifier vos tâches:      crontab -e"
echo "   Supprimer toutes les tâches: crontab -r"
echo "   Voir les logs:            tail -f $SCRIPT_DIR/cron.log"
echo ""

