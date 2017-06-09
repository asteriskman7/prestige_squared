'use strict';

class Prestige {
  constructor(topDiv, name) {
    this.name = name;
    this.topDiv = topDiv
    this.coins = 0;
    this.cps = 1;

    this.topDiv.innerHTML = this.genCloseButton() + this.genHeader() + this.genLevels();
    this.coinsDiv = document.getElementById(this.name + '_coins');
    this.cpsDiv = document.getElementById(this.name + '_cps');
    this.draw();
  }
  genCloseButton() {
    return '<button type="button" class="button_close">X</button>';
  }
  genHeader() {  
    var html = '<div><div><span id="'+ this.name + '_coins"></span> coins</div><div>'
    html += '<span id="' + this.name + '_cps"></span> coins/second</div></div>';
    return html;
  }
  genLevels() {
    return '<div>LEVELS</div>';
  }
  update(deltaTime) {
    this.coins += this.cps * deltaTime;
  }
  draw() {
    this.coinsDiv.innerHTML = Math.floor(this.coins);
    this.cpsDiv.innerHTML = this.cps;
  }
}
