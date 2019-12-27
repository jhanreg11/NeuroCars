class Agent {
  constructor(brain) {
    if (typeof brain == 'undefined')
        brain = new NN([5, 4, 2])
    this.brain = brain
    this.alive = true
    this.fitness = 0
  }

  reproduce(other, mutationRate) {
    if (typeof other == 'undefined')
      return null
    if (typeof mutationRate == 'undefined')
      mutationRate = 0.15

    var newBrain = this.brain.crossover(other.brain)
    newBrain.mutate(mutationRate)

    return new Agent(newBrain)
  }

  genAction(locations, velocity) {
    locations = locations.map((x) => x /= carConfig.rayLength)
    velocity /= carConfig.maxForwardSpeed
    this.fitness += locations.reduce((accum, local) => accum + local, 0)
    // locations.push(velocity)

    var brainOutput = this.brain.ff(locations)
    var decision = {}

    if (brainOutput[0] > 0.25)
      decision.accel = 1
    else if (brainOutput[0] < -0.25)
      decision.accel = -1

    if (brainOutput[1] > 0.25) {
      decision.turn = 1
    }
    else if (brainOutput[1] < -0.25) {
      decision.turn = -1
    }

    return decision
  }

}