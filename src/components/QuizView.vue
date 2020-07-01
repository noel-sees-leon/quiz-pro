<template>
  <div class="container">
    <div v-if="!loading">
      <p>Current score: {{currentScore}}</p>
      <div class="box">
        <p>
          <strong>Q:</strong>
          {{currentQuestion.question}}
        </p>
        <p>
          <strong>Category:</strong>
          {{currentQuestion.category}}
        </p>
        <button
          class="button is-fullwidth"
          v-for="answer in currentQuestion.answers"
          :key="answer"
          @click="answerQuestion(answer)"
        >{{answer}}</button>
      </div>
      <div
        class="box"
        v-for="answer in givenAnswers.slice().reverse()"
        :key="answer"
        :class="{'has-background-danger': !answer.isCorrect, 'has-background-success': answer.isCorrect}"
      >
        <div class="media">
          <figure class="media-left">
            <span class="icon">
              <i class="fas fa-check" v-if="answer.isCorrect"></i>
              <i class="fas fa-times" v-else></i>
            </span>
          </figure>
        </div>
        <div class="media-content">
          <p>{{answer.question}}</p>
          <p>Your answer: {{answer.answer}}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Still loading.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizView",
  data: () => {
    return {
      currentQuestion: null,
      loading: true,
      currentIndex: 0,
      currentScore: 0,
      givenAnswers: []
    };
  },
  methods: {
    resetQuiz() {
      this.currentQuestion = null;
      this.givenAnswers = [];
      this.currentIndex = 0;
      this.currentScore = 0;
      this.loading = false;
    },
    startQuiz() {
      this.currentQuestion = this.$store.getters.obfuscatedQuestion(
        this.currentIndex
      );
    },
    endQuiz() {
      this.$store.dispatch("UPDATE_QUIZ_STATE");
    },
    answerQuestion(answer) {
      /* Constructs answer object to display to user */
      var newAnswer = {
        question: this.currentQuestion.question,
        answer: answer
      };

      if (this.$store.getters.answerResult(this.currentIndex, answer)) {
        this.currentScore++;
        newAnswer.isCorrect = true;
      } else {
        newAnswer.isCorrect = false;
      }

      this.givenAnswers.push(newAnswer);

      this.currentIndex++;

      if (this.currentIndex == this.questionCount) {
        this.endQuiz();
      } else {
        this.currentQuestion = this.$store.getters.obfuscatedQuestion(
          this.currentIndex
        );
      }
    }
  },
  computed: {
    isQuiz() {
      return this.$store.state.isQuiz;
    },
    questionCount() {
      return this.$store.getters.questionCount;
    }
  },
  watch: {
    isQuiz(value) {
      if (value == true) {
        this.resetQuiz();
        this.startQuiz();
      }
    }
  }
};
</script>

<style scoped>
button {
  margin: 2em 0em 2em 0em;
}
.container {
  margin: 2em 0em 2em 0em;
}
</style>