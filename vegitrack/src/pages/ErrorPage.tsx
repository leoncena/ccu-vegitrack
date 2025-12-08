import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { PageWrapper, PageHeaderWithBack } from '../components/layout'

export default function ErrorPage() {
  const error = useRouteError()

  let errorMessage = 'An unexpected error occurred'
  let errorStatus = 404

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data || 'Page not found'
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <PageWrapper className="flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <div
        className="w-full pb-12"
        style={{ paddingTop: '20px', paddingLeft: '10%', paddingRight: '10%' }}
      >
        <div className="w-full">
          <PageHeaderWithBack title="Error" />

          <div className="space-y-2 text-center">
            <h1
              className="text-[32px] leading-tight"
              style={{
                fontFamily: 'var(--font-brand)',
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              {errorStatus}
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-light)',
              }}
            >
              {errorMessage}
            </p>
          </div>

          <div
            className="flex justify-center"
            style={{
              marginTop: 'calc(var(--spacing-section) * 2.375)',
            }}
          >
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-primary)',
                textDecoration: 'underline',
              }}
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

