import Ember from 'ember';

export default Ember.Controller.extend({
  gameId: '',
  isRegistered: false,
  actions: {
    setRegistered(user) {
      this.set('user', user);
      this.set('isRegistered', true);
    },
    transitionToGame(gameId) {
      this.transitionTo('game', gameId);
    },
  },
});
