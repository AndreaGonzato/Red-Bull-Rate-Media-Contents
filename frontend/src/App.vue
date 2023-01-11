<template>
  <TheNavigation v-bind:show-account="this.showAccount"></TheNavigation>

  <div class="container">
    <routerView @message="handleMessage"></routerView>
  </div>
</template>

<script>
import TheNavigation from "./components/TheNavigation.vue";

export default {
  components: {
    TheNavigation 
  },
  data() {
    return {
      showAccount : false
    };
  },
  methods: {
    handleMessage(message){
      this.showAccount = message.showAccount
    }
  }
};
</script>

<style scoped></style>
