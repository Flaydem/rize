import type { HttpContext } from '@adonisjs/core/http'
import { runValidationValidator } from '#validators/validator'
import { BusinessValidationService } from '#services/validator/business_validation_service'
import BusinessValidation from '#models/business_validation'

export default class ValidatorController {
  async index({ inertia }: HttpContext) {
    return inertia.render('validator/index')
  }

  async run({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(runValidationValidator)
    const service = new BusinessValidationService()

    const validation = await service.validate(
      {
        title: data.title,
        description: data.description,
        targetAudience: data.targetAudience,
        context: data.context,
      },
      auth.user!.id
    )

    return response.redirect(`/validator/${validation.id}`)
  }

  async show({ params, inertia, auth }: HttpContext) {
    const validation = await BusinessValidation.query()
      .where('id', params.id)
      .where('userId', auth.user!.id)
      .firstOrFail()

    return inertia.render('validator/show', {
      validation: validation.serialize(),
    })
  }
}
