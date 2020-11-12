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
    expect(httpResponse.body).toEqual(new Error('Parametros faltando: nome'))
  })

  test('deve retornar 400 se o campo de email nao for preenchido', () => {
    const sut = new SignUpController()

    const httpResquest = {
      body: {
        name: 'fulano',
        password: 'exemplo12345',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Parametros faltando: nome'))
  })
})
