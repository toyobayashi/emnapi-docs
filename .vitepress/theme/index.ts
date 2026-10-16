import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp ({ router, siteData }) {
    if (typeof window === 'undefined') return

    router.onAfterRouteChange = () => {
      if (!router.route.data.isNotFound) return

      const target = getLegacyV1Target(window.location.pathname, siteData.value.base)
      if (target) {
        window.location.replace(`${target}${window.location.search}${window.location.hash}`)
      }
    }
  }
}

export default theme

function getLegacyV1Target (pathname: string, base: string): string | undefined {
  const sitePath = pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname.slice(1)

  const isZh = sitePath.startsWith('zh/')
  let legacyPath = isZh ? sitePath.slice('zh/'.length) : sitePath

  const hasVersionPrefix = ['v1', 'v2'].some((version) =>
    legacyPath === version || legacyPath.startsWith(`${version}/`)
  )
  if (hasVersionPrefix) return

  const isLegacyRoute = ['guide', 'reference'].some((section) =>
    legacyPath === section || legacyPath.startsWith(`${section}/`)
  )
  if (!isLegacyRoute) return

  if (legacyPath === 'guide' || legacyPath === 'reference') {
    legacyPath += '/'
  } else if (legacyPath.endsWith('/index.html')) {
    legacyPath = legacyPath.slice(0, -'index.html'.length)
  } else if (!legacyPath.endsWith('/') && !legacyPath.endsWith('.html')) {
    legacyPath += '.html'
  }

  return `${base}${isZh ? 'zh/' : ''}v1/${legacyPath}`
}
