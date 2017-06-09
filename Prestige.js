'use strict';

class Prestige {
  constructor(topDiv, name) {
    this.name = name;
    this.topDiv = topDiv
    this.score = 0;

    this.topDiv.innerHTML = this.genCloseButton() + this.genHeader() + this.genLevels();
    this.scoreDiv = document.getElementById(this.name + '_score');
    this.draw();
  }
  genCloseButton() {
    return '<button type="button" class="button_close">X</button>';
  }
  genHeader() {  
    return '<div>HEADER</div><div id="'+ this.name + '_score"></div>';
  }
  genLevels() {
    return '<div>LEVELS</div>';
  }
  update() {
    this.score += 1;
  }
  draw() {
    this.scoreDiv.innerHTML = this.score;
  }
}
