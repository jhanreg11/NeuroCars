// main class connecting simulation and neuroevolution

var pl = planck

var tracks = [
  {
    id: 0,
    walls: [[[45, 55], [0, 10]], [[0, 10], [-20, 10]], [[-20, 10], [-40, 40]],
    [[-40, 40], [-60, 15]], [[-60, 15], [-50, 0]], [[-50, 0], [-50, -20]], [[-50, -20], [-60, -30]],
    [[-60, -30], [-60, -60]], [[-60, -60], [-50, -60]], [[-50, -60], [-50, -30]], [[-50, -30], [-40, -20]],
    [[-40, -20], [-40, 0]], [[-40, 0], [-50, 15]], [[-50, 15], [-40, 25]], [[-40, 25], [-20, 0]], [[-20, 0], [0, 0]],
    [[0, 0], [50, 50]]],
    checkpoints: [[[-50, -45], [-60, -45]], [[-50, -40], [-60, -40]], [[-50, -35],[-60, -35]], [[-50, -30], [-60, -30]],
    [[-45, -25], [-55, -25]], [[-40, -20], [-50, -20]],
    [[-40, -10], [-50, -10]], [[-40, 0], [-50, 0]], [[-45, 10], [-57, 10]], [[-50, 15], [-60, 15]],
    [[-45, 20], [-55, 20]], [[-42, 23], [-48, 27]], [[-40, 25], [-40, 35]], [[-36, 20], [-32, 25]],
    [[-32, 15], [-29, 22]], [[-28, 10], [-23, 15]], [[-20, 0], [-20, 10]], [[-10, 0], [-10, 10]], [[0, 0], [0, 10]],
    [[10, 10], [6, 16]], [[15, 15], [10, 20]], [[25, 25], [20, 30]], [[35, 35], [30, 40]], [[45, 45], [40, 50]]],
    start: pl.Vec2(-55, -50)
  },
  {
    id: 1,
    walls: [],
    checkpoints: [],
    start: []
  },
  {
    id: 2,
    walls: [],
    checkpoints: [],
    start: []
  }
]

var models = [
  {
    semi: new Agent(),
    full: new Agent()
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

class Simulation {
    constructor(trackNumber, populationSize, mutationRate) {
      this.world = pl.World()
      this.id = trackNumber
      this.track = new Track(this.world, tracks[trackNumber].walls, tracks[trackNumber].checkpoints, tracks[trackNumber].start, populationSize)
      this.population = new Population(populationSize, mutationRate)
      this.track.setAgents(this.population.population)
      this.frameCount = 0
      this.iteration = 0
    }

    update() {
      this.frameCount++
      let generateNewPop = true
			this.track.cars.map(function(car) {
        let decision = car.agent.genAction(car.getLocation(), car.body.getLinearVelocity().length)
        car.update(1, decision.turn)
				if (car.agent.alive)
				  generateNewPop = false
      })

      if (generateNewPop || this.frameCount > 1000) {
        updateUI('#generation', String(++this.iteration))
        var avgFitness = this.population.population.reduce((accum, agent) => accum + agent.fitness, 0) / this.population.population.length
        avgFitness = Math.round(avgFitness * 100) / 100
        updateUI('#avg-fitness', String(avgFitness))
        this.population.newPopulation()
        this.track.setAgents(this.population.population)
        this.frameCount = 0
      }

      this.world.step(1.0/60)
    }

    loadSemiTrained() {

    }

    loadFullyTrained() {

    }

    loadNoTrained() {

    }

    changeMutationRate(rate) {

    }

    changeGenerationSize(size) {

    }

    changeTrack(trackNumber) {
      this.id = trackNumber
      this.track.destroyAllBodies()
      this.population = new Population(this.getPopSize(), this.getMutationRate())
      this.track = new Track(this.world, tracks[trackNumber].walls, tracks[trackNumber].checkpoints, tracks[trackNumber].start, this.getPopSize())
      this.frameCount = 0
      this.iteration = 0

      if (this.semiTrain)
        this.loadSemiTrained()
      else if (this.fullTrain)
        this.loadFullyTrained()
      else
        this.loadNoTrained()
    }

    getPopSize() {
      return this.population.population.length
    }

    getMutationRate() {
      return this.population.mutationRate
    }
}