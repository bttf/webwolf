import Ember from 'ember';

export default Ember.Controller.extend({
  gameId: '',
  username: '',
  isRegistered: false,
  actions: {
    setRegistered(username) {
      this.set('username', username);
      this.set('isRegistered', true);
    },
    transitionToGame(gameId) {
      this.transitionTo('game', gameId);
    },
  },
});
