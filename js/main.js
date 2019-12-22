// main class connecting simulation and neuroevolution

var pl = planck

class Main {
    constructor(wallSegments, goalSegments, startPoint, populationSize, mutationRate) {
        this.world = pl.World()
        this.track = new Track(world, wallSegments, goalSegments, startPoint, populationSize)
        this.evolutionPopulation = new Population(populationSize, mutationRate)
        this.track.setAgents()
    }
}