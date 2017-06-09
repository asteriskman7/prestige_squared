'use strict';

class Prestige {
  constructor(topDiv, name) {
    var i;
    var b;
    this.name = name;
    this.topDiv = topDiv
    this.coins = 0;
    this.levels = this.getLevelInfo();
    this.cps = this.getCps();

    this.topDiv.innerHTML = this.genCloseButton() + this.genHeader() + this.genLevels();
    this.coinsDiv = document.getElementById(this.name + '_coins');
    this.cpsDiv = document.getElementById(this.name + '_cps');

    for (i = 0; i < this.levels.length; i++) {
      b = document.getElementById(this.name + '_activate_' + i);  
      b.onclick = ((j,obj) => function() {obj.buy.bind(obj)(j);})(i,this);
    }

    this.draw();
  }
  getLevelInfo() {
    return [
      {name: 'Nanoprestige',     requirement: (level) => Math.floor(Math.pow(1.5, level)*10), effect: (level) => level+1, count: 0},
      {name: 'Microprestige',    requirement: (level) => Math.pow(2, level+1),                effect: (level) => level+1, count: 0},
      {name: 'Miniprestige',     requirement: (level) => Math.pow(3, level+1),                effect: (level) => level+1, count: 0}, 
      {name: 'Small Prestige',   requirement: (level) => Math.pow(4, level+1),                effect: (level) => level+1, count: 0}, 
      {name: 'Partial Prestige', requirement: (level) => Math.pow(5, level+1),                effect: (level) => level+1, count: 0}, 
      {name: 'Full Prestige',    requirement: (level) => Math.pow(6, level+1),                effect: (level) => level+1, count: 0}, 
      {name: 'Multiprestige',    requirement: (level) => Math.pow(7, level+1),                effect: (level) => level+1, count: 0}, 
      {name: 'Hyperprestige',    requirement: (level) => Math.pow(8, level+1),                effect: (level) => level+1, count: 0}, 
      {name: 'Ultraprestige',    requirement: (level) => Math.pow(9, level+1),                effect: (level) => level+1, count: 0}, 
      {name: 'Final Prestige',   requirement: (level) => Math.pow(10, level+1),               effect: (level) => level+1, count: 0}, 
    ];
  }
  static intToTier(i) {
    return ['coins', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i];
  }
  genCloseButton() {
    return '<button type="button" class="button_close">X</button>';
  }
  genHeader() {  
    var html = '<div>';
    html += '<div class="coins"><span id="'+ this.name + '_coins"></span> coins</div>'
    html += '<div class="cps"><span id="' + this.name + '_cps"></span> coins/second</div>';
    html += '</div>';
    return html;
  }
  genLevels() {
    var html = '<div><table><tr>';
    ['Tier', 'Name', 'Requirement', 'Amount', 'Effect', ''].forEach((h) => {
      html += '<th>' + h + '</th>';
    });
    html += '</tr>';
    var i = 0;
    this.levels.forEach((l) => {
      html += '<tr>';  
      html += '<td>' + Prestige.intToTier(i+1) + '</td>';
      html += '<td>' + l.name + '</td>';
      html += '<td id="' + this.name + '_requirement_' + i +'">' + l.requirement(l.count) + 'x Tier ' + Prestige.intToTier(i) + '</td>';
      html += '<td id="' + this.name + '_count_' + i + '">' + l.count + '</td>';
      html += '<td id="' + this.name + '_effect_' + i +'">x' + l.effect(l.count) + '</td>';
      html += '<td><button type="button" id="' + this.name + '_activate_' + i + '">Activate</button></td>';
      html += '</tr>';
      i += 1;
    });
    html += '</table></div>';
    return html;
  }
  getCps() {
    var cps = 1;
    this.levels.forEach((l) => {
      cps *= l.effect(l.count);
    });
    return cps;
  }
  buy(level) {
    var l = this.levels[level];
    var i;
    if (this.canBuy(level)) {
      //this.coins -= l.requirement(l.count);
      this.coins = 0;
      for (i = 0; i < level; i++) {
        this.levels[i].count = 0;
      }
      l.count += 1;
    }
  }
  canBuy(level) {
    var l = this.levels[level];
    if (level == 0) {
      return l.requirement(l.count) <= this.coins;
    } else {
      return l.requirement(l.count) <= this.levels[level-1].count;
    }
  }
  update(deltaTime) {
    this.cps = this.getCps();
    this.coins += this.cps * deltaTime;
  }
  draw() {
    this.coinsDiv.innerHTML = Math.floor(this.coins);
    this.cpsDiv.innerHTML = this.cps;
    var i = 0;
    this.levels.forEach((l) => {
      document.getElementById(this.name + '_requirement_' + i).innerHTML = l.requirement(l.count) + 'x Tier ' + Prestige.intToTier(i);      
      document.getElementById(this.name + '_count_' + i).innerHTML = l.count;
      document.getElementById(this.name + '_effect_' + i).innerHTML = 'x' + l.effect(l.count);
      document.getElementById(this.name + '_activate_' + i).disabled = !this.canBuy(i);
      i += 1;
    });
  }
}
