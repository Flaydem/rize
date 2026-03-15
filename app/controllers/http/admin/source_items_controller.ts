import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { manualIngestionValidator } from '#validators/ingestion'
import SourceItem from '#models/source_item'
import SourceAccount from '#models/source_account'
import { IdeaIngestionService } from '#services/ingestion/idea_ingestion_service'
import { BusinessIdeaExtractionService } from '#services/ideas/business_idea_extraction_service'
import { StructuredPlanGenerationService } from '#services/ideas/structured_plan_generation_service'
import { getAdapterRegistry } from '#services/ingestion/adapter_registry'
import { Platform, SyncStatus, ValidationStatus } from '#types/enums'

export default class AdminSourceItemsController {
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const sourceItems = await SourceItem.query()
      .preload('sourceAccount')
      .preload('businessIdea')
      .orderBy('createdAt', 'desc')
      .paginate(page, 20)

    return inertia.render('admin/source-items/index', {
      sourceItems: sourceItems.serialize(),
    })
  }

  async create({ inertia }: HttpContext) {
    const accounts = await SourceAccount.query().where('isActive', true)
    return inertia.render('admin/source-items/create', {
      accounts: accounts.map((a) => a.serialize()),
    })
  }

  async storeManual({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(manualIngestionValidator)
    const ingestionService = new IdeaIngestionService()

    const sourceItem = await ingestionService.ingest({
      platform: (data.platform as Platform) || Platform.Manual,
      rawText: data.rawText,
      title: data.title,
      sourceUrl: data.sourceUrl,
      metadata: data.metadata || {},
    })

    // Extraction automatique de l'idee business
    try {
      const extractionService = new BusinessIdeaExtractionService()
      const idea = await extractionService.extractFromSourceItem(sourceItem, auth.user!.id)
      if (idea) {
        await idea.merge({ validationStatus: ValidationStatus.Reviewed }).save()
        // Generer le plan structure automatiquement
        try {
          const planService = new StructuredPlanGenerationService()
          await planService.generate(idea.id, auth.user!.id)
        } catch (planError) {
          logger.error({ error: planError, ideaId: idea.id }, 'Echec de la generation du plan structure')
        }
        session.flash('success', 'Source ajoutee, idee extraite et plan genere avec succes')
      } else {
        session.flash('success', 'Source ajoutee (extraction echouee)')
      }
    } catch (error) {
      logger.error({ error, sourceItemId: sourceItem.id }, 'Echec de l\'extraction automatique')
      session.flash('success', 'Source ajoutee (extraction echouee)')
    }

    return response.redirect('/admin/source-items')
  }

  async importCsv({ request, response, session, auth }: HttpContext) {
    const csvFile = request.file('csv', {
      extnames: ['csv'],
      size: '10mb',
    })

    if (!csvFile || csvFile.hasErrors) {
      session.flash('errors', { csv: csvFile?.errors || 'Aucun fichier CSV envoye' })
      return response.redirect().back()
    }

    const fs = await import('node:fs/promises')
    const rawBuffer = await fs.readFile(csvFile.tmpPath!)
    // Essayer UTF-8 d'abord, fallback sur Latin-1 si des caracteres de remplacement apparaissent
    const utf8Content = rawBuffer.toString('utf-8')
    const content = utf8Content.includes('\ufffd') ? rawBuffer.toString('latin1') : utf8Content

    const registry = getAdapterRegistry()
    const csvAdapter = registry.getCsvAdapter()
    const rows = csvAdapter.parseCsv(content)
    const inputs = rows.map((row) => csvAdapter.csvRowToIngestionInput(row))

    const ingestionService = new IdeaIngestionService()
    const result = await ingestionService.ingestBatch(inputs)

    // Extraction automatique des idees business pour chaque source importee
    const extractionService = new BusinessIdeaExtractionService()
    const pendingItems = await SourceItem.query().where('syncStatus', SyncStatus.Pending)
    let extracted = 0

    for (const item of pendingItems) {
      try {
        const idea = await extractionService.extractFromSourceItem(item, auth.user!.id)
        if (idea) {
          await idea.merge({ validationStatus: ValidationStatus.Reviewed }).save()
          // Generer le plan structure automatiquement
          try {
            const planService = new StructuredPlanGenerationService()
            await planService.generate(idea.id, auth.user!.id)
          } catch (planError) {
            logger.error({ error: planError, ideaId: idea.id }, 'Echec de la generation du plan structure')
          }
          extracted++
        }
      } catch (error) {
        logger.error({ error, sourceItemId: item.id }, 'Echec de l\'extraction automatique')
      }
    }

    session.flash('success', `Import termine : ${result.created} sources importees, ${extracted} idees extraites, ${result.skipped} ignores, ${result.errors} erreurs`)
    return response.redirect('/admin/source-items')
  }

  async destroy({ params, response, session }: HttpContext) {
    const sourceItem = await SourceItem.findOrFail(params.id)

    // Supprimer l'idee business liee si elle existe
    const idea = await sourceItem.related('businessIdea').query().first()
    if (idea) {
      await idea.delete()
    }

    await sourceItem.delete()

    session.flash('success', 'Source supprimee avec succes')
    return response.redirect().back()
  }
}
