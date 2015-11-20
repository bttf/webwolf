import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return params.game_id;
  },
  setupController(controller, model) {
    controller.send('setGameId', model);
  },
});
