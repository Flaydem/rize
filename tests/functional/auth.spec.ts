import { test } from '@japa/runner'

test.group('Auth', () => {
  test('login page renders', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
  })

  test('register page renders', async ({ client }) => {
    const response = await client.get('/register')
    response.assertStatus(200)
  })

  test('login with invalid credentials fails', async ({ client }) => {
    const response = await client.post('/login').form({
      email: 'nonexistent@test.com',
      password: 'wrongpassword',
    })
    response.assertStatus(302) // Redirect back
  })

  test('protected routes redirect to login', async ({ client }) => {
    const response = await client.get('/dashboard')
    response.assertStatus(302)
  })

  test('admin routes require admin role', async ({ client }) => {
    const response = await client.get('/admin/source-items')
    response.assertStatus(302)
  })
})
