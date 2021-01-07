<template>
  <v-app>
    <v-app-bar app dark color="primary">
      <div class="d-flex align-center">
        <span>Test App</span>
      </div>
    </v-app-bar>
    <v-main>
      <List/>
    </v-main>
  </v-app>
</template>

<script>
import List from './components/List';

export default {
  components: {
    List
  }
};
</script>
