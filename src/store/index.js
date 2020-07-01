import Vue from 'vue'
import Vuex from 'vuex'
import { shuffle } from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questions: null,
    isQuiz: false,
    sessionToken: null,
    categories: null
  },
  mutations: {
    update_questions(state, payload) {
      state.questions = payload;
    },
    update_quiz_state(state) {
      state.isQuiz = !state.isQuiz;
    },
    update_session_token(state, payload) {
      state.sessionToken = payload;
    },
    update_categories(state, payload) {
      state.categories = payload;
    }
  },
  actions: {
    UPDATE_QUESTIONS(context, payload) {
      context.commit('update_questions', payload);
    },
    UPDATE_QUIZ_STATE(context) {
      context.commit('update_quiz_state');
    },
    UPDATE_SESSION_TOKEN(context, payload) {
      context.commit('update_session_token', payload);
    },
    UPDATE_CATEGORIES(context, payload) {
      context.commit('update_categories', payload);
    }
  },
  getters: {
    /* Returns count of questions without returning questions themselves */
    questionCount(state) {
      return state.questions.length;
    },
    /* Returns obfuscated queston (i.e. stores question in variable without storing correct answer for user to see outside of vuex) */
    obfuscatedQuestion: (state) => (index) => {
      /* Process answers into array of strings, before shuffling */
      var potentialAnswers = [];

      potentialAnswers.push(Buffer.from(state.questions[index].correct_answer, 'base64'));

      for (var i = 0; i < state.questions[index].incorrect_answers.length; i++) {
        potentialAnswers.push(Buffer.from(state.questions[index].incorrect_answers[i], 'base64'));
      }

      potentialAnswers = shuffle(potentialAnswers);

      /* Create question object and returns it to user */
      var question = {
        category: Buffer.from(state.questions[index].category, 'base64'),
        type: Buffer.from(state.questions[index].type, 'base64'),
        difficulty: Buffer.from(state.questions[index].difficulty, 'base64'),
        question: Buffer.from(state.questions[index].question, 'base64'),
        answers: potentialAnswers
      };

      return question;
    },
    /* Checks to see if answer provided is correct for the question */
    answerResult: (state) => (index, answer) => {
      return (state.questions[index].correct_answer == Buffer.from(answer).toString('base64'));
    }
  }
})
