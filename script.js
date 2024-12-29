let currentQuestionIndex = 0;
let questions = [];
let score = 0;

function shuffleArray(array) {
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
      options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      correctAnswer: q.correct_answer,
    }));

    console.log(questions);
    document.getElementById("start-btn").disabled = false;
  } catch (error) {
    console.log("Something went wrong", error);
    document.getElementById("question-container").innerHTML =
      "<p>Failed to load questions. Please try again later :(</p>";
  }
}

//button to start the quiz
function startQuiz() {
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("question-container").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    finishQuiz();
    return;
  }

  const question = questions[currentQuestionIndex];
  const nextButton = document.getElementById("next-btn");

  document.getElementById("question-text").textContent = question.text;

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
  updateScore();
}

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
  document.getElementById("next-btn").style.display = "block";
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
  document
    .getElementById("points")
    .querySelector("p").textContent = `Score: ${score}/${
    currentQuestionIndex + 1
  }`;
}
function finishQuiz() {
  document.getElementById(
    "question-container"
  ).innerHTML = `<h3>Thank you for playing!</h3><p>Your score: ${score} out of ${questions.length}</p>`;
  document.querySelector(".questions").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("points").style.display = "none";
  document.getElementById("again-btn").style.display = "block";
}
// Reset quiz to play again
function playAgain() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("question-container").innerHTML = "";
  document.querySelector(".questions").style.display = "block";
  document.getElementById("points").style.display = "block";
  document.getElementById("again-btn").style.display = "none";

  fetchQuestions();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
  document.getElementById("start-btn").addEventListener("click", startQuiz);
  document.getElementById("next-btn").addEventListener("click", nextQuestion);
  document.getElementById("again-btn").addEventListener("click", playAgain);
});
