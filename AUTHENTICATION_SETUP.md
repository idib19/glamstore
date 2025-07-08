# Configuration de l&apos;Authentification

## Informations d&apos;Administration

- **Email**: `admin@queensglam.com`
- **Mot de passe**: `admin123`

## Configuration des Variables d&apos;Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_ADMIN_EMAIL=admin@queensglam.com
NEXT_PUBLIC_ADMIN_PASSWORD=admin123

# Database Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Other Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Code d&apos;Authentification

Le système d&apos;authentification est configuré dans `lib/auth.tsx` :

```typescript
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@queensglam.com';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
```

## Utilisation

1. Accédez à la page de connexion
2. Utilisez les identifiants suivants :
   - Email: `admin@queensglam.com`
   - Mot de passe: `admin123`

## Sécurité

- Les identifiants sont stockés dans les variables d&apos;environnement
- L&apos;authentification utilise localStorage pour la persistance de session
- En production, utilisez des mots de passe forts et des variables d&apos;environnement sécurisées

## Next Steps

1. Create `.env.local` with your credentials
2. Update `lib/auth.tsx`