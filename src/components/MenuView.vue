<template>
  <div class="is-centered">
    <p class="has-text-grey-light">Session token: {{sessionToken}}</p>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">QuizMaster Super Pro</h1>
        </div>
      </div>
    </section>
    <div>
      <p>Configure your quiz options here!</p>
      <!-- category select -->
      <div class="field">
        <label class="label">Category</label>
        <div class="control">
          <div class="select">
            <select v-model="category">
              <option value="any">Any</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >{{category.name}}</option>
            </select>
          </div>
        </div>
      </div>
      <!-- difficulty select -->
      <div class="field">
        <label class="label">Difficulty</label>
        <div class="control">
          <div class="select">
            <select v-model="difficulty">
              <option value="any">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
      <!-- type request -->
      <div class="field">
        <label class="label">Question Types</label>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="isMultipleChoice" />
              Multiple Choice
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="isTrueFalse" />
              True/False
            </label>
          </div>
        </div>
      </div>
    </div>
    <button
      class="button"
      @click="runQuiz"
      :disabled="!isValidQuizConfig"
      :class="{'is-loading': loading}"
    >Play Quiz</button>
    <div class="modal" :class="{'is-active': errorAlert}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Error</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">{{errorText}}</section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="errorAlert = false">Save changes</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuView",
  data: function() {
    return {
      url: "https://opentdb.com/api.php?amount=10&encode=base64",
      isValidQuizConfig: false,
      category: null,
      difficulty: null,
      isMultipleChoice: false,
      isTrueFalse: false,
      loading: false,
      errorAlert: false,
      errorText: null
    };
  },
  computed: {
    sessionToken() {
      return this.$store.state.sessionToken;
    },
    categories() {
      return this.$store.state.categories;
    },
    isQuiz() {
      return this.$store.state.isQuiz;
    }
  },
  methods: {
    runQuiz() {
      this.processConfig();
      this.loading = true;
      fetch(this.url + "&token=" + this.sessionToken)
        .then(response => response.json())
        .then(data => {
          switch (data.response_code) {
            case 0:
              this.$store.dispatch("UPDATE_QUESTIONS", data.results);
              this.$store.dispatch("UPDATE_QUIZ_STATE");
              break;
            case 1:
              this.errorText =
                "An error occured. Contact developer with following error code: NO_RESULTS_ERROR";
              this.errorAlert = true;
              break;
            case 2:
              this.errorText =
                "An error occured. Contact developer with following error code: API_PARAMETER_ERROR";
              this.errorAlert = true;
              break;
            case 3:
              /* Fetches a new token, since the current one cannot be found. */
              fetch("https://opentdb.com/api_category.php")
                .then(response => response.json())
                .then(data => {
                  this.$store.dispatch(
                    "UPDATE_CATEGORIES",
                    data.trivia_categories
                  );
                });
              this.runQuiz();
              break;
            case 4:
              /* Alerts the user that there are no more questions for the specific query, and they should try again. */
              this.errorText =
                "All the questions for your chosen settings have been asked already. Try a new setting or refresh your questions.";
              this.errorAlert = true;
              break;
          }
        });
    },
    processConfig() {
      /* Run preprocessing on configuration form to ensure that the url meets the conditions required. */
      if (this.category != "any") {
        this.url += "&category=" + this.category;
      }
      if (this.difficulty != "any") {
        this.url += "&difficulty=" + this.difficulty;
      }
      if (this.isTrueFalse && !this.isMultipleChoice) {
        this.url += "&type=boolean";
      }
      if (!this.isTrueFalse && this.isMultipleChoice) {
        this.url += "&type=multiple";
      }
    }
  },
  watch: {
    category(value) {
      if (value == null) {
        this.isValidQuizConfig = false;
      } else {
        if (
          this.category != null &&
          this.difficulty != null &&
          (this.isTrueFalse || this.isMultipleChoice)
        ) {
          this.isValidQuizConfig = true;
        }
      }
    },
    difficulty(value) {
      if (value == null) {
        this.isValidQuizConfig = false;
      } else {
        if (
          this.category != null &&
          this.difficulty != null &&
          (this.isTrueFalse || this.isMultipleChoice)
        ) {
          this.isValidQuizConfig = true;
        }
      }
    },
    isTrueFalse() {
      if (
        this.category != null &&
        this.difficulty != null &&
        (this.isTrueFalse || this.isMultipleChoice)
      ) {
        this.isValidQuizConfig = true;
      } else {
        this.isValidQuizConfig = false;
      }
    },
    isMultipleChoice() {
      if (
        this.category != null &&
        this.difficulty != null &&
        (this.isTrueFalse || this.isMultipleChoice)
      ) {
        this.isValidQuizConfig = true;
      } else {
        this.isValidQuizConfig = false;
      }
    },
    isQuiz(value) {
      if (value == false) {
        this.loading = false;
      }
    }
  }
};
</script>