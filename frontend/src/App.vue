
<template>
    <div class="app-container" :class="theme">
      <component :is="view" />
    </div>
</template>

<script>
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Like from './views/Like.vue'
import axios from 'axios';

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      myurl: window.location.hash,
      user: null,
      theme: 'light',
    }
  },
  computed: {
    view() {
      let path = this.myurl
      if (path.includes('?')) {
        path = path.split('?')[0];
      }
      path = path.slice(1) || '/';

      if (path === '/') {
        return Home;
      }
      if (path === '/login') {
        return Login;
      }
      if (path === '/register') {
        return Register;
      }
      if (path === '/like') {
        return Like;
      }


      return Login;
    },
    getUser() {
      const userStr = sessionStorage.getItem('user');
      console.log('getUser', userStr);
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    }
  },
  mounted() {
    this.user = this.getUser;
    if (!this.user) {
      window.location.hash = '#/login';
    }
    window.addEventListener('hashchange', this.handleHashChange);
  },
  beforeUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  },
  methods: {
    handleHashChange() {
      this.myurl = window.location.hash;
      this.user = this.getUser;
    }
  }
}
</script>
