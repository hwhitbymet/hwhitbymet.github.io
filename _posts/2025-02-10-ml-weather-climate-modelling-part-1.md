---
layout: post
title: "Data-driven Weather and Climate Modelling from Scratch, Part One: the Perceptron and Multi-layer Perceptron"
date: 2025-02-10
---

Machine learning, a discipline at the intersection of computer science, statistics and neuroscience, has a history spanning decades. However, its application to the realm of weather and climate sciences is relatively new, and it can be difficult to effectively synthesise advanced knowledge from both fields. To being understanding machine learning, we need to start with the most basic component: the **perceptron**.

Before we begin: there are many existing resources on this topic, including these educational video series which I found very helpful when first coming to terms with these concepts:

- 3Blue1Brown - [But what is a neural network?](https://www.youtube.com/watch?v=aircAruvnKk)  
- StatQuest - [The Essential Main Ideas of Neural Networks](https://www.youtube.com/watch?v=CqOfi41LfDw)  


If you don't have time for that, or just prefer text content (with some visual guides and interactive elements), read on. Otherwise, feel free to skip to (insert part here)

A perceptron can be thought of a few ways. A common analogy is to compare it to a neuron in the human brain: a single part of a much larger network capable of learning complex things. Some earlier literature even refer to perceptrons as "artificial neurons" or simply "neurons" - but it's important to remember that they're actually quite a lot more simple than a real, biological neuron.

In reality, a perceptron is a short composite function - one which takes in a set of inputs (scalars), a set of *weights* (coefficients) corresponding to each input, and a global *bias* term. The perceptron does a *weighted sum* of all its inputs (it multiplies the inputs by their respective weights before summing them) and passes the result to an *activation function* which returns the final result.

Here's all that as a single function definition:

$$
f(\mathbf{x}) = \phi\left(\sum_{i=1}^n w_i x_i + b\right)
$$

Where $\phi$ is the activation function, $w \in W$ are our weights, $x \in X$ are our inputs, $n = \mid X \mid = \mid W \mid$, and $b$ is our bias.

Congratulations, you now understand the precise mathematical definition of a perceptron. But this is still rather opaque - where do the input values and weights come from, and what does this function do in practical terms?

To understand this better, let's instead look at the perceptron using a very common and popular visualisation:

<div id="viz-basic" class="perceptron-container"></div>

<script src="/assets/js/PerceptronVisualisation.js"></script>
<script>
  const basicViz = new PerceptronVisualization('viz-basic', {
    width: 600,
    height: 300,
    neuronRadius: 50,
    inputAngle1: 45,
    inputAngle2: -45,
    textContent: 'ϕ',
    inputNodes: 0
  });
</script>


Here, the arrows leading into the circle represent the input (weight and input values are invisible for now), the arrow leading out is the output, and $\phi$ is once again our activation function. If you're familiar with graph- or network-theory, you may notice that this visualisation resembles single node in a network. This is because we typically connect perceptrons together using these edges, where the output of one becomes the input of another, to make a whole *neural network*.

While we're not yet ready to start constructing larger networks of perceptrons, let's continue enforcing the metaphor by visualising our input *values* as **input nodes**:

<div id="viz-input-nodes" class="perceptron-container"></div>

<script src="/assets/js/PerceptronVisualisation.js"></script>
<script>
  const inputNodesViz = new PerceptronVisualization('viz-input-nodes', {
    width: 600,
    height: 400,
    neuronRadius: 50,
    inputAngle1: 45,
    inputAngle2: -45,
    textContent: 'ϕ',
    inputNodes: 2
  });
</script>

In the figure above, each node on the left simply represents a set, static input value that is fed into the perceptron node in the centre - these new nodes aren't perceptrons, just a visual shorthand for individual values from our set of inputs $X$. This set is typically represented as an array or list type when programming, but visualising them as nodes feeding values into our perceptron(s) (as above) is common.

To make this more concrete, here's an interactive visualisation where you can also change the weight values, as well as choose between some of the most common activation functions to get a final result:

<div id="interactive-perceptron" class="perceptron-container"></div>

<script src="/assets/js/InteractivePerceptron.js"></script>
<script>
  const interactiveViz = new PerceptronVisualization('interactive-perceptron', {
    width: 600,
    height: 400,
    neuronRadius: 50,
    inputAngle1: 45,
    inputAngle2: -45,
    interactive: true
  });
</script>

As you can see, the activation function is always a simple, computationally-cheap nonlinearity. As for why there are so many choices, this is very often left up to intuition or preference. As a general rule, certain activation functions tend to produce better results for certain kinds of problem, but it's not always understood why. In short, don't worry about it - just be aware of this option, and that you can change it at any time.

If you've had a go at the above diagram, you're probably wondering what these input and weight values would be set to for an actual problem. Let's start with a simple example: say we had an ordered set ${1, 2, 3}$ and we wanted to predict the next number in the sequence. We know that the natural answer is $4$, but our perceptron doesn't. The point of this exercise is to *train* our perceptron to reach that answer on its own. 

How do we do that? First, let's make an input node for each value in our known sequence, and set all the *weights* (the values the inputs are multiplied by prior to the sum) to **random values**:













