class NN {
  constructor(layers, activation) {
    // set activation
    if (activation == undefined)
      activation = Activations.tanh
    this.activation = activation

    // if weights are already given
    if (typeof layers[0] != "number") {
      this.weights = layers
      return
    }

    this.weights = [new Matrix(layers[1], layers[0]+1)]
    for (var i = 1; i < layers.length-1; ++i)
      this.weights.push(new Matrix(layers[i+1], layers[i]+1))
  }

  ff(x) {
    var a = x
    var z = null

    for (var w of this.weights) {
      a.push(1)
      z = w.mul(a)
      a = this.activation(z)
    }

    return a
  }

  crossover(other) {
    var newNN = new NN(this.weights)

    for (var i = 0; i < this.weights.length; ++i) {
      for (var j = 0; j < this.weights[i].rows.length; ++j) {
        for (var k = 0; k < this.weights[i].rows[j].length; ++k) {
          if (Math.random() >= .5) {
            newNN.weights[i].set(other.weights[i].rows[j][k], j, k)
          }
        }
      }
    }
    // var mat = Math.floor(Math.random() * this.weights.length)
    // var row = Math.floor(Math.random() * this.weights[mat].length)
    // var col = Math.floor(Math.random() * this.weights[mat].rows[row].length)
    //
    // for (var k = col; j < this.weights[mat].rows[row].length; ++k)
    //   this.weights[mat].set(other.weights[i].rows[j][k], row, k)
    //
    // for (var j = row + 1; j < this.weights[mat].rows.length; ++j) {
    //   for (var k = 0; k < this.weights[mat].rows[j].length; ++k)
    //     this.weights[mat].set(other.weights[i].rows[j][k], j, k)
    // }
    //
    // for (var i = mat + 1; i < this.weights.length; ++i) {
    //   for (var j = 0; j < )
    // }
    return newNN
  }

  mutate(rate) {
    for (var i = 0; i < this.weights.length; ++i) {
      for (var j = 0; j < this.weights[i].rows.length; ++j) {
        for (var k = 0; k < this.weights[i].rows[j].length; ++k) {
          if (Math.random() <= rate)
            this.weights[i].rows[j][k] = Math.random() * 2 - 1
        }
      }
    }
  }

  serialize() {
    var returnString = ''
    for (var i = 0; i < this.weights.length; ++i) {
      for (var j = 0; j < this.weights[i].rows.length; ++j) {
        for (var k = 0; k < this.weights[i].rows[j].length; ++k) {
          returnString += this.weights[i].rows[j][k] + ' '
        }
      }
    }

    return returnString
  }

  deserialize(serialized_nn) {
    var tokens = serialized_nn.split(' ')
    var tokenCounter = 0
    for (var i = 0; i < this.weights.length; ++i) {
      for (var j = 0; j < this.weights[i].rows.length; ++j) {
        for (var k = 0; k < this.weights[i].rows[j].length; ++k) {
          this.weights[i].rows[j][k] = Number(tokens[tokenCounter++])
        }
      }
    }
  }


}
