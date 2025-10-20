
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(`
  .btn-next {
    color: #000;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 2rem;
    transform: translateY(60px);
    position: relative;
    margin-top: 2rem;
    opacity: 0;
    transition: all 0.6s ease-out;
  }

  .btn-next.show {
    transform: translateY(0);
    animation: slideUp 0.6s ease-out forwards;
  }

  .btn-next.hide {
    opacity: 0;
    transform: translateY(60px);
    animation: slideDown 0.5s ease-in forwards;
  }

  .fade-in {
    animation: fadeIn 0.4s ease-in forwards;
  }

  .fade-out {
    animation: fadeOut 0.4s ease-out forwards;
  }

  /* Keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.98);
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(60px);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(60px);
    }
  }

  .btn-choice,
  .btn-choice:disabled {
    background-color: #b27bf2;
    color: #000;
    transition: all 0.25s ease-in-out;
    margin: 0.5rem;
    opacity: 0;
    transform: translateX(40px);
    animation: slideInRight 0.6s ease-out forwards;
  }

  /* Animate in one-by-one */
  .btn-choice:nth-child(1) { animation-delay: 0.1s; }
  .btn-choice:nth-child(2) { animation-delay: 0.3s; }
  .btn-choice:nth-child(3) { animation-delay: 0.5s; }
  .btn-choice:nth-child(4) { animation-delay: 0.7s; }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    .btn-choice {
      flex: 1 1 100%;
    }
  }

  .btn-choice:hover,
  .btn-choice:focus {
    background-color: #fb8fd8;
    color: #000;
    transform: scale(1.03);
  }

  .btn-choice[aria-checked="true"] {
    background-color: #FD3FE4;
    color: #000;
    box-shadow: 0 0 25px rgba(253, 63, 228, 0.8);
    transform: scale(1.05);
  }

  .btn-choice[aria-checked="true"]:hover,
  .btn-choice[aria-checked="true"]:focus {
    background-color: #FF9C9D;
    color: #000;
    transform: scale(1.07);
  }

  .btn-choice.correct {
    color: #000;
    background-color: #1c8731;
  }

  .btn-choice.incorrect {
    color: #000;
    background-color: #fe9696;
  }
`);

export default styleSheet;
