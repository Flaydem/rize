import { BaseSeeder } from '@adonisjs/lucid/seeders'
import BusinessIdeaCategory from '#models/business_idea_category'

export default class extends BaseSeeder {
  async run() {
    await BusinessIdeaCategory.updateOrCreateMany('key', [
      { key: 'ecommerce', label: 'E-Commerce', description: 'Online retail, dropshipping, DTC brands' },
      { key: 'saas', label: 'SaaS', description: 'Software as a Service products' },
      { key: 'agency', label: 'Agency', description: 'Service agencies (marketing, dev, design)' },
      { key: 'info-product', label: 'Info Product', description: 'Courses, ebooks, templates, digital products' },
      { key: 'local-service', label: 'Local Service', description: 'Location-based service businesses' },
      { key: 'marketplace', label: 'Marketplace', description: 'Two-sided marketplace platforms' },
      { key: 'newsletter-media', label: 'Newsletter / Media', description: 'Content-driven media businesses' },
      { key: 'content-brand', label: 'Content Brand', description: 'Personal brands, content creator businesses' },
      { key: 'ai-automation', label: 'AI / Automation', description: 'AI-powered tools and automation services' },
      { key: 'freelance-productized-service', label: 'Productized Service', description: 'Standardized freelance or consulting services' },
      { key: 'community', label: 'Community', description: 'Paid communities, memberships' },
      { key: 'education', label: 'Education', description: 'EdTech, tutoring, training platforms' },
      { key: 'recruiting', label: 'Recruiting', description: 'Talent acquisition, job boards, HR tech' },
      { key: 'lead-generation', label: 'Lead Generation', description: 'Lead gen tools, directories, aggregators' },
      { key: 'no-code-tool', label: 'No-Code Tool', description: 'No-code/low-code solutions and platforms' },
      { key: 'b2b-service', label: 'B2B Service', description: 'Business-to-business service companies' },
      { key: 'b2c-product', label: 'B2C Product', description: 'Consumer-facing physical or digital products' },
    ])
  }
}
