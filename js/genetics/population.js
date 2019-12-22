
class Population {
  constructor(agentNum, mutationRate) {
    this.size = agentNum
    this.mutationRate = mutationRate
    this.population = Array.from({length: agentNum}, () => new Agent())
    this.topFitness = 0
    this.topPerformer = null
  }

  evaulatePopulation() {
    var totalFitness = this.population.reduce((a, b) => a.fitness + b.fitness, 0)
    this.population.sort((a, b) => b.fitness - a.fitness)

    if (this.population[0].fitness > this.topFitness) {
      this.topFitness = this.population[0].fitness
      this.topPerformer = this.population[0]
    }

    if (totalFitness)
      this.population.forEach((agent) => agent.fitness /= totalFitness)
  }

  newPopulation() {
    this.evaulatePopulation()
    console.log('evaluated population')

    this.population = this.population.map(() => this.createChild())
    console.log('created new population')
  }

  createChild() {
    // assumes evaluatePopulation has already been called

    var parent1 = this.pickParent()
    var parent2 = this.pickParent()
    while (parent2 == parent1)
      parent2 = this.pickParent()

    return parent1.reproduce(parent2, this.mutationRate)
  }

  pickParent() {
    if (this.population[0].fitness == 0)
      return this.population[Math.floor(Math.random() * this.population.length)]

    var target = Math.random()
    var curr = 0
    var i = 0
    while (curr < target)
      curr += this.population[i++].fitness

    return this.population[i - 1]
  }
}