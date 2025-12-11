import { createBrowserRouter } from 'react-router-dom'

// Layout
import { AppLayout } from '../components/layout/AppLayout'

// Pages
import Landing from '../pages/Landing'
import Start from '../pages/Start'
import Auth from '../pages/Auth'
import AuthCallback from '../pages/AuthCallback'
import ForgotPassword from '../pages/ForgotPassword'
import UpdatePassword from '../pages/UpdatePassword'
import Scanning from '../pages/Scanning'
import FoodPassport from '../pages/FoodPassport'
import OriginTransport from '../pages/details/OriginTransport'
import CertificationsQuality from '../pages/details/CertificationsQuality'
import FarmingPractices from '../pages/details/FarmingPractices'
import FarmerStories from '../pages/details/FarmerStories'
import Recipes from '../pages/details/Recipes'
import RecipeDetail from '../pages/details/RecipeDetail'
import ErrorPage from '../pages/ErrorPage'
import RecentScans from '../pages/RecentScans'
import Favorites from '../pages/Favorites'
import MyAccount from '../pages/MyAccount'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/start', element: <Start /> },
      { path: '/auth', element: <Auth /> },
      { path: '/auth/callback', element: <AuthCallback /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/update-password', element: <UpdatePassword /> },
      { path: '/scan', element: <Scanning /> },
      { path: '/recent-scans', element: <RecentScans /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/account', element: <MyAccount /> },
      { path: '/product/:id', element: <FoodPassport /> },
      { path: '/product/:id/origin', element: <OriginTransport /> },
      { path: '/product/:id/certifications', element: <CertificationsQuality /> },
      { path: '/product/:id/farming', element: <FarmingPractices /> },
      { path: '/product/:id/farmer', element: <FarmerStories /> },
      { path: '/product/:id/recipes', element: <Recipes /> },
      { path: '/product/:id/recipes/:recipeId', element: <RecipeDetail /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
])

