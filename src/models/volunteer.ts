import { Schema, model } from 'mongoose'

export default model('voluntario', new Schema({
  nome: String,
  ra: String,
  rg: String,
  cpf: String,
  endereço: String,
  ingresso_ufabc: Number,
  ingresso_ieee: Number,
  discord: [String],
  termo_compromisso: String,
  curso_interdisciplinar: String,
  curso_específico: String,
  capítulos: {
    type: Map,
    of: {
      cargo: String,
      projetos: [{
        type: Map,
        of: {
          gestor: Boolean,
          log: [[Number, Number]]
        }
      }],
      função: String,
      ativo: {
        type: Boolean,
        default: true
      }
    }
  }
}))
