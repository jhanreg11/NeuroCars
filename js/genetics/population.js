/** Class representing the genetic algorithm population. */
class Population {
	/**
	 * Create a new population.
	 * @param {number} agentNum - number of agents in new population.
	 * @param {number} mutationRate - mutation rate
	 */
	constructor(agentNum, mutationRate) {
		this.size = agentNum
		this.mutationRate = mutationRate
		this.population = Array.from({length: agentNum}, () => new Agent())
		this.topFitness = 0
		this.topPerformer = null
	}

	/**
	 * create a new generation.
	 */
	newGeneration() {
		this.evalGeneration()
		console.log('evaluated population')
		var topPerformer1 = this.population[0]
		var topPerformer2 = this.population[1]
		this.population = this.population.map(() => this.createChild())

		// ensure variance in new populations
		for (var i = 0; i < 10; ++i)
			this.population[i] = new Agent()

		// ensure that top performers are more favored in new population
		for (var i = 10; i < 20; ++i)
			this.population[i] = topPerformer1.reproduce(topPerformer2, this.mutationRate)
	}

	/**
	 * Evaluate and rank population.
	 */
	evalGeneration() {
		var totalFitness = this.population.reduce((a, b) => a + b.fitness, 0)
		this.population.sort((a, b) => b.fitness - a.fitness)

		if (this.population[0].fitness > this.topFitness) {
			this.topFitness = this.population[0].fitness
			this.topPerformer = this.population[0]
			updateUI('#top-fitness', String(Math.round(this.topFitness * 100) / 100))
		}

		if (totalFitness)
			this.population.forEach((agent) => agent.fitness /= totalFitness)
	}

	/**
	 * Create a new agent by crossing over 2 selected parents.
	 * @returns {Agent} new child of 2 parents.
	 */
	createChild() {
		var parent1 = this.pickParent()
		var parent2 = this.pickParent()
		return parent1.reproduce(parent2, this.mutationRate)
	}

	/**
	 * Pick a parent from current generation using roullette selection. Assumes evalGeneration has been called.
	 * @returns {any | Agent} agent from current generation.
	 */
	pickParent() {
		if (this.population[0].fitness == 0 || this.population[0].fitness == 1) {
			var i = Math.floor(Math.random() * this.population.length)
			return this.population[i]
		}

		var target = Math.random() * 0.75 // multiplied to decrease chance of lower ranking agents being chosen
		var curr = 0
		var i = 0
		while (curr < target)
			curr += this.population[i++].fitness

		return this.population[i - 1]
	}

	/**
	 * Add agents to current generation, increasing total size.
	 * @param {number} num - The number of agents to add.
	 */
	addAgents(num) {
		for (var i = 0; i < num; ++i)
			this.population.push(new Agent())
		this.size += num
	}

	/**
	 * Delete agents from current generation, decreasing total size.
	 * @param {number} num - The number of agents to delete.
	 */
	deleteAgents(num) {
		this.population.splice(0, num)
		this.size -= num
	}

	/**
	 * Reset fitness of all agents and set them to alive.
	 */
	resetAgentStats() {
		this.population.forEach(function (agent) {
			agent.fitness = 0
			agent.alive = true
		})
	}

	/**
	 * Create new randomly spawned generation.
	 */
	newRandomGeneration() {
		this.population = this.population.map(() => new Agent())
	}

	/**
	 * Generate new pretrained population.
	 * @param {number} trackNum - What track to generate pretrained model for. Corresponds to tracks indices.
	 * @param {string} level - Level of training to generate.
	 */
	newPretrainedPopulation(trackNum) {
		var seedList = models[trackNum]
		console.log(seedList)
		this.population = this.population.map(function () {
			let i = Math.floor(Math.random() * seedList.length)
			return new Agent(seedList[i])
		})
	}
}