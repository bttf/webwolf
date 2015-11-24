import Ember from 'ember';

export default Ember.Component.extend({
  gameId: '',
  players: Ember.A([]),
  isModerator: false,
  moderatorSelected: Ember.computed('players.[]', function() {
    return this.get('players').any((player) => {
      return player.isModerator;
    });
  }),
  minimumPlayersMet: Ember.computed('players.[]', function() {
    return this.get('players.length') >= 5;
  }),
  canStartGame: Ember.computed('minimumPlayersMet', 'isModerator', function() {
    return this.get('minimumPlayersMet') && this.get('isModerator');
  }),

  willInsertElement() {
    this.get('io').on('gameCreated', (gameId) => {
      this.sendAction('goToGame', gameId);
    });

    this.get('io').on('gameUpdated', (players) => {
      console.log('players payload', players);
      this.get('players').clear();
      players.forEach((player) => {
        this.get('players').addObject(player);
      });
    });

    this.get('io').on('moderatorAssigned', () => {
      this.set('isModerator', true);
    });
  },

  onRegistered: Ember.observer('isRegistered', function() {
    if (this.get('gameId')) {
      this.get('io').emit('joinGame', { gameId: this.get('gameId'), user: this.get('user') });
    }
  }),

  actions: {
    startNewGame(user) {
      this.get('io').emit('newGame', user);
    },

    assumeModeratorRole() {
      this.get('io').emit('assumeModerator');
    },
  },
});
