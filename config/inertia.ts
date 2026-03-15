import { defineConfig } from '@adonisjs/inertia'

const inertiaConfig = defineConfig({
  rootView: 'inertia_layout',
  sharedData: {
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    auth: (ctx) => ({
      user: ctx.auth?.user ?? null,
    }),
    flash: (ctx) => ({
      success: ctx.session?.flashMessages.get('success'),
      error: ctx.session?.flashMessages.get('error'),
    }),
  },
  ssr: {
    enabled: false,
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
