<template>
  <div id="app">
    <div class="container menu">
      <div v-show="isQuiz">
        <QuizView />
      </div>
      <div v-show="!isQuiz">
        <MenuView />
      </div>
      <div v-if="tokenError">
        <ErrorView />
      </div>
    </div>
  </div>
</template>

<script>
import MenuView from "./components/MenuView";
import QuizView from "./components/QuizView";

export default {
  name: "App",
  components: {
    MenuView,
    QuizView
  },
  data: () => {
    return {
      response_code: null,
      response_message: null,
      tokenError: false
    };
  },
  computed: {
    isQuiz() {
      return this.$store.state.isQuiz;
    }
  },
  mounted() {
    /* Retreives current categories (to ensure that the listed categories are correct on the menu) */
    fetch("https://opentdb.com/api_category.php")
      .then(response => response.json())
      .then(data => {
        this.$store.dispatch("UPDATE_CATEGORIES", data.trivia_categories);
      });
    /* Retreives session token (to ensure that questions are not repeated) */
    fetch("https://opentdb.com/api_token.php?command=request")
      .then(response => response.json())
      .then(data => {
        if (data.response_code == 0) {
          this.$store.dispatch("UPDATE_SESSION_TOKEN", data.token);
        } else {
          // somehow alert users of error and therefore deny them access to the app
        }
      });
  }
};
</script>

<style scoped>
.menu {
  margin: auto;
  max-width: 600px;
}
</style>
