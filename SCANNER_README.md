# Guide d'utilisation du Scanner de QR Codes

## Introduction

Ce module permet aux administrateurs de scanner les QR codes des invitations et de suivre les entrées lors de l'événement. Les données de scan sont sauvegardées dans Firebase Firestore pour un suivi en temps réel.

## Accès à la page de scan

1. Connectez-vous à l'interface d'administration
2. Sur la page de gestion des invités, cliquez sur le bouton "Scanner les QR codes" en haut à droite
3. Vous serez redirigé vers la page du scanner

## Utilisation du scanner

### Prérequis
- Navigateur moderne compatible avec l'accès à la caméra (Chrome, Firefox, Safari, Edge)
- Autorisation d'accès à la caméra accordée à l'application
- Connexion internet pour la synchronisation avec Firebase

### Processus de scan

1. Positionnez le QR code d'invitation face à la caméra
2. Le scan est automatique, il n'est pas nécessaire de prendre une photo
3. Les informations de l'invité apparaîtront à l'écran après la détection
4. Pour scanner un autre QR code, cliquez sur "Scanner un autre QR code"

### Informations affichées après le scan

- Nom de l'invité
- Groupe auquel il appartient
- Nombre de personnes associées à cette invitation
- Nombre total de scans (premier scan ou déjà scanné X fois)
- Historique des scans précédents avec date et heure

## Structure des données dans Firebase

### Collection "scans"

Chaque scan génère un document dans la collection "scans" avec les informations suivantes:

```json
{
  "guestId": "famille-dupont_jean",  // ID unique de l'invité
  "timestamp": Timestamp,            // Date et heure du scan
  "scannedBy": "admin",              // Identifiant de l'administrateur qui a scanné
  "deviceInfo": "User Agent..."      // Informations sur l'appareil utilisé pour le scan
}
```

### Mise à jour du document invité

À chaque scan, le document de l'invité dans la collection "guests" est également mis à jour:

```json
{
  "scanned": true,           // Marqué comme scanné
  "scanCount": 1,            // Nombre de scans incrémenté
  "lastScan": Timestamp      // Horodatage du dernier scan
}
```

## Dépannage

### La caméra ne s'active pas
- Vérifiez que vous avez autorisé l'accès à la caméra dans les paramètres du navigateur
- Essayez de rafraîchir la page
- Sur mobile, assurez-vous que l'application a les permissions nécessaires

### QR code non reconnu
- Assurez-vous que le QR code est bien éclairé et sans reflets
- Tenez l'appareil à une distance appropriée (ni trop près, ni trop loin)
- Vérifiez que le QR code n'est pas endommagé

### Erreur "Invité non trouvé"
- Le QR code est valide mais l'ID ne correspond à aucun invité dans la base de données
- Vérifiez que l'invité n'a pas été supprimé de la base de données

## Support technique

Pour toute question ou problème technique, contactez l'administrateur système. 