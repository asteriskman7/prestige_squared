'use strict';

var game = {
  gameContainers: [],
  games: [],
  state: {},
  eMeta: undefined,
  eTotal: undefined,
  eBuy: undefined,
  lastSpeaker: undefined,
  chatQueue: [],
  chatCloseCallback: undefined,
  init: function() {
    console.log('init');
    document.getElementById('button_close_chat').onclick = game.closeChat;
    game.initGameContainers();
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
    game.games[6].activate();
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

    game.setStage(game.state.stage);

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
    if ((gameNum === -1) && (e !== undefined)) {
      e.stopPropagation();
    }
  },
  loop: function() {
    var deltaTime;
    var timestamp = Date.now();

    game.handleChatQueue();

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
      game.state.stage = 'init';
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
    document.getElementById('button_close_chat').style.display = 'none';
  },
  hideOverlay: function() {
    var fc = document.getElementById('full_container');
    fc.style.filter = '';
    var o = document.getElementById('overlay');
    o.style.display = 'none';
    game.clearChatMsg();
  },
  addChatMsg: function(name, msg) {
    game.showOverlay();
    var otf = document.getElementById('overlay_text_flow');
    var speakerAvatars = {asterisk: 'asterisk_256.png', uni: 'uni_256.png', makiki: 'makiki_256.png'};
    var speakerNames = {asterisk: 'asterisk_man&#x1f419;', uni: 'Uni', makiki: 'Makiki&#x1f411; (sheep cheese is tasty)' }
    var speakerColors = {asterisk: '#ffec0b', uni: '#b870c2', makiki: '#010101'};
    var newHTML = '<div>';
    var newSpeaker = game.lastSpeaker !== name;
    game.lastSpeaker = name;
    if (newSpeaker) {
      newHTML += '<div style="color: ' + speakerColors[name] + ';" class="text_name_line"><img src="' +
                 speakerAvatars[name] + '" class="img_avatar">' + speakerNames[name] + '</div>';
    }
    newHTML += '<div class="text_text_box">' + msg + '</div></div>';
    otf.innerHTML += newHTML;
  },
  delayChat: function(msgList, callback) {
    //msgList is [{delay:, name:, msg:},...], delays are relative to the call time but must be increasing
    var lastTime = Date.now();

    msgList.forEach((v) => {
      game.chatQueue.push({name: v.n, msg: v.m, time: lastTime + v.d});
      lastTime += v.d;
    });
    game.chatCloseCallback = callback;
  },
  handleChatQueue: function() {
    var now = Date.now();
    var chat;
    while ((game.chatQueue.length > 0) && (game.chatQueue[0].time <= now)) {
      chat = game.chatQueue.shift();
      game.addChatMsg(chat.name, chat.msg);
      if (game.chatQueue.length === 0) {
        document.getElementById('button_close_chat').style.display = 'block';
      }
    }
  },
  clearChatMsg: function() {
    var otf = document.getElementById('overlay_text_flow');
    otf.innerHTML = '';
  },
  closeChat: function() {
    game.hideOverlay();
    if (game.chatCloseCallback !== undefined) {
      game.chatCloseCallback();
    }
  },
  setStage: function(stage) {
    game.state.stage = stage;
    switch (stage) {
      case 'init':
        document.getElementById('game_container_6').style.display = 'block';
        document.getElementById('button_close_game6').style.display = 'none';
        if (stage === 'init') {
          game.selectGame(undefined, 6);
          game.delayChat([
            {d: 2000, n: 'makiki', m: 'Is this just a reskin of prestige?'},
            {d: 2000, n: 'uni', m: 'I hope so. Best game ever'},
            {d: 2000, n: 'asterisk', m: "It's not a reskin. It's got more content."}
          ], () => {game.setStage('expand')});
          break;
        }
      case 'expand':
        game.selectGame(undefined, -1);
        for (var i = 0; i < 9; i++) {
          document.getElementById('game_container_' + i).style.display = 'block';
        }
        if (stage === 'expand') {
          break;
        }
    }
  }

};

game.init();

/*
setTimeout(() => {
  game.showOverlay();
  game.addChatMsg('asterisk', 'Hello');
  game.addChatMsg('uni', 'Good morning');
  game.addChatMsg('asterisk', 'Welcome to the game');
  game.addChatMsg('asterisk', 'I hope you enjoy this game. It takes a long time to write and this line should hopefully wrap.');
  game.addChatMsg('uni', 'It does..I hope.');
  game.addChatMsg('makiki', 'hello everyone.');
}, 1000)
*/
