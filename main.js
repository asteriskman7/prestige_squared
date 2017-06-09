'use strict';

var game = {
  gameContainers: [],
  games: [],
  lastLoopTime: undefined,
  init: function() {
    console.log('init');
    game.initGameContainers()
  },
  initGameContainers: function() {
    var i;
    var c;
    for (i = 0; i < 9; i++) {
      c = document.getElementById('game_container_' + i);
      game.gameContainers[i] = c;
      game.games[i] = new Prestige(c, 'game' + i);
      c.style.left = (i % 3) * 33.3 + '%';
      c.style.top = Math.floor(i / 3) * 33.3 + '%';
      c.style.background = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'pink', 'teal'][i];
      c.onclick = ((j) => function(e) {game.selectGame(e,j);})(i);

      //c.innerHTML = '<button type="button" class="button_close">Close</button>';
    }
    var closeButtons = document.getElementsByClassName('button_close');
    var button;
    for (i = 0; i < closeButtons.length; i++) {
      button = closeButtons.item(i);
      button.onclick = (e) => game.selectGame(e,-1);
    }
    window.requestAnimationFrame(game.loop);
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
  loop: function(timestamp) {
    var deltaTime;
    if (game.lastLoopTime !== undefined) {
      deltaTime = timestamp - game.lastLoopTime;
      game.games.forEach(g => {
        g.update(deltaTime / 1000);
        g.draw();
      });
    }

    game.lastLoopTime = timestamp;
    window.requestAnimationFrame(game.loop); 
  }
};

game.init();
