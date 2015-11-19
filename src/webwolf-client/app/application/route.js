import Ember from 'ember';

export default Ember.Route.extend({
  io: Ember.inject.service('socket-io'),
  setupController(controller/*, model*/) {
    controller.set('io', this.get('io').socketFor('http://localhost:3000'));
  },
});
