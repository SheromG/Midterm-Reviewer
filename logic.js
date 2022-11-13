let file = null;
const output = document.querySelector("#output");
const next = document.querySelector("#next");
const prev = document.querySelector("#previous");
const subjectDisplay = document.querySelector("#subject");

const answer = document.querySelector("#show-answer");
const dcit26 = document.querySelector("#dcit26");
const insy55 = document.querySelector("#insy55");
const itec80 = document.querySelector("#itec80");
const itec85 = document.querySelector("#itec85");

const questionNumberDisplay = document.querySelector("#question-number");

const auto = document.querySelector("#auto");

const questionDisplay = document.querySelector("#question");
const answerDisplay = document.querySelector("#answer");

let currentIndex = -1;
let subject = null;
let currentQuestion = null;

// ignore
let showAnswer = true;

//status of auto
let autoStatus = false;

// data from text file || raw data
let data = null;

// data been converted to question and answer
let exam = [];

const type = {
  fill: 0,
  multiple: 1,
};

const changeFile = async (fileName) => {
  try {
    file = await fetch(fileName);
    file = await file.text();
    readFile();
  } catch (error) {
    console.log(error.message);
  }
};

dcit26.addEventListener("click", () => {
  changeFile("subjects/dcit26.txt");
  subject = "DCIT 26 - Application Development and Emerging Technologies";
});

insy55.addEventListener("click", () => {
  changeFile("subjects/ins55.txt");
  subject = "INSY 55 - System Analysis and Design";
});

itec80.addEventListener("click", () => {
  changeFile("subjects/itec80.txt");
  subject = "ITEC 80 - Introduction to Human Computer Interaction";
});

itec85.addEventListener("click", () => {
  changeFile("subjects/itec85.txt");
  subject = "ITEC 85 - Information Assurance and Security 1";
});


answer.addEventListener("click", () => {
  // return if exam is not loaded
  if (exam.length <= 0) return;

  // show answer
  if (showAnswer) {
    questionDisplay.classList.add("d-none");
    answerDisplay.classList.remove("d-none");
    answer.innerHTML = "Question";
    showAnswer = false;
    return;
  }

  answer.innerHTML = "Answer";
  questionDisplay.classList.remove("d-none");
  answerDisplay.classList.add("d-none");
  showAnswer = true;
});

// Model for question
const generateQuestion = (type, question) => {
  return {
    type: type,
    question: question,
    answer: "",
    choice: [],
  };
};

// get text from file
const getSentence = (start, condition) => {
  for (let index = start; index < data.length; index++) {
    if (data[index] === condition) {
      // temporary holder for question
      let tempQuestion = "";

      //   get all the letters of the sentence of the question
      while (data[index] !== "\n") {
        // to remove + from the beginning
        index++;

        tempQuestion += data[index];
      }

      return {
        index: ++index,
        sentence: tempQuestion.trim(),
      };
    }
  }
};

// return array of choices
const getChoices = (start, condition) => {
  const questions = [];

  for (let index = start; index < data.length && data[index] !== "+"; index++) {
    if (data[index] === condition) {
      // temporary holder for question
      let tempQuestion = "";

      //   get all the letters of the sentence of the question
      while (data[index] !== "\n") {
        // to remove + from the beginning
        index++;

        tempQuestion += data[index];
      }

      questions.push(tempQuestion.trim());
    }
  }
  return questions;
};

// return question
const showQuestion = () => {
  for (let index = 0; index < data.length; index++) {
    if (data[index] === "+") {
      // get question
      const value = getSentence(index, "+");

      // update index
      index = value.index;

      //full question
      const question = generateQuestion(type.multiple, value.sentence);

      switch (data[index]) {
        case "_":
          //get choices
          question.choice = getChoices(index, "_");
          question.type = type.multiple;
          break;
        case "-":
          //get choices
          question.choice = getChoices(index, "-");
          question.type = type.fill;
          break;
        default:
          console.log("Error", data[index]);
          console.log(data[index - 5]);
          console.log(data[index - 4]);
          console.log(data[index - 3]);
          console.log(data[index - 2]);
          console.log(data[index - 1]);
          console.log(data[index]);
          console.log(data[index + 1]);
          console.log(data[index + 2]);
          console.log(data[index + 3]);
          console.log(data[index + 4]);
          console.log(data[index + 5]);
          console.log(data[index + 6]);
          console.log(data[index + 7]);
          console.log(data[index + 9]);
          console.log(data[index + 9]);
          console.log(data[index + 10]);
      }

      exam.push(question);
    }
  }
};

const shuffleArray = () => {
  const usedIndex = [];
  let index = random();

  while (usedIndex.length < exam.length) {
    while (usedIndex.includes(index)) {
      index = random();
    }

    usedIndex.push(index);
  }

  let temp = null;

  for (let i = 0; i < usedIndex.length; i++) {
    const insertValue = exam[usedIndex[i]];

    temp = exam[i];

    exam[i] = insertValue;

    exam[usedIndex[i]] = temp;
  }
};

const random = () => Math.floor(Math.random() * exam.length);

// render questions as html
const renderOutput = () => {
  questionDisplay.innerHTML = exam[currentIndex].question;

  let questionHolder = "";

  // loop throught the choices
  exam[currentIndex].choice.forEach((tempQuestion) => {
    questionHolder += tempQuestion + "<br>";
  });

  //display choices
  answerDisplay.innerHTML = questionHolder;
};

const readFile = () => {
  //reset exam
  exam = [];
  data = file.split("");
  // get question and answer
  showQuestion();
  // shuffle index of exam
  shuffleArray();
  // displat the current subect
  subjectDisplay.innerHTML = subject;

  currentIndex = -1;
};

prev.addEventListener("click", () => {
  // return if exam is empty
  if (!exam.length || currentIndex === 0) return;

  currentIndex -= 1;

  questionNumberDisplay.innerHTML = currentIndex + 1 + "/" + exam.length;
  renderOutput();
});

next.addEventListener("click", () => {
  // return if exam is empty
  if (!exam.length) return;

  // do not execute if last question is reach
  if (currentIndex === exam.length - 1) return;

  currentIndex++;

  console.log(currentIndex);

  questionNumberDisplay.innerHTML = currentIndex + 1 + "/" + exam.length;

  renderOutput();
});

let interval;

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const autoClick = async () => {
  interval = setInterval(async () => {
    next.click();
    await timeout(5000);
    answer.click();
    await timeout(3000);
    answer.click();
  }, 8000);
};

auto.addEventListener("click", () => {
  //return if no exam
  if (exam.length <= 0) return;

  autoStatus = autoStatus ? false : true;

  if (!autoStatus) {
    auto.classList.remove("btn-dark");
    console.log("clearing interval");
    clearInterval(interval);
    return;
  }

  auto.classList.add("btn-dark");
  autoClick();
});
