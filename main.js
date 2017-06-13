'use strict';

var game = {
  gameContainers: [],
  games: [],
  lastLoopTime: undefined,
  state: {},
  init: function() {
    console.log('init');
    game.initGameContainers()
  },
  initGameContainers: function() {
    var i;
    var c;
    var col;
    var row;
    var color;
    for (i = 0; i < 9; i++) {
      c = document.getElementById('game_container_' + i);
      game.gameContainers[i] = c;
      game.games[i] = new Prestige(c, 'game' + i);
      col = i % 3;
      row = Math.floor(i / 3);
      c.style.left = col * 33.3 + '%';
      c.style.top = row * 33.3 + '%';
      color = 'hsl(' + (360 * i / 9) + ', 66%, 66%)';
      c.style.backgroundColor = color;
      c.onclick = ((j) => function(e) {game.selectGame(e,j);})(i);
    }
    var closeButtons = document.getElementsByClassName('button_close');
    var button;
    for (i = 0; i < closeButtons.length; i++) {
      button = closeButtons.item(i);
      button.onclick = (e) => game.selectGame(e,-1);
    }

    game.load();

    setInterval(game.loop, 1000);
    setInterval(game.save, 10000);
  },
  selectGame: function(e,gameNum) {
    var i;
    var c;
    for (i = 0; i < 9; i++) {
      c = game.gameContainers[i];
      if (i == gameNum) {
        c.style.transform = 'scale(1.0, 1.0)';
        c.style.zIndex = 10;
        c.style.left = 0;
        c.style.top = 0;
      } else {
        c.style.transform = 'scale(0.333, 0.333)';
        c.style.zIndex = 0;
        c.style.left = (i % 3) * 33.3 + '%';
        c.style.top = Math.floor(i / 3) * 33.3 + '%';
      }
    }
    if (gameNum === -1) {
      e.stopPropagation();
    }
  },
  loop: function() {
    var deltaTime;
    var timestamp = Date.now();
    if (game.lastLoopTime !== undefined) {
      deltaTime = timestamp - game.lastLoopTime;
      game.games.forEach(g => {
        g.update(deltaTime / 1000);
        g.draw();
      });
    }

    game.lastLoopTime = timestamp;
  },
  save: function() {
    var gameSaves = [];
    var i;
    for (i = 0; i < 9; i++) {
      gameSaves[i] = game.games[i].save();
    }
    game.state.gameSaves = gameSaves;
    localStorage.setItem('prestige_squared', JSON.stringify(game.state));
  },
  load: function() {
    var saveString = localStorage.getItem('prestige_squared');
    var i;
    if (saveString !== null) {
      game.state = JSON.parse(saveString);
      for (i = 0; i < 9; i++) {
        game.games[i].load(game.state.gameSaves[i]);
      }
    }
  }
};

game.init();
