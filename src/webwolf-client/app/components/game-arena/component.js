import Ember from 'ember';

export default Ember.Component.extend({
  gameId: '',
  username: '',
  players: Ember.A([]),

  willInsertElement() {
    this.get('io').on('gameCreated', (gameId) => {
      this.sendAction('goToGame', gameId);
    });

    this.get('io').on('gameJoined', (players) => {
      this.get('players').clear();
      Object.keys(players).forEach((key) => {
        if(players.hasOwnProperty(key)) {
          this.get('players').addObject(players[key].name);
        }
      });
    });
  },

  onRegistered: Ember.observer('isRegistered', function() {
    if (this.get('gameId')) {
      this.get('io').emit('joinGame', { gameId: this.get('gameId'), username: this.get('username') });
    }
  }),

  actions: {
    startNewGame(username) {
      this.get('io').emit('newGame', username);
    },
  },
});
