import { Link } from 'react-router-dom'
import { PageWrapper, PageHeaderWithBack } from '../components/layout'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel'
import { useUserData } from '../contexts/UserDataContext'

function FavoriteCard({
  title,
  subtitle,
  imageUrl,
  link,
}: {
  title: string
  subtitle?: string
  imageUrl?: string | null
  link: string
}) {
  return (
    <Link
      to={link}
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-card)',
        padding: 'calc(var(--spacing-section) * 0.9)',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 'calc(var(--spacing-card) * 1)',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
      }}
    >
      <div
        style={{
          width: 'calc(var(--spacing-section) * 4)',
          height: 'calc(var(--spacing-section) * 4)',
          borderRadius: 'var(--radius-card)',
          backgroundColor: 'var(--color-surface)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '24px' }}>🍅</span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.3)' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--color-text)',
              opacity: 0.75,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  )
}

export default function Favorites() {
  const { favoriteProducts, favoriteRecipes } = useUserData()

  return (
    <PageWrapper
      className="flex flex-col"
      style={{ backgroundColor: 'var(--color-surface-light-green-back)' }}
    >
      <div
        className="w-full"
        style={{ paddingTop: 'calc(var(--spacing-section) * 1.25)', paddingLeft: '10%', paddingRight: '10%' }}
      >
        <PageHeaderWithBack
          title="Favorites"
          backTo="/start"
          rightActions={<MenuToggleButton size="sm" />}
          marginBottom={`calc(var(--spacing-section) * 1.5)`}
        />

        <section style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 1)' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color-text)',
              }}
            >
              Products
            </h2>
            {favoriteProducts.length > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--color-text)',
                  opacity: 0.7,
                }}
              >
                {favoriteProducts.length} saved
              </span>
            )}
          </header>

          {favoriteProducts.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: 'var(--radius-card)',
                padding: 'calc(var(--spacing-section) * 1)',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
              }}
            >
              No bookmarked products yet.
            </div>
          ) : (
            <Carousel opts={{ align: 'start' }}>
              <CarouselContent>
                {favoriteProducts.map((item) => (
                  <CarouselItem key={item.id} className="basis-[85%] sm:basis-[70%]">
                    <FavoriteCard
                      title={item.name}
                      subtitle={item.displayId ? `ID ${item.displayId}` : undefined}
                      imageUrl={item.imageUrl}
                      link={`/product/${item.id}`}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          )}
        </section>

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing-card) * 1)',
            marginTop: 'calc(var(--spacing-section) * 1.75)',
          }}
        >
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color-text)',
              }}
            >
              Recipes
            </h2>
            {favoriteRecipes.length > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--color-text)',
                  opacity: 0.7,
                }}
              >
                {favoriteRecipes.length} saved
              </span>
            )}
          </header>

          {favoriteRecipes.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: 'var(--radius-card)',
                padding: 'calc(var(--spacing-section) * 1)',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
              }}
            >
              No bookmarked recipes yet.
            </div>
          ) : (
            <Carousel opts={{ align: 'start' }}>
              <CarouselContent>
                {favoriteRecipes.map((item) => (
                  <CarouselItem key={item.id} className="basis-[85%] sm:basis-[70%]">
                    <FavoriteCard
                      title={item.title}
                      subtitle={`Product ${item.productId}`}
                      imageUrl={item.imageUrl}
                      link={`/product/${item.productId}/recipes/${item.id}`}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          )}
        </section>
      </div>
    </PageWrapper>
  )
}
