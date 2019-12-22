class Agent {
  constructor(brain) {
    if (typeof brain == 'undefined')
        brain = new NN([6, 5, 4])
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
    locations.push(velocity)
    var brainOutput = this.brain.ff(locations)
    var accel = 0
    var turn = 0

    if (brainOutput[0] > 0.5)
      accel = 1
    else if (brainOutput[1] > 0.5)
      accel = -1

    if (brainOutput[2] > 0.5)
      turn = 1
    else if (brainOutput[3] > 0.5)
      turn = -1

    return {accel: accel, turn: turn}
  }
}