// main class connecting simulation and neuroevolution

var pl = planck

class Simulation {
    constructor(trackNumber, populationSize, mutationRate) {
      this.world = pl.World()
      this.id = trackNumber
      this.track = new Track(this.world, trackNumber, populationSize)
      this.population = new Population(populationSize, mutationRate)
      this.track.setAgents(this.population.population)
      this.frameCount = 0
      this.iteration = 0

      console.log(this.population.size, this.track.cars.length)
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

    loadModel(type) {
      if (type == 'rand')
        this.population.newRandomPopulation()
      else
        this.population.newPretrainedPopulation(this.id, type)

			this.track.setAgents(this.population.population)

      this.frameCount = 0
      this.iteration = 0
    }

    changeMutationRate(rate) {
      this.population.mutationRate = rate
    }

    changeGenerationSize(size) {
      console.log('changing generation size to', size, 'current population size', this.getPopSize())
      if (size == this.getPopSize())
        return

      this.frameCount = 0
      var sizeDiff = size - this.getPopSize()
      console.log('size difference', sizeDiff)

      if (sizeDiff > 0) {
        console.log('adding bots')
        this.population.addAgents(sizeDiff)
        this.track.addCars(sizeDiff)
        this.track.setAgents(this.population.population)
      }
      else if (sizeDiff < 0) {
        sizeDiff = Math.abs(sizeDiff)
        console.log('deleting bots')
        this.population.deleteAgents(sizeDiff)
        this.track.deleteCars(sizeDiff)
        this.track.setAgents(this.population.population)
      }

      this.track.moveCarsToStart()
      this.population.resetAgentStats()

      console.log('new population size', this.population.size, 'new car number', this.track.cars.length)
    }

    changeTrack(trackNumber) {
      this.id = trackNumber
      this.track.destroyBodies()
      this.population = new Population(this.getPopSize(), this.getMutationRate())
      this.track = new Track(this.world, trackNumber, this.getPopSize())
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
      return this.population.size
    }

    getMutationRate() {
      return this.population.mutationRate
    }
}