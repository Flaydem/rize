import type { HttpContext } from '@adonisjs/core/http'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    return inertia.render('settings', {
      user: auth.user!.serialize(),
    })
  }
}
