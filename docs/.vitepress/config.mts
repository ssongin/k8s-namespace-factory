import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kubernetes Namespace Factory',
  description: 'Guides for requesting, maintaining, and operating Kubernetes namespaces.',
  lang: 'en-US',
  srcDir: 'docs',
  base: process.env.DOCS_BASE || '/',
  vite: {
    define: {
      __DOCS_VERSION_MANIFEST_URL__: JSON.stringify(
        process.env.DOCS_PAGES_URL
          ? new URL(
            'versions.json',
            `${process.env.DOCS_PAGES_URL.replace(/\/+$/, '')}/`
          ).toString()
          : ''
      )
    }
  },
  srcExclude: ['README.md', '_sidebar.md'],
  themeConfig: {
    siteTitle: 'Namespace Factory',
    nav: [
      { text: 'Users', link: '/customer/ordering-namespace' },
      { text: 'Repository maintainers', link: '/maintainer/ci-cd-secrets-setup' },
      { text: 'Kubernetes provisioners/providers', link: '/provisioner/operating-services' }
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Description', link: '/' },
          { text: 'Documentation versions', link: '/versioning' }
        ]
      },
      {
        text: 'Users',
        items: [
          { text: 'Requesting a namespace', link: '/customer/ordering-namespace' }
        ]
      },
      {
        text: 'Repository maintainers',
        items: [
          { text: 'CI, schema, and documentation', link: '/maintainer/ci-cd-secrets-setup' }
        ]
      },
      {
        text: 'Kubernetes provisioners/providers',
        items: [
          { text: 'Operating services', link: '/provisioner/operating-services' }
        ]
      }
    ]
  }
})
