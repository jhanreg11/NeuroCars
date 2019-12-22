
class Population {
  constuctor(agentNum, mutationRate) {
    self.size = agentNum
    self.mutationRate = mutationRate
    self.population = Array.from({length: agentNum}, () => new Agent())
  }


}