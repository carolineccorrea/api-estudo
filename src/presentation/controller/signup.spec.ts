import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'
import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'id_valido',
        name: 'nome_valido',
        email: 'email_valido@email.com',
        password: 'senha_valida'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Signup Controller', () => {
  test('deve retornar 400 se o nome nao for fornecido', async () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        email: 'exemplo@email.com',
        password: 'exemplo12345',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('deve retornar 400 se o email nao for fornecido', async () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'exemplo@email.com',
        password: 'exemplo12345',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('deve retornar 400 se o password nao for fornecido', async () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'Fulano',
        email: 'fulano@email.com',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('deve retornar 400 se o passwordConfirm nao for fornecido', async () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'exemplo12345'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
})

test('deve retornar 400 se o email for invalido', async () => {
  const { sut, emailValidatorStub } = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

  const httpResquest = {
    body: {
      name: 'exemplo@email.com',
      email: 'fulano@email.com',
      password: 'exemplo12345',
      passwordConfirm: 'exemplo12345'
    }
  }
  const httpResponse = await sut.handle(httpResquest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamError('email'))
})

test('garante que o AddAccount vai ter os campos corretos', async () => {
  const { sut, addAccountStub } = makeSut()
  const addSpy = jest.spyOn(addAccountStub, 'add')

  const httpResquest = {
    body: {
      name: 'exemplo@email.com',
      email: 'fulano@email.com',
      password: 'exemplo12345',
      passwordConfirm: 'exemplo12345'
    }
  }
  await sut.handle(httpResquest)
  expect(addSpy).toHaveBeenCalledWith({
    name: 'exemplo@email.com',
    email: 'fulano@email.com',
    password: 'exemplo12345'
  })
})

test('deve retornar 500 se o emailValidator retornar uma exceção', async () => {
  const { sut, emailValidatorStub } = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
    throw new Error()
  })

  const httpResquest = {
    body: {
      name: 'exemplo@email.com',
      email: 'fulano@email.com',
      password: 'exemplo12345',
      passwordConfirm: 'exemplo12345'
    }
  }
  const httpResponse = await sut.handle(httpResquest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

test('deve retornar 500 se o AddAccount retornar uma exceção', async () => {
  const { sut, addAccountStub } = makeSut()
  jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
    throw new Error()
  })

  const httpResquest = {
    body: {
      name: 'exemplo@email.com',
      email: 'fulano@email.com',
      password: 'exemplo12345',
      passwordConfirm: 'exemplo12345'
    }
  }
  const httpResponse = await sut.handle(httpResquest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

test('deve retornar 200 se os dados forem validos', async () => {
  const { sut } = makeSut()

  const httpResquest = {
    body: {
      name: 'nome_valido',
      email: 'email_valido@email.com',
      password: 'senha_valida',
      passwordConfirm: 'senha_valida'
    }
  }
  const httpResponse = await sut.handle(httpResquest)
  expect(httpResponse.statusCode).toBe(200)
  expect(httpResponse.body).toEqual({
    id: 'id_valido',
    name: 'nome_valido',
    email: 'email_valido@email.com',
    password: 'senha_valida'

  })
})
