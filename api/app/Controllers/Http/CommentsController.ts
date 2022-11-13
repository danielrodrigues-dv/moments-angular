import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment' //importamos nosso models comment para utilizamos e acessamos ele quando preciso
import Moment from 'App/Models/Moment'

export default class CommentsController {
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body() //Estou pegando todos os dados que vieram da minha requisição
    const momentId = params.momentId //Estou atribuindo nessa nova variavel oque veio da minha requisição que no casó foi o id do comentários que passamos

    await Moment.findOrFail(momentId) //Estou verificando se existe esse comentário ou não

    body.momentId = momentId //Estou reatribuindo para requisição o id que tem registrado no meu baco se é o mesmo ou não

    const comment = await Comment.create(body) //Caso tenha o meu id seja verdairo eu crio o comentario que veio da requisição no banco de dados

    response.status(201) // Retorno o status 201 como true que deu certo a operação de registro

    return {
      message: 'Comentário adicionado com sucesso!', //retorno tambem para o usuario essa mensagem que deu certo a operação
      data: comment, //e retorno para o usuario tambem os valores que ele mandou
    }
  }
}
