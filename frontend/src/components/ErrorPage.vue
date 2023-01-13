<template>
  <div class="all">
    <h1>Error</h1>
    <p>{{ theMessage }}</p>

    <p>
      Already have an account?
      <router-link to="/login">Login here</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  props: {
    theMessage: String,
    showLoginHere: false,
  },
};
</script>
