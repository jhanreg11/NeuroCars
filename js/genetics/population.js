var UniqueRandom = { NumHistory: new Array(), generate: function(maxNum) {
	if (this.NumHistory.length == maxNum)
	  return Math.floor(Math.random() * maxNum)

  var current = Math.floor(Math.random() * maxNum)
  while (this.NumHistory.includes(current))
    current = Math.floor(Math.random() * maxNum)

  this.NumHistory.push(current)
  return current
}}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class Population {
  constructor(agentNum, mutationRate) {
    this.size = agentNum
    this.mutationRate = mutationRate
    this.population = Array.from({length: agentNum}, () => new Agent())
    this.topFitness = 0
    this.topPerformer = null
  }

  evaulatePopulation() {
    var totalFitness = this.population.reduce((a, b) => a + b.fitness, 0)
    this.population.sort((a, b) => b.fitness - a.fitness)

    if (this.population[0].fitness > this.topFitness) {
      this.topFitness = this.population[0].fitness
      this.topPerformer = this.population[0]
    }

    if (totalFitness)
      this.population.forEach((agent) => agent.fitness /= totalFitness)
    console.log(this.population)
  }

  newPopulation() {
    this.evaulatePopulation()
    console.log('evaluated population')
    var topPerformer1 = this.population[0]
    var topPerformer2 = this.population[1]
    this.population = this.population.map(() => this.createChild())

    // ensure variance in new populations
    for (var i = 0; i < 5; ++i)
      this.population[i] = new Agent()

    // ensure that top performers are more favored in new population
    for (var i = 5; i < 10; ++i)
      this.population[i] = topPerformer1.reproduce(topPerformer2, this.mutationRate)

    console.log('created new population')
  }

  newRandomPopulation() {
    this.population = this.population.map(() => new Agent())
  }

  createChild() {
    // assumes evaluatePopulation has already been called
    var parent1 = this.pickParent()
    var parent2 = this.pickParent()
    return parent1.reproduce(parent2, this.mutationRate)
  }

  pickParent() {
    // tournament selection
  	// shuffle(this.population)
    // var group = this.population.slice(0, 20)
    // group.sort((a, b) => b.fitness - a.fitness)
    // return group[0]

    // roulette selection
    if (this.population[0].fitness == 0 || this.population[0].fitness == 1) {
      var i = Math.floor(Math.random() * this.population.length)
      console.log(i)
      return this.population[i]
    }

    var target = Math.random() * .75
    var curr = 0
    var i = 0
    while (curr < target)
      curr += this.population[i++].fitness
    console.log(i-1)
    return this.population[i - 1]
  }
}