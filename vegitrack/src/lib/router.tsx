import { createBrowserRouter } from 'react-router-dom'

// Pages
import Landing from '../pages/Landing'
import Start from '../pages/Start'
import Auth from '../pages/Auth'
import ForgotPassword from '../pages/ForgotPassword'
import UpdatePassword from '../pages/UpdatePassword'
import Scanning from '../pages/Scanning'
import FoodPassport from '../pages/FoodPassport'
import OriginTransport from '../pages/details/OriginTransport'
import CertificationsQuality from '../pages/details/CertificationsQuality'
import FarmingPractices from '../pages/details/FarmingPractices'
import FarmerStories from '../pages/details/FarmerStories'
import Recipes from '../pages/details/Recipes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/start',
    element: <Start />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/update-password',
    element: <UpdatePassword />,
  },
  {
    path: '/scan',
    element: <Scanning />,
  },
  {
    path: '/product/:id',
    element: <FoodPassport />,
  },
  {
    path: '/product/:id/origin',
    element: <OriginTransport />,
  },
  {
    path: '/product/:id/certifications',
    element: <CertificationsQuality />,
  },
  {
    path: '/product/:id/farming',
    element: <FarmingPractices />,
  },
  {
    path: '/product/:id/farmer',
    element: <FarmerStories />,
  },
  {
    path: '/product/:id/recipes',
    element: <Recipes />,
  },
])

