import { test } from '@japa/runner'

test.group('Ideas', () => {
  test('ideas page requires auth', async ({ client }) => {
    const response = await client.get('/ideas')
    response.assertStatus(302)
  })

  test('validator page requires auth', async ({ client }) => {
    const response = await client.get('/validator')
    response.assertStatus(302)
  })
})
