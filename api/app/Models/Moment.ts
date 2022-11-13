import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Comment from './Comment' //importamos nosso models comment para utilizamos e acessamos ele quando preciso

export default class Moment extends BaseModel {
  @hasMany(() => Comment) //Vamos pegar nossos comentarios
  public comments: HasMany<typeof Comment> //Criamos essa variavel pois vamos usar ela para obter nossas query para pegar os comentários
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public image: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
