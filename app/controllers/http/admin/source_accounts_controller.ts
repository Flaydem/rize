import type { HttpContext } from '@adonisjs/core/http'
import { sourceAccountValidator } from '#validators/ingestion'
import SourceAccount from '#models/source_account'

export default class AdminSourceAccountsController {
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(sourceAccountValidator)

    await SourceAccount.create({
      ...data,
      isActive: true,
    })

    session.flash('success', 'Compte source cree avec succes')
    return response.redirect('/admin/source-items')
  }
}
