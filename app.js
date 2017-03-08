
var state = {
  questions: [
    {
      text: "What is Batman's color scheme?",
      choices: ["- black, yellow", "- red, green", "- pink, purple", "- orange, blue"],
      correctChoiceIndex: 0
    },
    {
      text: "What is Superman's weakness?",
      choices: ["- Magnetite", "- Kryptonite", "- Graphite", "- Plutonium"],
      correctChoiceIndex: 1
    },
    {
      text: "Who is Iron Man?",
      choices: ["- Mike Meyers", "- Bruce Wayne", "- Tony Stark", "- Bruce Willis"],
      correctChoiceIndex: 2,
    },
    {
      text: "What Movie is the Yellow Jacket from?",
      choices: ["- Star Wars", "- Toy Story", "- Beetlejuice", "- Ant Man"],
      correctChoiceIndex: 3,
    },
    {
      text: "How was Spiderman made into a super hero?",
      choices: ["- Hit by a bus", "- Bitten by a radioactive spider", "- Fell off a cliff", "- Bitten by a crocodile"],
      correctChoiceIndex: 1,
    },
     {
      text: "What is the name of the super hero who is extremely fast?",
      choices: ["- Speedy", "- The Flash", "- Super Quick", "- Road Runner"],
      correctChoiceIndex: 1,
    },
     {
      text: "When he is not the Hulk, what is his name?",
      choices: ["- Bruce Wayne", "- Bruce Lee", "- Bruce Banner", "- Bruce Willis"],
      correctChoiceIndex: 2,
    },
     {
      text: "In the movie Guardians of the Galaxy, what are the famous words of Groot?",
      choices: ["- I like Rocker", "- I am Groot", "- No more Star Lord", "- Who is Drax the Destroyer"],
      correctChoiceIndex: 1,
    },
     {
      text: "What super hero is War Machine sidekick to?",
      choices: ["- Thor", "- Robin", "- Iron Man", "- Falcon"],
      correctChoiceIndex: 2,
    },
     {
      text: "What planet is Thor from?",
      choices: ["- Midgar", "- Asgard", "- Earth", "- Planet X"],
      correctChoiceIndex: 1,
    }
  ],
  praises : [
    "",
    "",
    "",
    ""
  ],

  admonishments: [
    "",
    "",
    ""
  ],
  score: 0,
  currentQuestionIndex: 0,
  begin: 'start',
  lastAnswer: false,
  feedbackRandom: 0
};


function setBegin(state, begin) {
  state.begin = begin;
};

function resetGame(state) {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setBegin(state, 'start');
};

function answerQuestion(state, answer) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  state.lastAnswer = currentQuestion.correctChoiceIndex === answer;
  if (state.lastAnswer) {
    state.score++;
  }
  selectFeedback(state);
  setBegin(state, 'answer-feedback');
};

function selectFeedback(state) {
  state.feedbackRandom = Math.random();
};

function advance(state) {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setBegin(state, 'final-feedback');
  }
  else {
    setBegin(state, 'question');
  }
};


function initializeApp(state, elements) {

  Object.keys(elements).forEach(function(begin) {
    elements[begin].hide();
  });
  elements[state.begin].show();

  if (state.begin === 'start') {
      renderStartPage(state, elements[state.begin]);
  }
  else if (state.begin === 'question') {
      renderQuestionPage(state, elements[state.begin]);
  }
  else if (state.begin === 'answer-feedback') {
    renderAnswerFeedbackPage(state, elements[state.begin]);
  }
  else if (state.begin === 'final-feedback') {
    renderFinalFeedbackPage(state, elements[state.begin]);
  }
};


function renderStartPage(state, element) {
};

function renderQuestionPage(state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

function renderAnswerFeedbackPage(state, element) {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

function renderFinalFeedbackPage(state, element) {
  renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
  var text = (state.currentQuestionIndex + 1) + "-" + state.questions.length;
  element.text(text);
};

function renderQuestionText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

function renderChoices(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer" value="' + index + '" required>' +
        '<label>' + choice + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
  var html = state.lastAnswer ?
      "<h1 class='user-was-correct'>Correct!</h1>" :
      "<h1 class='user-was-incorrect'>Sorry, wrong answer.</>";

  element.html(html);
};

function renderAnswerFeedbackText(state, element) {
  var choices = state.lastAnswer ? state.praises : state.admonishments;
  var text = choices[Math.floor(state.feedbackRandom * choices.length)];
  element.text(text);
};

function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next" : "How's my knowlege?";
  element.text(text);
};

function renderFinalFeedbackText(state, element) {
  var text = "You got " + state.score + " out of " +
    state.questions.length + " questions right.";
  element.text(text);
};


var ELEMENTSONPAGE = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

$("form[name='game-start']").submit(function(event) {
  event.preventDefault();
  setBegin(state, 'question');
  initializeApp(state, ELEMENTSONPAGE);
});

$(".restart-game").click(function(event){
  event.preventDefault();
  resetGame(state);
  initializeApp(state, ELEMENTSONPAGE);
});

$("form[name='current-question']").submit(function(event) {
  event.preventDefault();
  var answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  initializeApp(state, ELEMENTSONPAGE);
});

$(".see-next").click(function(event) {
  advance(state);
  initializeApp(state, ELEMENTSONPAGE);
});

$(function() { initializeApp(state, ELEMENTSONPAGE); });
