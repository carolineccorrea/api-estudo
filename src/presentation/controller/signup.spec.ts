import { SignUpController } from './signup'

describe('Signup Controller', () => {
  test('deve retornar 400 se o body nao estiver completo', () => {
    const sut = new SignUpController()

    const httpResquest = {
      body: {
        email: 'exemplo@email.com',
        password: 'exemplo12345',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
