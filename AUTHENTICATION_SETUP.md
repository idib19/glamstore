# Authentication Setup Guide

## Current Implementation

The dashboard is now protected with authentication using hardcoded credentials:

- **Email**: `admin@glamstore.com`
- **Password**: `admin123`

## How to Move Credentials to Environment Variables

### 1. Create Environment File

Create a `.env.local` file in your project root:

```env
# Authentication Credentials
ADMIN_EMAIL=admin@glamstore.com
ADMIN_PASSWORD=admin123

# Database Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Other Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Update Authentication Context

To use environment variables instead of hardcoded credentials, update `lib/auth.tsx`:

```typescript
// Replace the hardcoded credentials with environment variables
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@glamstore.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
```

**Note**: For client-side authentication, you'll need to prefix the email variable with `NEXT_PUBLIC_` since it's used in the browser. The password should remain server-side only for security.

### 3. Enhanced Security (Recommended)

For better security, consider implementing:

1. **Server-side authentication** with API routes
2. **JWT tokens** for session management
3. **Password hashing** (bcrypt)
4. **Rate limiting** for login attempts
5. **Two-factor authentication**

### 4. Current Features

- ✅ Login form with email/password
- ✅ Session persistence (localStorage)
- ✅ Loading states
- ✅ Error handling
- ✅ Logout functionality
- ✅ Protected dashboard access

### 5. Usage

1. Navigate to `/dashboard`
2. Enter the credentials:
   - Email: `admin@glamstore.com`
   - Password: `admin123`
3. Click "Se connecter"
4. Access the protected dashboard
5. Use the "Déconnexion" button to logout

### 6. Security Notes

- The current implementation stores authentication state in localStorage
- Credentials are hardcoded (should be moved to environment variables)
- No password hashing (should be implemented for production)
- No rate limiting (should be added for production)

## Next Steps

1. Create `.env.local` with your credentials
2. Update `lib/auth.tsx` to use environment variables
3. Implement server-side authentication for production
4. Add password hashing and rate limiting
5. Consider adding two-factor authentication 