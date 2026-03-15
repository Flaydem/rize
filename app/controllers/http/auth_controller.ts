import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect('/dashboard')
    } catch {
      session.flash('errors', { login: 'Email ou mot de passe invalide' })
      return response.redirect().back()
    }
  }

  async register({ request, auth, response, session }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const existing = await User.findBy('email', data.email)
    if (existing) {
      session.flash('errors', { email: 'Cet email est deja utilise' })
      return response.redirect().back()
    }

    const user = await User.create({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: 'member',
    })

    await auth.use('web').login(user)
    return response.redirect('/dashboard')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }

  async me({ auth, response }: HttpContext) {
    return response.json({ user: auth.user })
  }
}
