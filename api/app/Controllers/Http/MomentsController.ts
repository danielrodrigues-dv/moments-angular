import { v4 as uuidv4 } from 'uuid' //Importando o pacote do uuid que deixa agente escolher e registrar no banco de dados nome para nossas imagens
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext' //Aqui tem todas as informações da requisição como por exemplo body etc.
import Moment from 'App/Models/Moment' //Importei meu Moment para utilizamos ele para realizarmos as manipulações de banco de dados
import Application from '@ioc:Adonis/Core/Application' //Ele vai conseguir colocar a minha imagem no lugar que eu quero, como a imagem vai ficar no servidor em uma determinada pasta que escolhermos
export default class MomentsController {
  //Na variavel validationsOptions estou colocando o tipo da imagem e o tamanho maximo dela
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    //Preciso pegar tudo que vem do body/coporto de requisição e enviar para o banco
    const body = request.body() //Estou pegando todos os dados que vieram da minha requisição
    const image = request.file('image', this.validationOptions) //Estou pegando a imagem que esta vindo na requisição e validando o tipo se é imagem ou não e o tamanho máximo da imagem
    //se a imagem veio passe para o código de dentro da função
    if (image) {
      const imageName = `${uuidv4()}.${image.extname}` //A imagem veio agora estou gerando e concatenando com a extensão da imagem um nome aletorio, vai ficar mais o menos assim 21321dsadasdasdasd.png
      //Estou movendo/encaminhando as imagens que vem da requisição para a pasta uploads
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })
      body.image = imageName //Estou salvando/reatribuindo o nome da minha imagem no corpo da minha requisição, pois mudamos o nome da imagem com uuid lembra? ok
    }

    const moment = await Moment.create(body) //Estou inserindo no banco os dados que peguei da requisição e coloquei um await para aguardar a variavel body conseguir pegar pra mim apos ter pego o valor vindo da requisição eu insiro os dados no banco
    response.status(201) //Se os dados inseridos no banco de dados foi criado com sucesso eu retorno um status 2021
    return {
      message: 'Momento criado com sucesso!', //Vou retornar essa mensagem como resposta caso seja true a operação
      data: moment, //Vou passar também o valor criado para inserir no banco de dados
    }
  }
  public async index() {
    const moments = await Moment.query().preload('comments') //Pegando todos os valores do banco de dados ate as tabelas relacionadas com esse banco que no caso tem uma chamada comments
    return {
      data: moments, //Estou retornando o valor que eu peguei do banco de dados para o usuário
    }
  }
  //Estou recebendo o id que passamos na requisição
  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id) //Se não encontrar nosso registro no banco ele vai dar um erro por isso que passei o findorfail
    await moment.load('comments')
    return {
      data: moment,
    }
  }
  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id) //Se não encontrar nosso registro no banco ele vai dar um erro por isso que passei o findorfail
    await moment.delete() //Se encontrar o id realize a exclusão do mesmo e todo seu registro
    return {
      message: 'Momento excluído com sucesso!', //Se a operação for bem sucedida retorno uma reposta que deu certo
      data: moment, //Retorno também um log que não foi mais encontrado aquele registro que solicitou para apagar
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body() //Estou pegando todos os dados que vieram da minha requisição
    const moment = await Moment.findOrFail(params.id) //Se não encontrar nosso registro no banco ele vai dar um erro por isso que passei o findorfail

    moment.title = body.title //Estou criando uma variavel nova e atribuindo o valor que vem da requisição/subistituindo para ela
    moment.description = body.description //Estou criando uma variavel nova e atribuindo o valor que vem da requisição/subistituindo para ela

    //No primeiro if estou verificando se a mesma imagem que foi enviada na atualização é uma imagem nova ou antiga se for nova faça a subistituição e eu estou passando outro paramentro para ver se tem imagem ou não, ou um o outro
    if (moment.image !== body.image || !moment.image) {
      const image = request.file('image', this.validationOptions) //Estou pegando a imagem e em seguida estou validando o tipo dela se estiver de acordo pode registrar
      //A imagem veio? se sim faça a lógica dentro do if
      if (image) {
        const imageName = `${uuidv4()}.${image.extname}` //A imagem veio agora estou gerando e concatenando com a extensão da imagem um nome aletorio, vai ficar mais o menos assim 21321dsadasdasdasd.png
        //Estou movendo/encaminhando as imagens que vem da requisição para a pasta uploads
        await image.move(Application.tmpPath('uploads'), {
          name: imageName, //estou atribuido um novo nome para imagem gerada apartir do uuidv4
        })
        moment.image = imageName //e agora de fato atribuo para o banco de dados o nome atual da minha imagem
      }
    }
    await moment.save() //envia a operação para ser registrado
    return {
      mesage: 'Momento atualizado com sucesso!',
      data: moment,
    }
  }
}
