# VegiTrack

A React + TypeScript + Vite application for tracking vegetable origins and certifications.

## Local Development

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the `vegitrack` directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

3. Configure Supabase for local development:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add these to **Redirect URLs**:
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/auth/update-password`
     - `http://localhost:5173/auth/forgot-password`

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Testing Password Reset Locally

1. Make sure your dev server is running (`npm run dev`)
2. Navigate to `http://localhost:5173/auth/forgot-password`
3. Enter your email and click "Send Reset Link"
4. Check your email for the reset link
5. Click the link - it will redirect to `http://localhost:5173/auth/update-password`
6. Enter your new password

**Note:** The `redirectTo` URL automatically uses `window.location.origin`, so it will use `http://localhost:5173` when running locally and your production URL when deployed.

## Production Deployment (Vercel)

### 1. Environment Variables

Set these environment variables in your Vercel project settings:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable/anonymous key

**To set in Vercel:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add both variables for **Production**, **Preview**, and **Development** environments

### 2. Supabase Configuration for Production

In your **Supabase Dashboard** → **Authentication** → **URL Configuration**:

**Site URL:**
- Set to your production URL: `https://vegitrack.vercel.app` (or your custom domain)

**Redirect URLs** (add all of these):
- `https://vegitrack.vercel.app/auth/callback`
- `https://vegitrack.vercel.app/auth/update-password`
- `https://vegitrack.vercel.app/auth/forgot-password`
- `http://localhost:5173/auth/callback` (keep for local testing)
- `http://localhost:5173/auth/update-password` (keep for local testing)
- `http://localhost:5173/auth/forgot-password` (keep for local testing)

### 3. Email Template

In **Supabase Dashboard** → **Authentication** → **Email Templates** → **Reset Password**, use:

```html
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user account:</p>

<p>
  <a href="{{ .ConfirmationURL }}">Reset Password</a>
</p>

<p>If you didn't request this, you can safely ignore this email.</p>
```

The `{{ .ConfirmationURL }}` automatically handles the redirect to your production URL.

### 4. Verify Deployment

After deploying:
1. Visit `https://vegitrack.vercel.app/auth/forgot-password`
2. Request a password reset
3. Check your email and click the reset link
4. It should redirect to your production app

**Code Note:** No code changes needed! The app automatically uses `window.location.origin`, which will be your production URL when deployed.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
