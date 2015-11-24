import Ember from 'ember';

export default Ember.Component.extend({
  username: '',
  willInsertElement() {
    this.get('io').on('isRegistered', (user) => {
      this.sendAction('registrationSuccess', user);
    });
  },
  actions: {
    register(name) {
      this.get('io').emit('register', name);
    },
  },
});
