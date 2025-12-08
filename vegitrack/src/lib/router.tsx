import { createBrowserRouter } from 'react-router-dom'

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
import ErrorPage from '../pages/ErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/start',
    element: <Start />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth',
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth/update-password',
    element: <UpdatePassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/scan',
    element: <Scanning />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id',
    element: <FoodPassport />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id/origin',
    element: <OriginTransport />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id/certifications',
    element: <CertificationsQuality />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id/farming',
    element: <FarmingPractices />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id/farmer',
    element: <FarmerStories />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id/recipes',
    element: <Recipes />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])

