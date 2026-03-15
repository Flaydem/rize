import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import './app.css'

const pages = import.meta.glob('../pages/**/*.tsx')

createInertiaApp({
  resolve: (name) => {
    const page = pages[`../pages/${name}.tsx`]
    if (!page) {
      throw new Error(`Page non trouvee : ${name}`)
    }
    return page()
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
