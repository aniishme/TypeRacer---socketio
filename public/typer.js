const words = [
  "inosine",
  "sannyasi",
  "gratitude",
  "smarminess",
  "saintlike",
  "seafowl",
  "tartan",
  "blunge",
  "emptied",
  "euchres",
  "cycles",
  "underwoods",
  "anabolic",
  "lament",
  "whizzer",
  "unclearest",
  "dismast",
  "almonries",
  "reparks",
  "demands",
  "floreated",
  "reseizing",
  "gasometer",
  "rhombs",
  "seductiveness",
  "overplotting",
  "precisions",
  "photoreceptors",
  "redeny",
  "delegacy",
  "pubertal",
  "felts",
  "stellate",
  "suberise",
  "vealiest",
  "ritonavir",
  "mortgager",
  "perquisite",
  "multiversities",
  "inhales",
  "siestas",
  "antepenultimate",
  "vilest",
  "stamen",
  "zarfs",
  "initialer",
  "disaffects",
  "chopins",
  "homeliest",
  "orra",
  "mendaciously",
  "prerehearsal",
  "drawled",
  "clifts",
  "typeface",
  "swords",
  "dopeyness",
  "chaetognath",
  "godlessly",
  "pelorian",
  "interborough",
  "nauseousnesses",
  "theorizes",
  "triturate",
  "ragout",
  "portapacks",
  "epizooty",
  "underestimating",
  "waiters",
  "chronometrical",
  "shmucks",
  "groynes",
  "esne",
  "pints",
  "shaggymanes",
  "pitilessness",
  "antiestrogen",
  "rapporteur",
  "sacerdotal",
  "alternants",
  "subdivision",
  "galopade",
  "muskmelons",
  "mesdemoiselles",
  "carps",
  "hydroniums",
  "swashbucklers",
  "sclerites",
  "fixates",
  "counterexamples",
  "mylar",
  "paramedic",
  "baronnes",
  "labyrinth",
  "paddles",
  "wafflier",
  "pizza",
  "arbiters",
  "oxtails",
  "disinhibition",
];
const mainDiv = document.querySelector(".text_wrapper");
const input = document.querySelector("#text");
const timer = document.querySelector("#timer");
const start = document.querySelector("button");
let keypressed = 0;
let typed = [];

createText(words);
input.focus();
input.select();
function createText(arrayOfWords) {
  i = 0;
  arrayOfWords.forEach((word) => {
    const wordSpan = document.createElement("span");
    wordSpan.innerText = word;
    wordSpan.setAttribute("wordnbr", `${i}`);
    wordSpan.classList.add("word");
    mainDiv.appendChild(wordSpan);
    i++;
  });
}

function checkCorrectness(e) {
  const wordsElem = document.querySelectorAll(".word");
  if (e.key === "Spacebar" || e.key === " ") {
    let value = e.target.value.trim();
    wordsElem[typed.length + 1].scrollIntoView();
    if (value == words[typed.length] && value.length > 0) {
      wordsElem[typed.length].classList.add("green");
      typed.push(true);
      e.target.value = "";
    } else if (value.length > 0) {
      wordsElem[typed.length].classList.add("red");
      typed.push(false);
      e.target.value = "";
    }
  }
}

input.addEventListener("keyup", checkCorrectness);

function calculateStats(currentTime) {
  let totalWords = typed.length;
  let correctWords = 0;
  let incorrectWords = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === true) {
      correctWords++;
    } else {
      incorrectWords++;
    }
  }
  let correctWpm = Math.round((correctWords / (60 - currentTime)) * 60) || 0;

  return { totalWords, correctWpm, incorrectWords };
}

function showStats(currentTime) {
  const wordsTyped = document.querySelector("#total_words");
  const wpm = document.querySelector("#wpm");
  const incorrect = document.querySelector("#incorrect");
  let { totalWords, correctWpm, incorrectWords } = calculateStats(currentTime);

  wordsTyped.innerHTML = `Words Typed: ${totalWords}`;
  wpm.innerHTML = `Wpm: ${correctWpm}`;
  incorrect.innerHTML = `Incorrect Words: ${incorrectWords}`;
}
