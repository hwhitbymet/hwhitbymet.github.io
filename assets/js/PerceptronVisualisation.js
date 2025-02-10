class PerceptronVisualization {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }

    // Default options
    this.options = {
      width: 400,
      height: 200,
      neuronRadius: 40,
      inputAngle1: 30,
      inputAngle2: -30,
      lineStroke: 'black',
      lineWidth: 2,
      textContent: 'f',
      inputNodes: 0,
      interactive: false,
      ...options
    };

    this.state = {
      inputs: [0, 0],
      weights: [1, 1],
      activation: 'linear',
      output: 0
    };

    this.activationFunctions = {
      linear: x => x,
      sigmoid: x => 1 / (1 + Math.exp(-x)),
      relu: x => Math.max(0, x),
      softplus: x => Math.log(1 + Math.exp(x)),
      tanh: x => Math.tanh(x),
      'leaky-relu': x => x > 0 ? x : 0.01 * x
    };

    this.init();
  }

  init() {
    // Create SVG element
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', this.options.width);
    this.svg.setAttribute('height', this.options.height);
    this.container.appendChild(this.svg);

    // Define arrowhead marker
    this.defineArrowhead();
    
    // Create SVG groups for proper layering
    this.backgroundGroup = this.createSvgElement('g', { class: 'background' });
    this.foregroundGroup = this.createSvgElement('g', { class: 'foreground' });
    this.activationGroup = this.createSvgElement('g', { class: 'activation' });
    
    // Create controls if interactive
    if (this.options.interactive) {
      this.createControls();
      this.drawInputNodes(this.options.width / 2, this.options.height / 2);
    }

    this.draw();
    
    if (this.options.interactive) {
      this.update();
    }
  }

  defineArrowhead() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', `arrowhead-${this.container.id}`);
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0 L0,7 L9,3.5 Z');
    path.setAttribute('fill', this.options.lineStroke);
    
    marker.appendChild(path);
    defs.appendChild(marker);
    this.svg.appendChild(defs);
  }

  draw() {
    const centerX = this.options.width / 2;
    const centerY = this.options.height / 2;

    // Draw input nodes if specified
    if (this.options.inputNodes > 0) {
      this.drawInputNodes(centerX, centerY);
    }

    // Draw input lines
    this.drawInputLine(centerX, centerY, this.options.inputAngle1);
    this.drawInputLine(centerX, centerY, this.options.inputAngle2);

    // Draw neuron circle in foreground
    const neuron = this.createSvgElement('circle', {
      cx: centerX,
      cy: centerY,
      r: this.options.neuronRadius,
      stroke: this.options.lineStroke,
      'stroke-width': this.options.lineWidth,
      fill: 'white'
    }, this.foregroundGroup);

    // Draw output line
    this.drawOutputLine(centerX, centerY);

    // Draw activation function symbol or visualization
    if (this.options.interactive) {
      this.updateActivationVisualization(
        this.state.inputs.reduce((sum, x, i) => sum + x * this.state.weights[i], 0)
      );
    } else {
      this.drawActivationSymbol(centerX, centerY);
    }
  }

  drawInputNodes(centerX, centerY) {
    const startY = centerY - ((this.options.inputNodes - 1) * 30) / 2;
    for (let i = 0; i < this.options.inputNodes; i++) {
      const nodeX = centerX - 200;
      const nodeY = startY + (i * 280 - 130);
      if (this.options.interactive) {
        new Node(this.svg, nodeX, nodeY, this.options.neuronRadius, { input: true });
      } else {
        new Node(this.svg, nodeX, nodeY, this.options.neuronRadius, { text: `$x_${i}$` });
      }
    }
  }

  drawInputLine(centerX, centerY, angle) {
    const radians = angle * (Math.PI / 180);
    const length = this.options.width / 2 - this.options.neuronRadius;
    
    this.createSvgElement('line', {
      x1: centerX - length * Math.cos(radians),
      y1: centerY - length * Math.sin(radians),
      x2: centerX - this.options.neuronRadius * Math.cos(radians),
      y2: centerY - this.options.neuronRadius * Math.sin(radians),
      stroke: this.options.lineStroke,
      'stroke-width': this.options.lineWidth,
      'marker-end': `url(#arrowhead-${this.container.id})`
    }, this.backgroundGroup);
  }

  drawOutputLine(centerX, centerY) {
    this.createSvgElement('line', {
      x1: centerX + this.options.neuronRadius,
      y1: centerY,
      x2: centerX + this.options.width / 2 - 20,
      y2: centerY,
      stroke: this.options.lineStroke,
      'stroke-width': this.options.lineWidth,
      'marker-end': `url(#arrowhead-${this.container.id})`
    }, this.backgroundGroup);
  }

  drawActivationSymbol(centerX, centerY) {
    this.createSvgElement('text', {
      x: centerX,
      y: centerY,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'font-size': '20',
      textContent: this.options.textContent
    }, this.foregroundGroup);
  }

  // Interactive functionality
  createControls() {
    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'perceptron-controls';
    this.container.appendChild(this.controlsContainer);

    // Activation selector
    this.createActivationSelect();

    // Input/weight controls
    this.controls = [0, 1].map(i => ({
      input: this.createNumberInput(`x${i}`, 0, v => this.state.inputs[i] = v),
      weight: this.createNumberInput(`w${i}`, 1, v => this.state.weights[i] = v)
    }));
    
    // Output display
    this.outputDisplay = document.createElement('div');
    this.outputDisplay.className = 'output-display';
    this.controlsContainer.appendChild(this.outputDisplay);
  }

  createActivationSelect() {
    const select = document.createElement('select');
    select.className = 'activation-select';
    select.innerHTML = Object.keys(this.activationFunctions)
      .map(key => `<option value="${key}">${key}</option>`)
      .join('');
    
    select.addEventListener('change', (e) => {
      this.state.activation = e.target.value;
      this.update();
    });
    
    this.controlsContainer.appendChild(select);
  }

  createNumberInput(label, initialValue, callback) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';
    
    const span = document.createElement('span');
    span.innerHTML = `${label}<sub>${label.slice(1)}</sub> = `;
    
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.01';
    input.value = initialValue.toFixed(2);
    
    input.addEventListener('change', e => {
      const value = parseFloat(e.target.value) || 0;
      input.value = Math.floor(value * 100) / 100;
      callback(value);
      this.update();
    });
    
    wrapper.appendChild(span);
    wrapper.appendChild(input);
    this.controlsContainer.appendChild(wrapper);
    return wrapper;
  }

  update() {
    const inputs = Array.from(this.container.querySelectorAll('input[type="text"]')).map(input => parseFloat(input.value) || 0);
    const weightedSum = inputs.reduce((sum, x, i) => sum + x * this.state.weights[i], 0);
    
    this.state.output = this.activationFunctions[this.state.activation](weightedSum);
    this.outputDisplay.textContent = this.state.output.toFixed(4);
    
    this.updateActivationVisualization(weightedSum);
  }

  updateActivationVisualization(weightedSum) {
    this.activationGroup.innerHTML = '';
    
    const centerX = this.options.width / 2;
    const centerY = this.options.height / 2;
    const scale = this.options.neuronRadius * 0.2; // Further reduced scale
    
    // Draw activation function curve
    const points = Array.from({length: 100}, (_, i) => {
      const x = (i - 50) * 0.1;
      const y = this.activationFunctions[this.state.activation](x);
      return [
        centerX + x * scale,
        centerY - y * scale
      ];
    });
    
    const path = this.createSvgElement('path', {
      d: `M ${points.map(p => p.join(',')).join(' L ')}`,
      stroke: '#7fa3c8',
      'stroke-width': 2,
      fill: 'none'
    }, this.activationGroup);
    
    // Draw dot at weighted sum input point
    const outputY = this.activationFunctions[this.state.activation](weightedSum);
    this.createSvgElement('circle', {
      cx: centerX + weightedSum * scale,
      cy: centerY - outputY * scale,
      r: 4,
      fill: 'red'
    }, this.activationGroup);
  }

  createSvgElement(type, attrs = {}, parent = this.svg) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'textContent') {
        el.textContent = v;
      } else {
        el.setAttribute(k, v);
      }
    });
    parent.appendChild(el);
    return el;
  }
}

