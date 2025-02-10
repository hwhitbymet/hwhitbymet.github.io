---
layout: post
title: "My First Interactive Post"
date: 2025-02-10
---

Here's some regular markdown content.

<div class="interactive-demo" id="demo1">
  <button onclick="incrementCounter('demo1')">Click me!</button>
  <span class="counter">0</span> clicks
</div>

<script>
function incrementCounter(id) {
  const counter = document.querySelector(`#${id} .counter`);
  counter.textContent = parseInt(counter.textContent) + 1;
}
</script>