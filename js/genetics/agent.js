/** Class representing an agent in genetic algorithm. */
class Agent {
  /**
   * Create an agent.
   * @param {Array | NN | string} brain - architecture of brain, NN for brain, or serialized NN fr brain.
   */
  constructor(brain) {
    if (typeof brain == 'undefined')
        brain = new NN(brainArchitecture)
    else if (typeof brain == 'string')
      brain = new NN(brainArchitecture).deserialize(brain)
    this.brain = brain
    this.alive = true
    this.fitness = 0
  }

  /**
   * Create child agent.
   * @param {Agent} other - other parent for child.
   * @param {Number} mutationRate - mutation rate for child.
   * @returns {null|Agent} child agent, or null for invalid call.
   */
  reproduce(other, mutationRate) {
    if (typeof other == 'undefined')
      return null
    if (typeof mutationRate == 'undefined')
      mutationRate = 0.15

    var newBrain = this.brain.crossover(other.brain)
    newBrain.mutate(mutationRate)

    return new Agent(newBrain)
  }

  /**
   * decide whether to turn right or left and update fitness.
   * @param {Array} locations - distance to walls in 5 directions from front of agent's car.
	 * @return {Number} 1 for right, -1 for left, 0 for no turn.
   */
  genAction(locations) {
    locations = locations.map((x) => x /= carConfig.rayLength)
    this.fitness += locations.reduce((accum, local) => accum + local, 0) * .025 // update fitness.

    var brainOutput = this.brain.ff(locations)

    if (brainOutput[0] > 0.25)
      return 1
    else if (brainOutput[0] < -0.25)
      return -1

    return 0
  }

}