// Export for use in browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerceptronVisualization;
} else if (typeof window !== 'undefined') {
  window.PerceptronVisualization = PerceptronVisualization;
}

class Node {
  constructor(svg, x, y, radius, options = {}) {
    this.svg = svg;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.options = {
      text: null,
      input: false,
      activation: false,
      ...options
    };

    this.init();
  }

  init() {
    // Draw node circle
    this.createSvgElement('circle', {
      cx: this.x,
      cy: this.y,
      r: this.radius,
      stroke: 'black',
      'stroke-width': 2,
      fill: 'white'
    });

    // Add central feature based on options
    if (this.options.text) {
      this.createSvgElement('text', {
        x: this.x,
        y: this.y,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '20',
        textContent: this.options.text
      });
    } else if (this.options.input) {
      const textbox = document.createElement('input');
      textbox.type = 'text';
      textbox.value = (Math.random() * 10 - 5).toFixed(2); // Random value between -5 and 5
      textbox.style.position = 'absolute';
      textbox.style.left = `${this.x - 20}px`; // Adjust positioning as needed
      textbox.style.top = `${this.y - 10}px`; // Adjust positioning as needed
      textbox.style.width = '40px';
      textbox.style.textAlign = 'center';
      textbox.style.border = '1px solid #ddd';
      textbox.style.borderRadius = '3px';
      textbox.style.fontFamily = 'monospace';
      this.svg.parentNode.appendChild(textbox);
    } else if (this.options.activation) {
      // Activation function visualization will be handled separately
    }
  }

  createSvgElement(type, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'textContent') {
        el.textContent = v;
      } else {
        el.setAttribute(k, v);
      }
    });
    this.svg.appendChild(el);
    return el;
  }
}
