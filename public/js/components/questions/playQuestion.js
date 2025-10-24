import { QuestionElement } from './question.js';
import JSConfetti from 'js-confetti';
import { staggerAnimation } from '../../animation.js';
import { emitEvent } from '../../events.js';

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

  <p class="confirm d-none" aria-live="assertive"></p>

  <button class="btn btn-next border shadow-lg d-none" disabled>Next Question</button>

  <ul class="bonuses list-unstyled">
  </ul>

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
    this.bonusesListElement = this.shadow.querySelector('.bonuses');
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

  updateBonuses(bonuses = []) {
    this.bonusesListElement.classList.remove('fade-out');
    this.bonusesListElement.innerHTML = '';
    bonuses.forEach(({ type, points }) => {
      const bonusesListElement = document.createElement('li');
      bonusesListElement.textContent = `+${points} ${type}`;
      this.bonusesListElement.append(bonusesListElement);
    });
    const bonusesElement = this.bonusesListElement.querySelectorAll('li');
    staggerAnimation('slide-in-right')(bonusesElement);
  }

  resetQuestion() {
    this.confirmElement.classList.toggle('d-none', true);
    this.confirmElement.textContent = '';
    this.nextButtonElement.classList.toggle('d-none', true);
    this.nextButtonElement.disabled = true;
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
    console.log('handle click', eventSelectedChoice);
    if (this.selectedChoice === eventSelectedChoice.dataset.choice) {
      this.answerQuestion();
      return;
    }

    this.selectedChoice = eventSelectedChoice.dataset.choice;
    this.confirmElement.classList.remove('d-none');
    this.confirmElement.textContent = 'Are you sure? Click again to confirm';
  }

  handleClickNextQuestion() {
    this.bonusesListElement.classList.add('fade-out');
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
    this.questionElement.addEventListener(
      'animationend',
      () => {
        this.choicesElement.innerHTML = '';
        this.updateChoices();
      },
      {
        once: true,
      },
    );
  }

  updateChoices() {
    this.choiceButtons = [];
    this.choicesElement.innerHTML = '';
    this.choicesElement.append(this.createButtonFor('A', this.choiceA));
    this.choicesElement.append(this.createButtonFor('B', this.choiceB));
    this.choicesElement.append(this.createButtonFor('C', this.choiceC));
    this.choicesElement.append(this.createButtonFor('D', this.choiceD));
    staggerAnimation('slide-in-right')(this.choiceButtons);
    if (this.answered) {
      this.confirmElement.classList.toggle('d-none', true);
    }
  }

  createButtonFor(letter, choice) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-lg', 'btn-choice', 'shadow-lg');
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', false);

    button.dataset.choice = letter;
    button.textContent = choice;
    button.disabled = true;
    const boundedClick = () => {
      button.disabled = false;
      button.addEventListener('click', this.boundedHandleClickQuestion);
    };

    boundedClick.bind(button);
    button.addEventListener(
      'animationend',
      boundedClick,
      { once: true },
    );
    this.choiceButtons.push(button);
    return button;
  }

  updateAfterAnswer(results) {
    this.updateBonuses(results.bonuses);
    this.answered = true;
    this.getChoiceByLetter(this.correctChoice).classList.toggle('correct', true);
    if (this.selectedChoice !== this.correctChoice) {
      this.getChoiceByLetter(this.selectedChoice).classList.toggle('incorrect', true);
    }

    if (this.answeredCorrectly) {
      jsConfetti.addConfetti();
    }

    this.confirmElement.textContent = this.answeredCorrectly
      ? 'Correct!'
      : `You got it wrong. The correct answer is ${this[`choice${this.correctChoice}`]}`;

    const hideButtons = this.shadow.querySelectorAll('.btn-choice:not(.correct):not(.incorrect)');

    hideButtons.forEach((element) => {
      element.classList.remove('slide-in-right');
      element.style.animation = 'none';
      requestAnimationFrame(() => {
        element.style.animation = '';
        element.classList.add('fade-out');
        element.onEnd = () => {
          element.classList.add('d-none');
        };

        element.addEventListener(
          'animationend',
          element.onEnd,
          {
            once: true,
          },
        );
      });
    });

    if (!this.hasNext) {
      this.nextButtonElement.textContent = 'End Round';
      this.nextButtonElement.addEventListener('click', (event) => {
        event.preventDefault();
        emitEvent('game:complete', {
          gameId: this.gameId,
        });
      });
    }

    this.nextButtonElement.classList.remove('d-none');
    this.nextButtonElement.disabled = false;

    this.selectedChoice = null;
    requestAnimationFrame(() => this.nextButtonElement.classList.add('show'));
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
    if (method === 'players.answer') {
      this.correctChoice = results.correctAnswer;
      this.answered = true;
      this.answeredCorrectly = results.answeredCorrectly;
      this.hasNext = results.hasNext;
      this.updateAfterAnswer(results);
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
