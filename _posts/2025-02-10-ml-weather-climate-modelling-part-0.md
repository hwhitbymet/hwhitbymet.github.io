---
layout: post
title: "Data-driven Weather and Climate Modelling from Scratch, Part Zero: Introduction"
date: 2025-02-10
---
Welcome to this short series of blog posts where we'll be exploring how to build a data-driven weather and climate forecasting model from the very basics. Specifically, we'll be building a **Graph Neural Network**, or GNN, which is the architecture powering competitive data-driven forecasting models such as **FastNet**, **GraphCast** and (parts of) **AIFS**.

This is an introductory, on-boarding tutorial designed for weather and climate scientists. However, it can be followed by anyone comfortable with linear algebra - there's no code, only some formulas and visualisations. We'll start by defining what a *perceptron* is, and how we can construct a *multi-layer perceptron* using them. Then, we'll explore *convolutional neural networks* - which work similarly to GNNs but are constrained to regular grids - before finally building the GNN itself. If those terms are new to you, or if you need a refresher, you're in the right place.

First, however, a note: while we're looking at this through a climate modelling perspective, many of the concepts we'll be exploring are applicable much more generally to other domains. In machine learning terms, we're interested in building a *generative model* which takes in a sequence of data, learns some parameters based on that data, and extrapolates the next step in the sequence based on those parameters. Here we'll be predicting the next state of the atmosphere to create a forecast, but from the machine's perspective there's nothing special about the data - it's just trying to find the best parameters to predict which numbers go up or down when other numbers change over time.

This is, incidentally, why we call this approach to weather and climate modelling *data-driven* - instead of implementing algorithms designed after our own understanding of physics, we ask a computer program to look at all the available data and come up with its own model. This has the potential to enable forecasts which consider subtle, otherwise overlooked or less-understood processes, however it also comes with additional issues we need to be aware of. The quality of the *training data* - the data our model learns from - is paramount, and it is as difficult as ever to design a model which is stable over long rollouts.

Speaking of data, the problem we're trying to solve is further exacerbated by the high dimensionality of our climate data. Unlike the 1-dimensional text strings learned by large language models (LLMs) like ChatGPT, we're trying to predict the next step in a sequence of large 3D matrices which hold atmospheric data taken across several pressure layers in the atmosphere. To illustrate this better, picture the atmosphere as a 3D matrix where each layer holds a single variable's values across a regular latitude-longitude grid:

[image]

This is essentially how the machine sees ERA5 reanalysis data - which is naturally a popular means of representing past atmospheres, even in machine learning. Thinking of the climate like this 3D matrix, we can apply techniques from computer vision - remembering that a digital image itself has 3 channels for red, blue and green - to try to predict the next step. There's naturally a bit more to it, but this is a good starting point - almost all atmospheric prediction models borrow from computer vision in some way.

The focus of this tutorial will be more on understanding than depth. There are several great resources already covering the mathematical underpinnings of machine learning, and I will include links to some of these throughout the series for the curious reader. Later on, we'll explore **Convolutional Neural Networks** (CNNs) using these principles, before exploring the more complex **Graph Neural Networks** (GNNs) which are used as the backbone of some operational models in use today. Lastly, we'll explore a real operational model and how it compares to its contemporaries in the literature.

**Part one** will provide a brief overview of the foundational building blocks of (almost) all ML systems - the **perceptron** and its older sibling, the **multi-layer perceptron** (MLP). Even if you're already comfortable with these, I encourage at least skimming this section to understand the framing used going forwards.




