/** Class containing activation functions for NNs. */
class Activations {
  /**
   * Sigmoid activation function.
   * @param {Array} x - input vector.
   * @returns {Array} output vector.
   */
  static sigmoid(x) {
    return x.map(z => 1 / (1 + Math.exp(-z)))
  }

  /**
   * tanh activation function.
   * @param {Array} x - input vector.
   * @returns {Array} output vector.
   */
  static tanh(x) {
    return x.map(z => Math.tanh(z))
  }
}
