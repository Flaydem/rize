import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/http/auth_controller')
const DashboardController = () => import('#controllers/http/dashboard_controller')
const IdeasController = () => import('#controllers/http/ideas_controller')
const ValidatorController = () => import('#controllers/http/validator_controller')
const SettingsController = () => import('#controllers/http/settings_controller')
const SavedIdeasController = () => import('#controllers/http/saved_ideas_controller')
const AdminSourceItemsController = () => import('#controllers/http/admin/source_items_controller')
const AdminSourceAccountsController = () => import('#controllers/http/admin/source_accounts_controller')
const AdminIdeasReviewController = () => import('#controllers/http/admin/ideas_review_controller')

// Public routes
router.on('/').redirect('/login')
router.get('/login', [AuthController, 'showLogin']).as('auth.login')
router.get('/register', [AuthController, 'showRegister']).as('auth.register')
router.post('/login', [AuthController, 'login']).as('auth.login.store')
router.post('/register', [AuthController, 'register']).as('auth.register.store')
router.post('/logout', [AuthController, 'logout']).as('auth.logout')

// Protected routes
router.group(() => {
  router.get('/dashboard', [DashboardController, 'index']).as('dashboard')
  router.get('/me', [AuthController, 'me']).as('auth.me')

  // Ideas
  router.get('/ideas', [IdeasController, 'index']).as('ideas.index')
  router.get('/ideas/:slug', [IdeasController, 'show']).as('ideas.show')
  router.post('/ideas/:id/generate-structured-plan', [IdeasController, 'generateStructuredPlan']).as('ideas.generatePlan')
  router.get('/ideas/:id/structured-plan', [IdeasController, 'showStructuredPlan']).as('ideas.plan')
  router.post('/ideas/:id/generate-launch-pack', [IdeasController, 'generateLaunchPack']).as('ideas.generateLaunchPack')
  router.get('/ideas/:id/launch-pack', [IdeasController, 'showLaunchPack']).as('ideas.launchPack')
  router.post('/ideas/:id/save', [SavedIdeasController, 'toggle']).as('ideas.save')

  // Validator
  router.get('/validator', [ValidatorController, 'index']).as('validator.index')
  router.post('/validator/run', [ValidatorController, 'run']).as('validator.run')
  router.get('/validator/:id', [ValidatorController, 'show']).as('validator.show')

  // Settings
  router.get('/settings', [SettingsController, 'index']).as('settings')

  // Admin routes
  router.group(() => {
    router.get('/source-items', [AdminSourceItemsController, 'index']).as('admin.sourceItems.index')
    router.get('/source-items/create', [AdminSourceItemsController, 'create']).as('admin.sourceItems.create')
    router.post('/source-items/manual', [AdminSourceItemsController, 'storeManual']).as('admin.sourceItems.storeManual')
    router.post('/source-items/import-csv', [AdminSourceItemsController, 'importCsv']).as('admin.sourceItems.importCsv')
    router.post('/source-accounts', [AdminSourceAccountsController, 'store']).as('admin.sourceAccounts.store')
    router.get('/ideas/review', [AdminIdeasReviewController, 'index']).as('admin.ideas.review')
    router.patch('/ideas/:id', [AdminIdeasReviewController, 'update']).as('admin.ideas.update')
    router.post('/ideas/:id/reprocess', [AdminIdeasReviewController, 'reprocess']).as('admin.ideas.reprocess')
    router.delete('/ideas/:id', [AdminIdeasReviewController, 'destroy']).as('admin.ideas.destroy')
    router.delete('/source-items/:id', [AdminSourceItemsController, 'destroy']).as('admin.sourceItems.destroy')
  }).prefix('/admin').use(middleware.admin())
}).use(middleware.auth())
