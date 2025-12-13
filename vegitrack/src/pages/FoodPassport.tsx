import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { MapPin, Award, Sprout, User, Utensils } from 'lucide-react'
import { getProductById, getProductByDisplayId, getProductLabels, getAlternativeProducts, getSupplyChain } from '../lib/api'
import { supabase } from '../lib/supabase'
import type { Product, ProductLabel, Farm } from '../types/database'
import { Tag, Spinner } from '../components/ui'
import { PageWrapper, PageHeader, DebugFooter } from '../components/layout'
import { useUserData } from '../contexts/UserDataContext'
import { useTranslation } from '../lib/i18n'

import carrotIcon from '../assets/wallpaper/carrot.svg'
import asparagusIcon from '../assets/wallpaper/asparagus.svg'
import lemonIcon from '../assets/wallpaper/Lemon.svg'
import tomatoIcon from '../assets/wallpaper/tomato.svg'
import caleIcon from '../assets/wallpaper/cale.svg'
import strawberryIcon from '../assets/wallpaper/strawberry.svg'

interface ProductWithFarm extends Product {
  farm?: Farm | null
  blockchain_verified?: boolean | null
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

function normalizePoint(coords: any): { lat: number; lng: number } | null {
  if (!coords) return null
  if (typeof coords === 'string') {
    const match = coords.match(/\(([-0-9.]+),\s*([-0-9.]+)\)/)
    if (match) return { lng: Number(match[1]), lat: Number(match[2]) }
  }
  if (Array.isArray(coords) && coords.length >= 2) {
    return { lng: Number(coords[0]), lat: Number(coords[1]) }
  }
  if (typeof coords === 'object') {
    if ('lat' in coords && 'lng' in coords) return { lat: Number(coords.lat), lng: Number(coords.lng) }
    if ('y' in coords && 'x' in coords) return { lat: Number((coords as any).y), lng: Number((coords as any).x) }
  }
  return null
}

function getCountryFlag(countryName: string) {
  const flags: Record<string, string> = {
    'Netherlands': '🇳🇱',
    'Portugal': '🇵🇹',
    'Spain': '🇪🇸',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Germany': '🇩🇪',
    'Belgium': '🇧🇪',
    'United Kingdom': '🇬🇧',
    'USA': '🇺🇸',
    'United States': '🇺🇸',
    'Brazil': '🇧🇷',
    'China': '🇨🇳',
    'India': '🇮🇳',
  }
  return flags[countryName] || '🏳️'
}

export default function FoodPassport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState<ProductWithFarm | null>(null)
  const [labels, setLabels] = useState<ProductLabel[]>([])
  const [alternatives, setAlternatives] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalDistance, setTotalDistance] = useState<number | null>(null)
  const { addRecentProduct, toggleFavoriteProduct, isProductFavorite } = useUserData()
  const { t, language } = useTranslation()

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      
      setLoading(true)
      setError(null)

      try {
        // Try to fetch by UUID first, then by display_id
        let productData = await getProductById(id)
        
        if (!productData) {
          productData = await getProductByDisplayId(id)
        }

        if (!productData) {
          setError('Product not found')
          setLoading(false)
          return
        }

        // Fetch farm info if farm_id exists
        let farmData = null
        if (productData.farm_id) {
          const { data } = await supabase
            .from('farms')
            .select('*')
            .eq('id', productData.farm_id)
            .single()
          farmData = data
        }

        setProduct({ ...productData, farm: farmData })

        // Fetch labels, alternatives, and supply chain in parallel
        const [labelsData, alternativesData, supplyChainData] = await Promise.all([
          getProductLabels(productData.id),
          getAlternativeProducts(productData.id),
          getSupplyChain(productData.id)
        ])

        setLabels(labelsData)
        setAlternatives(alternativesData)

        // Calculate total distance from supply chain
        if (supplyChainData && supplyChainData.length > 1) {
          let dist = 0
          for (let i = 0; i < supplyChainData.length - 1; i++) {
            const p1 = normalizePoint(supplyChainData[i].coordinates)
            const p2 = normalizePoint(supplyChainData[i+1].coordinates)
            if (p1 && p2) {
              dist += calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng)
            }
          }
          setTotalDistance(Math.round(dist))
        } else if (productData.transport_distance_km) {
          setTotalDistance(productData.transport_distance_km)
        }

      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!product) return
    addRecentProduct({
      id: product.id,
      name: product.name,
      displayId: product.display_id,
      imageUrl: product.image_url,
    })
  }, [addRecentProduct, product])

  // Calculate days since harvest
  const getDaysSinceHarvest = () => {
    if (!product?.harvest_date) return null
    const harvest = new Date(product.harvest_date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - harvest.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const relativeTimeFormatter = useMemo(() => {
    try {
      return new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
    } catch (error) {
      console.warn('RelativeTimeFormat not supported', error)
      return null
    }
  }, [language])

  const detailSections = useMemo(
    () => [
      { path: 'origin', label: t('food.section.origin'), icon: <MapPin /> },
      { path: 'certifications', label: t('food.section.certifications'), icon: <Award /> },
      { path: 'farming', label: t('food.section.farming'), icon: <Sprout /> },
      { path: 'farmer', label: t('food.section.farmer'), icon: <User /> },
      { path: 'recipes', label: t('food.section.recipes'), icon: <Utensils /> },
    ],
    [t],
  )

  const daysSinceHarvest = getDaysSinceHarvest()

  const stats = useMemo(
    () => [
      {
        label: t('food.stat.harvested'),
        icon: (
          <svg width="26" height="32" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.53259 15.9378V20.2619H5.30892L5.308 15.9378H2.53259ZM19.5361 22.9295H20.0255V13.3314C20.2277 13.023 20.3375 12.6601 20.3375 12.2814C20.3375 11.7731 20.1399 11.2943 19.7882 10.9369C19.4373 11.2943 19.2388 11.774 19.2388 12.2814C19.2388 12.6499 19.3441 13.0045 19.5361 13.3082V14.8277C19.4475 13.8508 18.6313 13.0943 17.6489 13.0888C17.6554 14.1314 18.4956 14.9767 19.5361 14.9888V16.8656C19.4475 15.8888 18.6313 15.1332 17.6489 15.1258C17.6554 16.1694 18.4974 17.0147 19.5361 17.0268V18.9027C19.4475 17.9258 18.6313 17.1712 17.6489 17.1638C17.6554 18.2073 18.4974 19.0536 19.5361 19.0647V20.9444C19.4493 19.9657 18.6322 19.2092 17.6489 19.2018C17.6554 20.2444 18.4965 21.0916 19.5361 21.1027V22.9295ZM9.67905 14.0766H10.1684L10.1693 6.18779C10.4177 5.83686 10.5534 5.41558 10.5534 4.9739C10.5534 4.40909 10.33 3.87668 9.93572 3.48315C9.54054 3.87668 9.31803 4.40907 9.31803 4.9739C9.31803 5.40168 9.44637 5.81188 9.68089 6.15632V7.71187C9.5701 6.6452 8.67174 5.83039 7.59054 5.83039C7.58685 6.99057 8.52491 7.93687 9.68089 7.93872V9.92667C9.5701 8.85908 8.67358 8.04519 7.59054 8.04519C7.58685 9.20445 8.52307 10.1507 9.68089 10.1526V12.148C9.57287 11.0767 8.67358 10.26 7.59054 10.26C7.58685 11.4211 8.52491 12.3665 9.68089 12.3683L9.67905 14.0766ZM22.5987 23.9895C20.8564 23.0738 17.3637 23.3414 16.1254 24.2025C16.0414 24.2599 15.9306 24.2599 15.8475 24.2025C14.6093 23.3423 11.1155 23.0747 9.37324 23.9895C8.88021 24.2478 8.58936 24.5738 8.50441 24.9599H23.4684C23.3825 24.5738 23.0917 24.2479 22.5987 23.9895ZM21.9284 19.2035C21.921 20.2498 21.0753 21.0979 20.0329 21.1044C20.0393 20.0581 20.886 19.21 21.9284 19.2035ZM20.5924 17.7266C20.9506 17.3674 21.428 17.1692 21.9284 17.1646C21.921 18.2118 21.0753 19.059 20.0329 19.0655C20.0329 18.5683 20.2369 18.0813 20.5924 17.7266ZM21.9284 15.1266C21.921 16.171 21.078 17.0183 20.0375 17.0284V16.9118C20.0679 16.4525 20.2618 16.0192 20.5924 15.6886C20.9497 15.3284 21.428 15.1303 21.9284 15.1266ZM20.5924 13.6497C20.9506 13.2905 21.428 13.0923 21.9284 13.0895C21.921 14.1312 21.0817 14.9775 20.0412 14.9904V14.8182C20.0836 14.3793 20.2748 13.9673 20.5924 13.6497ZM10.7935 6.44688C11.1932 6.04595 11.7223 5.83112 12.2818 5.83112C12.2855 6.99315 11.3456 7.93945 10.1878 7.93945L10.1887 7.74223C10.2312 7.25611 10.4426 6.79779 10.7935 6.44688ZM10.1869 10.1534H10.1804C10.1841 8.97658 11.1148 8.04602 12.2809 8.04602C12.2855 9.20712 11.3465 10.1534 10.1869 10.1534ZM10.7935 10.8766C11.1932 10.4757 11.7223 10.2608 12.2818 10.2608C12.2855 11.4266 11.3419 12.371 10.1795 12.3692C10.1776 11.8099 10.3955 11.2757 10.7935 10.8766ZM12.1793 19.3265H9.45003C9.26722 19.3265 9.11766 19.4755 9.11766 19.6598C9.11766 19.8431 9.26631 19.9931 9.45003 19.9931H12.1793C12.3621 19.9931 12.5117 19.844 12.5117 19.6598C12.5117 19.4755 12.3621 19.3265 12.1793 19.3265ZM12.1793 18.1691H9.45003C9.26722 18.1691 9.11766 18.3191 9.11766 18.5024C9.11766 18.6857 9.26631 18.8357 9.45003 18.8357H12.1793C12.3621 18.8357 12.5117 18.6866 12.5117 18.5024C12.5117 18.3191 12.3621 18.1691 12.1793 18.1691ZM12.1793 17.0126H9.45003C9.26722 17.0126 9.11766 17.1626 9.11766 17.3459C9.11766 17.5292 9.26631 17.6792 9.45003 17.6792H12.1793C12.3621 17.6792 12.5117 17.5292 12.5117 17.3459C12.5117 17.1626 12.3621 17.0126 12.1793 17.0126ZM9.45003 16.5237H12.1793C12.3621 16.5237 12.5117 16.3737 12.5117 16.1904C12.5117 16.007 12.363 15.8571 12.1793 15.8571H9.45003C9.26722 15.8571 9.11766 16.0071 9.11766 16.1904C9.11766 16.3737 9.26723 16.5237 9.45003 16.5237ZM5.79656 16.2061H6.74663C6.88143 16.2061 6.99131 16.0959 6.99131 15.9617C6.99131 14.7478 7.81397 14.5663 8.30424 14.5663H10.7749C10.9947 14.5663 11.1738 14.7459 11.1738 14.9663C11.1738 15.1867 10.9947 15.3663 10.7749 15.3663H9.45001C8.72246 15.3663 8.35683 16.2506 8.86648 16.7673C8.55072 17.0876 8.5498 17.6024 8.86648 17.9237C8.55072 18.2441 8.55072 18.7598 8.86648 19.0802C8.63011 19.32 8.56178 19.6802 8.70028 19.9913L5.79656 19.9923L5.79656 16.2061Z" fill="#174E05"/>
          </svg>
        ),
        value:
          daysSinceHarvest !== null
            ? relativeTimeFormatter?.format(-daysSinceHarvest, 'day') ?? `${daysSinceHarvest}d ago`
            : '—',
      },
      {
        label: t('food.stat.transport'),
        icon: (
          <svg width="29" height="36" viewBox="0 0 29 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.53424 20.5863H5.74739V20.453C5.74739 19.1197 6.80193 18.053 8.12012 18.053C9.4383 18.053 10.4928 19.1197 10.4928 20.453V20.5863H17.2156V10.7197C17.2156 10.2926 16.8726 9.94678 16.4514 9.94678H4.53429C4.11205 9.94678 3.77017 10.2937 3.77017 10.7197V19.8394C3.74339 20.2394 4.11305 20.5863 4.53424 20.5863Z" fill="#174E05"/>
            <path d="M9.70209 20.4803C9.70209 21.3636 8.99357 22.0802 8.12027 22.0802C7.24595 22.0802 6.53845 21.3636 6.53845 20.4803C6.53845 19.5959 7.24595 18.8802 8.12027 18.8802C8.99357 18.8802 9.70209 19.5959 9.70209 20.4803Z" fill="#174E05"/>
            <path d="M23.1475 20.4803C23.1475 21.3636 22.439 22.0802 21.5657 22.0802C20.6914 22.0802 19.9839 21.3636 19.9839 20.4803C19.9839 19.5959 20.6914 18.8802 21.5657 18.8802C22.439 18.8802 23.1475 19.5959 23.1475 20.4803Z" fill="#174E05"/>
            <path d="M19.193 20.4803C19.193 19.147 20.2475 18.0803 21.5657 18.0803C22.8839 18.0803 23.9385 19.147 23.9385 20.4803V20.6136H24.1753C24.7819 20.6136 25.2566 20.1334 25.2566 19.5199V16.3729C25.2566 16.1063 25.1516 15.8396 24.993 15.626L22.1455 12.0802C21.9344 11.8135 21.645 11.6802 21.302 11.6802H17.7161V20.6135H19.1661C19.1928 20.5604 19.193 20.5063 19.193 20.4803ZM19.193 13.2803H21.3021L23.3587 15.7334H19.1929L19.193 13.2803Z" fill="#174E05"/>
          </svg>
        ),
        value: totalDistance ? `${totalDistance} km` : '—',
      },
      {
        label: t('food.stat.emissions'),
        icon: (
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.112 5.6C16.882 3.4944 15.042 1.8368 12.834 1.8368C12.19 1.8368 11.546 1.9712 10.994 2.24C10.166 0.896 8.694 0 6.992 0C4.416 0 2.3 2.0608 2.3 4.5248C2.3 4.6592 2.3 4.7936 2.3 4.928C0.92 5.824 0 7.3472 0 9.0944C0 11.7824 2.254 13.9776 5.014 13.9776C5.612 13.9776 6.21 13.888 6.762 13.664C7.544 14.56 8.74 15.1424 10.074 15.1424C11.546 15.1424 12.88 14.4256 13.662 13.3056C14.214 13.5296 14.812 13.664 15.41 13.664C17.802 13.664 19.734 11.7824 19.734 9.4528C19.734 7.7504 18.63 6.2272 17.112 5.6ZM5.382 8.736C5.704 9.0496 6.072 9.2288 6.532 9.2288C6.808 9.2288 7.038 9.184 7.268 9.0944C7.452 9.0048 7.682 8.8704 7.912 8.6464L8.418 9.184C7.912 9.7216 7.314 9.9904 6.578 9.9904C5.842 9.9904 5.244 9.7664 4.784 9.3184C4.324 8.8704 4.048 8.288 4.048 7.616C4.048 6.944 4.278 6.3616 4.784 5.8688C5.29 5.4208 5.888 5.1968 6.624 5.1968C7.36 5.1968 8.004 5.4656 8.464 6.0032L7.958 6.5408C7.728 6.3168 7.498 6.1824 7.314 6.0928C7.13 6.0032 6.854 5.9584 6.578 5.9584C6.118 5.9584 5.704 6.0928 5.382 6.4064C5.06 6.72 4.876 7.0784 4.876 7.5712C4.922 8.064 5.06 8.4224 5.382 8.736ZM13.294 9.3184C12.834 9.7664 12.236 9.9904 11.5 9.9904C10.81 9.9904 10.212 9.7664 9.706 9.3184C9.2 8.8704 8.97 8.288 8.97 7.616C8.97 6.944 9.2 6.3616 9.706 5.9136C10.166 5.4656 10.764 5.2416 11.5 5.2416C12.19 5.2416 12.788 5.4656 13.294 5.9136C13.8 6.3616 14.03 6.944 14.03 7.616C14.03 8.288 13.8 8.8256 13.294 9.3184ZM15.824 12.1408H13.846V11.7376L14.72 10.8864C14.904 10.7072 15.042 10.528 15.134 10.4384C15.226 10.3488 15.272 10.2144 15.272 10.1248C15.272 10.0352 15.226 9.9008 15.134 9.856C15.042 9.7664 14.95 9.7216 14.812 9.7216C14.582 9.7216 14.398 9.856 14.214 10.08L13.846 9.856C13.984 9.6768 14.122 9.5424 14.26 9.4528C14.398 9.3632 14.628 9.3184 14.858 9.3184C15.088 9.3184 15.318 9.408 15.502 9.5424C15.686 9.6768 15.778 9.9008 15.778 10.1248C15.778 10.2592 15.732 10.3936 15.686 10.528C15.594 10.6624 15.456 10.8416 15.272 11.0208L14.582 11.6928H15.87V12.1408H15.824Z" fill="#174E05"/>
          </svg>
        ),
        value: product?.emissions_co2e_per_kg ? `${product.emissions_co2e_per_kg} kg CO₂/kg` : '—',
      },
      {
        label: t('food.stat.price'),
        icon: (
          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.8445 0H5.8185C5.4585 0 5.1165 0.1512 4.8645 0.4032L0.3105 5.2416C-0.1035 5.6784 -0.1035 6.3504 0.3105 6.7872L4.8465 11.6256C5.0805 11.8776 5.4405 12.0288 5.8005 12.0288H15.8265C16.5285 12.0288 17.0865 11.508 17.0865 10.8528V1.176C17.1045 0.5208 16.5465 0 15.8445 0ZM4.7565 7.14C4.0905 7.14 3.5505 6.636 3.5505 6.0144C3.5505 5.3928 4.0905 4.8888 4.7565 4.8888C5.4225 4.8888 5.9625 5.3928 5.9625 6.0144C5.9625 6.636 5.4225 7.14 4.7565 7.14ZM11.5605 8.9376V9.6768C11.5605 9.7608 11.4885 9.828 11.4165 9.828H10.6425C10.5525 9.828 10.4805 9.7608 10.4805 9.6768V8.9544C9.6885 8.904 9.0585 8.3328 8.9865 7.6104C8.9865 7.5264 9.0585 7.4592 9.1485 7.4592H9.9225C9.9945 7.4592 10.0485 7.5096 10.0665 7.56C10.1205 7.7784 10.3365 7.9464 10.5885 7.9464H11.2545C11.6505 7.9464 12.0285 7.6776 12.0645 7.308C12.1185 6.8712 11.7585 6.5184 11.2905 6.5184H10.7865C9.8145 6.5184 8.9505 5.8632 8.8605 4.9728C8.7525 4.032 9.4905 3.2088 10.4445 3.0912V2.3688C10.4445 2.2848 10.5165 2.2344 10.6065 2.2344H11.3805C11.4705 2.2344 11.5245 2.3016 11.5245 2.3688V3.0912C12.3165 3.1416 12.9465 3.7128 13.0185 4.4352C13.0185 4.5192 12.9465 4.5864 12.8565 4.5864H12.0825C12.0105 4.5864 11.9565 4.536 11.9385 4.4856C11.8845 4.2672 11.6685 4.0992 11.4165 4.0992H10.7325C10.3365 4.0992 9.9585 4.368 9.9225 4.7376C9.9045 5.1408 10.2645 5.5104 10.7145 5.5104H11.3085C12.3885 5.5104 13.2525 6.384 13.1445 7.4088C13.0725 8.1984 12.3705 8.8032 11.5605 8.9376Z" fill="#174E05"/>
          </svg>
        ),
        value: product?.price_per_kg ? `€${product.price_per_kg}/kg` : '—',
      },
    ],
    [
      daysSinceHarvest,
      totalDistance,
      product?.emissions_co2e_per_kg,
      product?.price_per_kg,
      relativeTimeFormatter,
      t,
    ],
  )

  const palette = {
    background: '#FFFEFC',
    surface: '#F3F5EF',
    card: '#E8ECE3',
    cardBorder: '#C3CBBC',
    accent: '#174E05',
    tagBg: 'rgba(23, 78, 5, 0.20)',
    tagBorder: '#A4B99B',
    statBg: '#C7D4C0',
  }

  const fromProductId = (location.state as { fromProductId?: string } | null)?.fromProductId || null
  const isBookmarked = product ? isProductFavorite(product.id) : false
  const isBlockchainSecured = Boolean(product?.blockchain_verified ?? labels.some((label) => label.blockchain_verified))

  const handleBookmark = () => {
    if (!product) return
    toggleFavoriteProduct({
      id: product.id,
      name: product.name,
      displayId: product.display_id,
      imageUrl: product.image_url,
    })
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center">
            <Spinner className="size-8 mb-4" style={{ color: 'var(--color-primary)' }} />
            <p style={{ fontFamily: 'var(--font-body)' }}>{t('food.loading')}</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <PageHeader backTo="/scan" closeButton />
        <div className="flex flex-col items-center justify-center px-6 pt-20">
          <div className="text-6xl mb-4">🔍</div>
          <h1 
            className="text-xl mb-2"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
          >
            {t('food.notFoundTitle')}
          </h1>
          <p 
            className="text-sm opacity-60 text-center mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {error || t('food.notFoundBody')}
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="px-6 py-3"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-body)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('food.backToScanner')}
          </button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      className="relative"
      style={{
        backgroundColor: palette.background,
        paddingBottom: 'calc(var(--spacing-page) * 2.5)',
      }}
    >
      <PageHeader
        backTo={fromProductId ? `/product/${fromProductId}` : '/scan'}
        closeButton={!fromProductId}
        center={t('food.productId', { id: product.display_id })}
        showBookmark
        isBookmarked={isBookmarked}
        onBookmarkClick={handleBookmark}
      />

      {/* Background Icons */}
      <div 
        className="absolute inset-x-0 flex justify-center pointer-events-none overflow-hidden"
        style={{ 
          top: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <div className="relative w-full h-full flex flex-col" style={{ maxWidth: '402px' }}>
          {Array.from({ length: 6 }).map((_, tileIndex) => (
            <div key={tileIndex} className="relative w-full shrink-0" style={{ height: 'calc(var(--spacing-page) * 12)' }}>
              {[
                { icon: carrotIcon, top: '5%', left: '-2%' },
                { icon: lemonIcon, top: '20%', right: '5%' },
                { icon: asparagusIcon, top: '35%', left: '15%' },
                { icon: tomatoIcon, top: '50%', right: '20%' },
                { icon: caleIcon, top: '65%', left: '5%' },
                { icon: strawberryIcon, top: '80%', right: '10%' },
              ].map((item, i) => (
                <img 
                  key={i}
                  src={item.icon} 
                  alt="" 
                  className="absolute"
                  style={{
                    top: item.top,
                    left: item.left,
                    right: item.right,
                    height: 'calc(var(--spacing-page) * 1.8)',
                    opacity: 0.15,
                    filter: 'grayscale(100%) sepia(100%) hue-rotate(80deg) saturate(200%)'
                  }} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative flex justify-center w-full"
        style={{ marginTop: 'calc(var(--spacing-section) * 1.25)' }}
      >
        <div
          className="relative w-full"
          style={{
            maxWidth: '402px',
            paddingInline: 'calc(var(--spacing-card) * 1.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing-section) * 1.25)',
            zIndex: 1,
          }}
        >
          <div
            className="relative"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'calc(var(--spacing-card) * 1.1)',
              paddingTop: 'calc(var(--spacing-card) * 1.2)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: palette.accent,
                fontWeight: 400,
                letterSpacing: '0.2px',
              }}
            >
            </div>

            <div
              style={{
                width: 'calc(var(--spacing-page) * 8.7)',
                height: 'calc(var(--spacing-page) * 9.5)',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                boxShadow: '0 16px 38px rgba(0,0,0,0.12)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ fontSize: '48px' }}
                >
                  🍅
                </div>
              )}
            </div>

            {/* Separator Border */}
            <div 
              style={{ 
                width: '100%', 
                height: '1px', 
                backgroundColor: 'var(--color-primary)', 
                opacity: 0.2,
                margin: 'var(--spacing-card) 0' 
              }} 
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(var(--spacing-card) * 0.6)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'calc(var(--spacing-card) * 0.2)',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: 'var(--color-text)',
                    lineHeight: 1.3,
                  }}
                >
                  {product.name}
                </span>
                {product.scientific_name && (
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 300,
                      color: 'var(--color-text)',
                      opacity: 0.65,
                      lineHeight: 1.3,
                    }}
                  >
                    {product.scientific_name}
                    {product.variety ? ` '${product.variety}'` : ''}
                  </span>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'calc(var(--spacing-card) * 0.6)',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: '24px',
                    lineHeight: 1,
                    cursor: 'help',
                  }}
                  title={`${product.origin_country}${product.origin_region ? `, ${product.origin_region}` : ''}`}
                >
                  {getCountryFlag(product.origin_country)}
                </span>
                {isBlockchainSecured && (
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing-card) * 0.35)' }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text)',
                        opacity: 0.75,
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Secured by Blockchain
                    </span>
                    <span
                      aria-hidden
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(23, 78, 5, 0.12)',
                        borderRadius: '12px',
                        color: 'var(--color-primary)',
                      }}
                    >
                      🔒
                    </span>
                    <Link
                      to="/blockchain/assurance"
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-body)',
                        textDecoration: 'underline',
                      }}
                    >
                      What this means
                    </Link>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'calc(var(--spacing-card) * 0.8)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-text)',
                  fontWeight: 300,
                  flexWrap: 'wrap',
                }}
              >
                {product.farm && (
                  <span>{product.farm.name}</span>
                )}
                {totalDistance && (
                  <>
                    {product.farm && <span style={{ width: '1px', height: 'calc(var(--spacing-card) * 2)', backgroundColor: palette.accent, opacity: 0.6 }} />}
                    <span>{totalDistance} km</span>
                  </>
                )}
              </div>
            </div>

            {labels.length > 0 && (
              <div
                className="flex flex-wrap justify-center gap-2"
                style={{ paddingTop: 'calc(var(--spacing-card) * 0.5)' }}
              >
                {labels.map((label) => (
                  <Tag
                    key={label.id}
                    color={label.label_color || undefined}
                    style={{
                      backgroundColor: palette.tagBg,
                      border: `1px solid ${palette.tagBorder}`,
                      borderRadius: 'var(--radius-button)',
                      fontWeight: 300,
                      padding: 'calc(var(--spacing-card) * 0.35) calc(var(--spacing-card) * 0.9)',
                      fontSize: '12px',
                    }}
                  >
                    {label.label_name}
                  </Tag>
                ))}
              </div>
            )}

            <div
              className="grid grid-cols-4 gap-2 w-full"
              style={{ marginTop: 'calc(var(--spacing-section) * 0.3)' }}
            >
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: palette.statBg,
                    borderRadius: 'calc(var(--spacing-page) * 1.2)',
                    minHeight: 'calc(var(--spacing-section) * 3.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'calc(var(--spacing-card) * 0.55)',
                    gap: 'calc(var(--spacing-card) * 0.25)',
                  }}
                >
                  {item.icon}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: palette.accent,
                      fontWeight: 400,
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: palette.accent,
                      lineHeight: 1.3,
                      textAlign: 'center',
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                width: 'calc(var(--spacing-page) * 3.2)',
                height: 1,
                backgroundColor: palette.accent,
                marginTop: 'calc(var(--spacing-section) * 0.75)',
                opacity: 0.6,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 1)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 400,
                color: 'var(--color-text)',
              }}
            >
              {t('food.details')}
            </h2>

            <div
              className="grid grid-cols-2 gap-3"
              style={{ marginTop: 'calc(var(--spacing-card) * 0.4)' }}
            >
              {detailSections.map((section) => (
                <Link
                  key={section.path}
                  to={`/product/${product.id}/${section.path}`}
                  style={{
                    backgroundColor: palette.card,
                    border: `1px solid ${palette.cardBorder}`,
                    borderRadius: 'var(--radius-card)',
                    textDecoration: 'none',
                    color: palette.accent,
                    minHeight: 'calc(var(--spacing-section) * 5.6)',
                    padding: 'calc(var(--spacing-card) * 1)',
                    display: 'flex',
                    gap: 'calc(var(--spacing-card) * 0.8)',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>{section.icon}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: palette.accent,
                      lineHeight: 1.2,
                    }}
                  >
                    {section.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 1)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 400,
                color: 'var(--color-text)',
              }}
            >
              {t('food.alternatives')}
            </h2>

            {alternatives.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'calc(var(--spacing-card) * 1)',
                }}
              >
                {alternatives.map((alt) => (
                  <Link
                    key={alt.id}
                    to={`/product/${alt.id}`}
                    state={{ fromProductId: product.id }}
                    style={{
                      width: '100%',
                      backgroundColor: palette.card,
                      border: `1px solid ${palette.cardBorder}`,
                      borderRadius: 'var(--radius-card)',
                      padding: 'calc(var(--spacing-card) * 1)',
                      textDecoration: 'none',
                      color: palette.accent,
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 'calc(var(--spacing-card) * 1)',
                      alignItems: 'center',
                    }}
                  >
                    {alt.image_url ? (
                      <img
                        src={alt.image_url}
                        alt={alt.name}
                        style={{
                          width: 'calc(var(--spacing-section) * 3.5)',
                          height: 'calc(var(--spacing-section) * 3.5)',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-card)',
                        }}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 'calc(var(--spacing-section) * 3.5)',
                          height: 'calc(var(--spacing-section) * 3.5)',
                          backgroundColor: 'var(--color-background)',
                          borderRadius: 'var(--radius-card)',
                          fontSize: '28px',
                        }}
                      >
                        🍅
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.35)' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'var(--color-text)',
                          lineHeight: 1.3,
                        }}
                      >
                        {alt.name}
                      </span>
                      {alt.price_per_kg && (
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: 'var(--color-text)',
                            opacity: 0.8,
                          }}
                        >
                          €{alt.price_per_kg}/kg
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--color-text)',
                  opacity: 0.75,
                }}
              >
                {t('food.noAlternatives')}
              </p>
            )}
          </div>
        </div>
      </div>

      <DebugFooter />
    </PageWrapper>
  )
}
