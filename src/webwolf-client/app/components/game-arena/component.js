import Ember from 'ember';

export default Ember.Component.extend({
  gameId: '',
  username: '',
  players: Ember.A([]),
  moderatorSelected: Ember.computed('players.@each', function() {
    console.log('is this getting fired or what');
    return this.get('players').any((player) => {
      console.log('player.isModerator', player.isModerator);
      return player.isModerator;
    });
  }),

  willInsertElement() {
    this.get('io').on('gameCreated', (gameId) => {
      this.sendAction('goToGame', gameId);
    });

    this.get('io').on('gameJoined', (players) => {
      console.log('players payload', players);
      this.get('players').clear();
      players.forEach((player) => {
        this.get('players').addObject(player);
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

    assumeModeratorRole() {
      this.get('io').emit('assumeModerator');
    },
  },
});
