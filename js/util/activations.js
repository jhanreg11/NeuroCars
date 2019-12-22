class Activations {
  static sigmoid(x) {
    return x.map(z => 1 / (1 + Math.exp(-z)))
  }

  static tanh(x) {
    return x.map(z => Math.tanh(z))
  }
}
