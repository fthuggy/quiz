// what question is displayed and points
let currentQuestionIndex = 0;
let questions = [];
let score = 0;

// Save commonly used DOM elements in global variables
const questionContainer = document.getElementById("question-container");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const nextButton = document.getElementById("next-btn");
const points = document.getElementById("points");
const againButton = document.getElementById("again-btn");
const questionsElement = document.querySelector(".questions");

//randomize the order of answers
function randomArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//get questions
async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=26&difficulty=easy&type=multiple"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }

    const data = await response.json();

    questions = data.results.map((q) => ({
      text: q.question,
      options: randomArray([...q.incorrect_answers, q.correct_answer]),
      correctAnswer: q.correct_answer,
    }));

    console.log(questions);
    document.getElementById("start-btn").disabled = false;
  } catch (error) {
    console.log("Something went wrong", error);
    // Use global variables
    questionContainer.innerHTML =
      "<p>Failed to load questions. Please try again later :(</p>";
    startButton.disabled = true;
  }
}

//start the quiz
// This can be refactored for better readability
function startQuiz() {
  function initializeQuiz() {
    startButton.style.display = "none";
    questionContainer.style.display = "block";
    loadQuestion();
  }

  if (questions.length === 0) {
    fetchQuestions().then(initializeQuiz);
  } else {
    initializeQuiz();
  }
}

function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    finishQuiz();
    return;
  }

  const question = questions[currentQuestionIndex];

  // Use global variables
  questionText.textContent = question.text;

  for (let i = 1; i <= 4; i++) {
    const button = document.getElementById(`btn${i}`);
    if (i <= question.options.length) {
      button.textContent = question.options[i - 1];
      button.style.display = "inline-block";
      button.disabled = false;
      button.style.backgroundColor = "";
      button.onclick = () => selectAnswer(question.options[i - 1], button);
    } else {
      button.style.display = "none";
    }
  }

  nextButton.style.display = "none";
}

//if the questions answer is right green, if wrong red
function selectAnswer(option, button) {
  const question = questions[currentQuestionIndex];
  if (option === question.correctAnswer) {
    button.style.backgroundColor = "green";
    score++;
  } else {
    button.style.backgroundColor = "red";
    for (let i = 1; i <= 4; i++) {
      const btn = document.getElementById(`btn${i}`);
      if (btn.textContent === question.correctAnswer) {
        btn.style.backgroundColor = "green";
        break;
      }
    }
  }
  disableOptions();
  nextButton.style.display = "block";
  updateScore();
}

function disableOptions() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`btn${i}`).disabled = true;
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  loadQuestion();
}
function updateScore() {
  // Use global variables
  points.querySelector("p").textContent = `Score: ${score}/${
    currentQuestionIndex + 1
  }`;
}
function finishQuiz() {
  // Use global variables
  questionContainer.innerHTML = `<p>Thank you for playing!</p><p>Your score: ${score} out of ${questions.length}</p>`;
  questionsElement.style.display = "none";
  nextButton.style.display = "none";
  points.style.display = "none";
  againButton.style.display = "block";
}
// Reset quiz to play again, (start-btn),
// there is probably a better way to do this but i got stuck.
// ALTERNATIVE, you could manually reset all values to their initial state
// The return false is redunant and can be removed
againButton.addEventListener("click", function () {
  window.location.reload();
});

// DOMContentLoaded event is not needed
document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
  // Use global variables
  startButton.addEventListener("click", startQuiz);
  nextButton.addEventListener("click", nextQuestion);
  againButton.addEventListener("click", playAgain);
});
