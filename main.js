'use strict';

var game = {
  gameContainers: [],
  games: [],
  state: {},
  eMeta: undefined,
  eTotal: undefined,
  eBuy: undefined,
  lastSpeaker: undefined,
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
    var gameVersions = [];
    gameVersions[0] = PrestigeOne;
    gameVersions[1] = PrestigeOneOffline;
    gameVersions[2] = PrestigeOneNoReset;
    gameVersions[3] = Prestige;
    gameVersions[4] = Prestige;
    gameVersions[5] = Prestige;
    gameVersions[6] = Prestige;
    gameVersions[7] = Prestige;
    gameVersions[8] = Prestige;
    for (i = 0; i < 9; i++) {
      c = document.getElementById('game_container_' + i);
      game.gameContainers[i] = c;
      game.games[i] = new gameVersions[i](c, 'game' + i);
      col = i % 3;
      row = Math.floor(i / 3);
      c.style.left = col * 33.3 + '%';
      c.style.top = row * 33.3 + '%';
      color = 'hsl(' + (360 * i / 9) + ', 66%, 66%)';
      c.style.backgroundColor = color;
      c.onclick = ((j) => function(e) {game.selectGame(e,j);})(i);
    }
    game.games[0].activate();
    var closeButtons = document.getElementsByClassName('button_close');
    var button;
    for (i = 0; i < closeButtons.length; i++) {
      button = closeButtons.item(i);
      button.onclick = (e) => game.selectGame(e,-1);
    }

    game.eMeta = document.getElementById('span_metacoins');
    game.eTotal = document.getElementById('span_total_points');
    game.eBuy = document.getElementById('button_metacoin_buy');

    game.load();

    game.offlineGains();

    setInterval(game.loop, 1000);
    //setInterval(game.save, 10000);
  },
  selectGame: function(e,gameNum) {
    var i;
    var c;
    for (i = 0; i < 9; i++) {
      c = game.gameContainers[i];
      if (i == gameNum && game.games[i].active) {
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
    if (game.state.lastLoopTime !== undefined) {
      deltaTime = timestamp - game.state.lastLoopTime;
    } else {
      deltaTime = 0;
    }
    game.games.forEach(g => {
      g.update(deltaTime / 1000);
      g.draw();
    });


    game.eMeta.innerText = game.state.metacoins;
    game.eTotal.innerText = game.getTotal();
    game.eBuy.innerText = 'Buy for ? points';

    game.save();

    game.state.lastLoopTime = timestamp;
  },
  getTotal: function() {
    var total = 0;
    game.games.forEach(g => {
      total += Math.floor(g.coins);
    });
    return total;
  },
  offlineGains: function() {
    var offlineTime;
    if (game.state.lastLoopTime !== undefined) {
      offlineTime = Date.now() - game.state.lastLoopTime;
      game.games.forEach(g => {
        g.offlineGains(offlineTime / 1000);
      });
    }
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
    } else {
      game.state = {};
      game.state.metacoins = 0;
    }
  },
  reset: function() {
    localStorage.removeItem('prestige_squared');
    location.reload();
  },
  showOverlay: function() {
    var fc = document.getElementById('full_container');
    fc.style.filter = 'blur(5px)';
    var o = document.getElementById('overlay');
    o.style.display = 'flex';
  },
  hideOverlay: function() {
    var fc = document.getElementById('full_container');
    fc.style.filter = '';
    var o = document.getElementById('overlay');
    o.style.display = 'none';
  },
  addChatMsg: function(name, msg) {
    var otf = document.getElementById('overlay_text_flow');
    var speakerAvatars = {asterisk_man: 'one_40x40.png', uni: 'two_40x40.png'};
    var speakerColors = {asterisk_man: 'yellow', uni: 'purple'};
    var newHTML = '<div>';
    var newSpeaker = game.lastSpeaker !== name;
    game.lastSpeaker = name;
    if (newSpeaker) {
      newHTML += '<div style="color: ' + speakerColors[name] + ';" class="text_name_line"><img src="' + speakerAvatars[name] + '">' + name + '</div>';
    }
    newHTML += '<div class="text_text_box">' + msg + '</div></div>';
    otf.innerHTML += newHTML;
  },
  clearChatMsg: function() {
    var otf = document.getElementById('overlay_text_flow');
    otf.innerHTML = '';
  }

};

game.init();

/*
setTimeout(() => {
  game.showOverlay();
  game.addChatMsg('asterisk_man', 'Hello');
  game.addChatMsg('uni', 'Good morning');
  game.addChatMsg('asterisk_man', 'Welcome to the game');
  game.addChatMsg('asterisk_man', 'I hope you enjoy this game. It takes a long time to write and this line should hopefully wrap.');
  game.addChatMsg('uni', 'It does..I hope.');
}, 1000)
*/
