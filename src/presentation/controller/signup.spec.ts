import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

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
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('deve retornar 400 se o body nao estiver completo', () => {
    const sut = new SignUpController()

    const httpResquest = {
      body: {
        name: 'exemplo@email.com',
        password: 'exemplo12345',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('deve retornar 400 se o password nao for fornecido', () => {
    const sut = new SignUpController()

    const httpResquest = {
      body: {
        name: 'Fulano',
        email: 'fulano@email.com',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('deve retornar 400 se o passwordConfirm nao for fornecido', () => {
    const sut = new SignUpController()

    const httpResquest = {
      body: {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
})
