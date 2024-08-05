import { notas } from '../mocks/results.json'

export default class Note {
  static async getPopularNotes () {
    const popularNotes = [...notas]
    const topNotes = popularNotes.splice(0, 10)
    return topNotes
  }
}
