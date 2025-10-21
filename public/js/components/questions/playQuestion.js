import { QuestionElement } from './question.js';
import JSConfetti from 'js-confetti';
const jsConfetti = new JSConfetti();

const questionTemplate = document.createElement('template');
questionTemplate.innerHTML = `
<article class="question container text-center text-light d-none"
  role="region"
  aria-label="Trivia Question"
  tabindex="-1">

  <header class="mb-5">
    <h2 class="question-title mb-3 fs-1 fw-semibold text-white" id="questions-text"></h2>
    <p class="text-white mb-0 d-none" id="question-instructions">
      Select one answer below. Use Tab to move between options.
    </p>
  </header>

  <section class="choices d-flex flex-column flex-wrap"
      role="radiogroup"
      aria-labelledby="question-text"
      aria-describedby="question-instructions">

  </section>

  <p class="confirm d-none">Are you sure? Click again to confirm</p>

  <button class="btn btn-next border shadow-lg d-none" disabled>Next Question</button>

</article>
`;

export class PlayQuestionElement extends QuestionElement {
  static observedAttributes = ['data-correct-choice', ...QuestionElement.observedAttributes];

  constructor() {
    super();

    this.shadow.append(questionTemplate.content.cloneNode(true));

    this.boundedHandleClickQuestion = this.handleClickQuestion.bind(this);
    this.boundedHandleClickNextQuestion = this.handleClickNextQuestion.bind(this);

    this.questionElement = this.shadow.querySelector('.question');
    this.questionTitleElement = this.shadow.querySelector('.question-title');
    this.choicesElement = this.shadow.querySelector('.choices');
    this.confirmElement = this.shadow.querySelector('.confirm');
    this.nextButtonElement = this.shadow.querySelector('.btn-next');
    this.answered = false;
    this.hasNext = false;
    this.choiceButtons = [];
  }

  get selectedChoice() {
    return this.dataset.selectedChoice;
  }

  set selectedChoice(value) {
    this.dataset.selectedChoice = value;
  }

  get correctChoice() {
    return this.dataset.correctChoice;
  }

  set correctChoice(value) {
    this.dataset.correctChoice = value;
  }

  resetQuestion() {
    this.confirmElement.classList.toggle('d-none', true);
    this.nextButtonElement.classList.toggle('d-none', true);
    this.questionElement.classList.remove('d-none');
    this.questionElement.classList.add('fade-in');
    this.updateQuestion();
    this.answered = false;
    this.questionElement.addEventListener(
      'animationend',
      () => {
        this.updateChoices();
      },
      {
        once: true,
      },
    );
  }

  getChoiceByLetter(letter) {
    return this.shadow.querySelector(`[data-choice="${letter}"`);
  }

  answerQuestion() {
    this.choiceButtons.forEach((button) => {
      button.disabled = true;
    });

    this.makeRPCCall(
      'players.answer',
      {
        gameId: this.gameId,
        questionId: this.questionId,
        answer: this.selectedChoice,
        clientAnsweredAt: Math.floor(Date.now() / 1000),
      },
    );
  }

  handleClickQuestion(event) {
    event.preventDefault();
    const eventSelectedChoice = event.target;
    if (this.selectedChoice === eventSelectedChoice.dataset.choice) {
      this.answerQuestion();
      return;
    }

    this.selectedChoice = eventSelectedChoice.dataset.choice;
    this.confirmElement.classList.remove('d-none');
  }

  handleClickNextQuestion() {
    this.questionElement.classList.add('fade-out');
    this.questionElement.addEventListener(
      'animationend',
      () => {
        this.choicesElement.innerHTML = '';
        this.callNextQuestion();
      },
      {
        once: true,
      },
    );
  }

  updateQuestion() {
    this.updateTitle();
    this.questionElement.classList.remove('fade-out');
    this.questionElement.classList.add('fade-in');
  }

  updateChoices() {
    this.choiceButtons = [];
    this.choicesElement.innerHTML = '';
    this.choicesElement.append(this.createButtonFor('A', this.choiceA));
    this.choicesElement.append(this.createButtonFor('B', this.choiceB));
    this.choicesElement.append(this.createButtonFor('C', this.choiceC));
    this.choicesElement.append(this.createButtonFor('D', this.choiceD));
    if (this.answered) {
      this.confirmElement.classList.toggle('d-none', true);
    }
  }

  updateAfterAnswer() {
    this.answered = true;
    this.getChoiceByLetter(this.correctChoice).classList.toggle('correct', true);
    if (this.selectedChoice !== this.correctChoice) {
      this.getChoiceByLetter(this.selectedChoice).classList.toggle('incorrect', true);
    }

    if (this.answeredCorrectly) {
      jsConfetti.addConfetti();
    }

    this.confirmElement.classList.toggle('d-none', true);

    if (this.hasNext) {
      this.nextButtonElement.classList.remove('d-none');
      this.nextButtonElement.disabled = false;

      requestAnimationFrame(() => this.nextButtonElement.classList.add('show'));
    }
  }

  createButtonFor(letter, choice) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-lg', 'btn-choice', 'shadow-lg');
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', false);

    button.dataset.choice = letter;
    button.textContent = choice;
    button.addEventListener('click', this.boundedHandleClickQuestion);
    this.choiceButtons.push(button);
    return button;
  }

  updateTitle() {
    this.questionTitleElement.textContent = this.question;
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.callNextQuestion();
    this.nextButtonElement.addEventListener('click', this.boundedHandleClickNextQuestion);
  }

  callNextQuestion() {
    this.makeRPCCall('players.next', { gameId: this.gameId });
  }

  onDataLoaded(results, method) {
    console.log(method);
    if (method === 'players.answer') {
      this.correctChoice = results.correctAnswer;
      this.answered = true;
      this.answeredCorrectly = results.answeredCorrectly;
      this.hasNext = results.hasNext;
      this.updateAfterAnswer();
      return;
    }

    super.onDataLoaded(results);
    this.resetQuestion();
  }
}

customElements.define(
  'trivia-question-play',
  PlayQuestionElement,
);
