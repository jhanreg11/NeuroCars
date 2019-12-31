/** Main class used to connect track, population, and demo */
class Simulation {
  /**
   * Create a Simulation.
   * @param {number} trackNumber - index in tracks list that contains track information. [0, 1]
   * @param {number} populationSize - generation size for simulation.
   * @param {number} mutationRate - mutation rate for population. [0, 1]
   */
  constructor(trackNumber, populationSize, mutationRate) {
    this.world = pl.World()
    this.trackId = trackNumber
    this.track = new Track(this.world, trackNumber, populationSize)
    this.population = new Population(populationSize, mutationRate)
    this.track.setAgents(this.population.population)
    this.frameCount = 0
    this.iteration = 0
  }

  /**
   * execute one frame of simulation.
   */
  update() {
    this.frameCount++
    let generateNewPop = true
    this.track.cars.map(function(car) {
      let decision = car.agent.genAction(car.getLocation())
      car.update(1, decision)
      if (car.agent.alive)
        generateNewPop = false
    })

    if (generateNewPop || this.frameCount > 900 + (300 * this.trackId)) {
      updateUI('#generation', String(++this.iteration))
      var avgFitness = this.population.population.reduce((accum, agent) => accum + agent.fitness, 0) / this.population.population.length
      avgFitness = Math.round(avgFitness * 100) / 100
      updateUI('#avg-fitness', String(avgFitness))

      this.population.newGeneration()
      this.track.setAgents(this.population.population)
      this.frameCount = 0
    }

    this.world.step(1.0/60)
  }

  /**
   * load pretrained population
   * @param {string} level - level of training for population.
   */
  loadModel(level) {
    if (level == 'rand')
      this.population.newRandomGeneration()
    else
      this.population.newPretrainedPopulation(this.trackId)

    this.track.setAgents(this.population.population)

    this.frameCount = 0
    this.iteration = 0
  }

  /**
   * Change mutation rate for population.
   * @param {number} rate - new mutation rate. [0, 1]
   */
  changeMutationRate(rate) {
    this.population.mutationRate = rate
  }

  /**
   * Change generation size for population/track.
   * @param {number} size - new size.
   */
  changeGenerationSize(size) {
    if (size == this.getPopSize())
      return

    this.frameCount = 0
    var sizeDiff = size - this.getPopSize()

    if (sizeDiff > 0) {
      this.population.addAgents(sizeDiff)
      this.track.addCars(sizeDiff)
      this.track.setAgents(this.population.population)
    }
    else if (sizeDiff < 0) {
      sizeDiff = Math.abs(sizeDiff)
      this.population.deleteAgents(sizeDiff)
      this.track.deleteCars(sizeDiff)
      this.track.setAgents(this.population.population)
    }

    this.track.moveCarsToStart()
    this.population.resetAgentStats()
  }

  /**
   * Change current track.
   * @param {number} trackNumber - index for new track. [0, 1]
   */
  changeTrack(trackNumber) {
    this.trackId = trackNumber
    this.frameCount = 0
    this.iteration = 0

    this.track.destroyBodies()
    this.track = new Track(this.world, trackNumber, this.getPopSize())
    this.population.newRandomGeneration()
    this.track.setAgents(this.population.population)
  }

  /**
   * Get population size.
   */
  getPopSize() {
    return this.population.size
  }

  /**
   * Get mutation rate.
   */
  getMutationRate() {
    return this.population.mutationRate
  }
}