import Ember from 'ember';

export default Ember.Component.extend({
  username: '',
  isRegistered: false,
  willInsertElement() {
    this.get('io').on('isRegistered', () => {
      this.set('isRegistered', true);
    });
  },
  actions: {
    register(name) {
      this.get('io').emit('register', name);
    },
  },
});
