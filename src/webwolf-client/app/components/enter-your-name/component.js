import Ember from 'ember';

export default Ember.Component.extend({
  username: '',
  isRegistered: false,
  willInsertElement() {
    this.get('io').on('isRegistered', (name) => {
      this.set('isRegistered', true);
      this.sendAction('registrationSuccess', name);
    });
  },
  actions: {
    register(name) {
      this.get('io').emit('register', name);
    },
  },
});
