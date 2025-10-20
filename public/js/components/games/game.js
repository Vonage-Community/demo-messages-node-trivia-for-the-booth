import { RPCElement } from '../rpcElement.js';

export class GameElement extends RPCElement {
  static observedAttributes = [
    'data-game-id',
    'data-active',
    'data-bonus',
    'data-playing',
    'data-question-title',
    'data-short-code',
    'data-question-count',
  ];

  static NO_GAME = 'NO_GAME';
  static NO_ACTIVE = 'NO_ACTIVE';
  static NO_QUESTION = 'NO_QUESTION';
  static NOT_PLAYING = 'NOT_PLAYING';
  static PLAYING = 'PLAYING';

  get gameId() {
    return this.dataset.gameId;
  }

  set gameId(value) {
    this.dataset.gameId = value;
  }

  get gameTitle() {
    return this.dataset.gameTitle;
  }

  set gameTitle(value) {
    this.dataset.gameTitle = value;
  }

  get shortCode() {
    return this.dataset.shortCode;
  }

  set shortCode(value) {
    this.dataset.shortCode = value;
  }

  get questionCount() {
    return this.dataset.questionCount;
  }

  set questionCount(value) {
    this.dataset.questionCount = Number(value).toFixed(0);
  }

  get active() {
    return this.dataset.active;
  }

  set active(value) {
    this.dataset.active = !!value;
  }

  get bonus() {
    return this.dataset.bonus;
  }

  set bonus(value) {
    this.dataset.bonus = !!value;
  }

  get playing() {
    return this.dataset.playing;
  }

  set playing(value) {
    this.dataset.playing = !!value;
  }

  get state() {
    if (!this.gameId) {
      return GameElement.NO_GAME;
    }

    if (!this.active) {
      return GameElement.NO_ACTIVE;
    }

    if (!this.playing) {
      return GameElement.NOT_PLAYING;
    }

    return GameElement.PLAYING;
  }

  callActiveGame() {
    if (!this.gameId || !this.active) {
      console.log('Checking for active game');
      this.makeRPCCall('games.active');
    }

    console.log('Have active game');
  }

  onDataLoaded(results) {
    this.gameId = results.id;
    this.bounus = results.bounus;
    this.active = results.active;
    this.playing = results.playing;
    this.questionCount = results.questionCount;
    this.gameTitle = results.title;
    this.shortCode = results.shortCode;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Attribute changed', name, oldValue, newValue);

    switch (name) {
      case 'data-game-id':
        this.gameId = newValue;
        break;

      case 'data-active':
        this.active = newValue;
        break;

      case 'data-bonus':
        this.bounus = newValue;
        break;

      case 'data-playing':
        this.playing = newValue;
        break;

      case 'data-game-title':
        this.gameTitle = newValue;
        break;

      case 'data-short-code':
        this.shortCode = newValue;
        break;
      case 'data-question-count':
        this.questionCount = newValue;
        break;
    }

  }
}

customElements.define('trivia-game', GameElement);
