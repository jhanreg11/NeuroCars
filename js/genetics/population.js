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

var models = [
  {
    full: new Agent("0.3871639797779429 0.18267352414317273 -0.3358508460895 0.9706693276440768 0.6290651501379156" +
      " -0.7371063110284841 0.5828271468411685 -0.9790709227630137 -0.7140007199045275 -0.23084324200323803 " +
      "0.2659654364802284 0.1423443129776265 0.9935910246516184 -0.7838593807541177 0.10273037257760897 " +
      "-0.2790992755543473 -0.8698540313315224 -0.04833884048718984 -0.9558044850689162 -0.8864067914465124 " +
      "-0.10497868648233544 0.8738237803463154 -0.7058346933408726 0.28300939340084197 0.8450764247305296 " +
      "0.21508618032756832 0.41450518614961185 0.35444987178189935 -0.7756228401250875 -0.6372416917857215 " +
      "-0.6413223452417696 -0.1309329450799046 -0.9219078317601515 -0.6359845918076457"),
    semi: new Agent("-0.67337555435076 -0.9568717898268093 0.22967893866010636 0.9284148786960364 " +
      "0.5585802625636123 -0.15287364166838557 -0.28504162600148186 0.8283810297911476 0.7756751354414804 " +
      "0.44605153965486455 -0.6776362156136355 -0.9155032583496272 0.5227080024511088 0.5952567479179871 " +
      "-0.7648264163546532 0.0872508971207906 0.9448166960794442 -0.8075487856711412 -0.36883175955939285 " +
      "0.2582993260648494 0.21195302616152745 -0.7588047116662628 -0.08561268931741806 0.33346645787553797 " +
      "0.32520429153473174 0.7688850841681818 -0.022487223465286643 -0.5463590876118558 0.4117160034774172 " +
      "-0.8342176306806044 0.8762665836200858 -0.12431484951953298 0.8436670599124962 0.07069823890225901")
  },
  {
    semi: new Agent(),
    full: new Agent()
  },
  {
    semi: new Agent(),
    full: new Agent()
  }
]

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
      updateUI('#top-fitness', String(Math.round(this.topFitness * 100) / 100))
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
    for (var i = 0; i < 10; ++i)
      this.population[i] = new Agent()

    // ensure that top performers are more favored in new population
    for (var i = 5; i < 15; ++i)
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
      // console.log(i)
      return this.population[i]
    }

    var target = Math.random() * 0.75 // multiplied by 0.5 to decrerase chance of lower ranking agents being chosen
    var curr = 0
    var i = 0
    while (curr < target)
      curr += this.population[i++].fitness
    // console.log(i-1)
    return this.population[i - 1]
  }

  addAgents(num) {
    for (var i = 0; i < num; ++i)
      this.population.push(new Agent())
    this.size += num
  }

  deleteAgents(num) {
    this.population.splice(0, num)
    this.size -= num
  }

  resetAgentStats() {
    this.population.forEach(function (agent) {
      agent.fitness = 0
      agent.alive = true
    })
  }

  newPretrainedPopulation(trackNum, level) {
    var seed = models[trackNum][level]
    this.population = this.population.map(function() {
      let newAgent = new Agent(seed.brain.copy())
      return newAgent
    })
  }
}