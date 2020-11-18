export class ServerError extends Error {
  constructor () {
    super('Erro interno de servidor')
    this.name = 'ServerError'
  }
}
