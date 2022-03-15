/*
In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.
*/

function generateWinningNumber() {
  // the math.random returns number between 0 and 1 with decimals, but not including 1. so if we do * 10, we will get number between 0 and 10(not including 10), but * 100 will give us a number up to 0-99 not including 100. it can be a two digit number. so in order to include 10 or 100, we add the + 1 at the end, for example if we returned a number that was .999, we would be able to turn it into 99.9 and the plus 1 will let us reach 100, so itd be 100.9, then we'd round down, and itd be 100.
  return Math.floor(Math.random() * 100) + 1;
}
//console.log(generateWinningNumber())

function shuffle(array) {
  //this variable at first will be at the most right point position.Essentially we break up array into an shuffled(front) and unshuffled part, at first the index is all the way at the end but as we add elements from front to back at random, we will decrease this variable by 1, thus moving the index to left, which will decrease the number of elements we still havent shuffled.
  //last index variable is really the last Index in the list of Elements That still need to be shuffled. starting at array.length will ensure that loop runs array.length - 1 times, we bypass 0th index below
  let lastIndex = array.length;

  // While there remain elements to shuffle…eventually index will reach all the way to the left and be at index 0. Will not go into while loop when index is zero because zero is a falsy value, will bypass index 0, which is why we start with lastINdex being array.length to ensure we shuffle all elements
  while (lastIndex) {
    // Pick a remaining element, between index 0 and what index the lastINdexofElementsToShuffle is at. random number will between those two indexes but will never be the lastIndex itself. Math.random(inclusive,exclusive). this makes sense because for array [1,2,3,4]- array.length is 4, but indexes are 0,1,2,3- math.random will ensure that we will get a index between 0 and 4, which means our last index(3) CAN BE CHOSEN. IT Also reduces it by - 1. But at the time we are running MAth.random to choose a randome index, the lastIndex variable still has the same variable it has at line 22, before it get reduced by - 1. Reducing it by 1 will keep while loop going as lastINdex will move down towards 0, will also help move the randomly selected element to the right place. again for array [1, 2, 3, 4]- for first iteration we choose a random index (0 or 1 or 2 or 3) and later we make sure to place it at the back of  the section of the array that hasnt been shuffled yet at index 3,
    i = Math.floor(Math.random() * lastIndex--);

    // And swap it with the current element by using temporay variable (t) which will hold the elment which is currently at the end of the unshuffled section. array[i] is current element we chose at random. doing this will move the current element to the end of array which is the already shuffled section, already shuffled section will increase as the lastIndex variable is decreased by 1 each iteration
    t = array[lastIndex];
    array[lastIndex] = array[i];
    array[i] = t;
  }

  return array;
}

class Game {
  constructor(playersGuess) {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.gameOver = false;
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }
  isLower() {
    return this.playersGuess < this.winningNumber;
  }
  playersGuessSubmission(num) {
    if (typeof num !== "number" || num < 1 || num > 100) {
      throw "That is an invalid guess.";
    }
    this.playersGuess = num;
    return this.checkGuess();
  }

  checkGuess() {
    let feedbackText = "";
    if (this.playersGuess === this.winningNumber) {
      feedbackText = "You Win!";
      this.gameOver = true;
    } else if (this.pastGuesses.includes(this.playersGuess))
      feedbackText = "You have already guessed that number.";
    else {
      this.pastGuesses.push(this.playersGuess);

      if (this.pastGuesses.length === 5) {
        feedbackText = "You Lose!";
        this.gameOver = true;
      } else {
        let diff = this.difference();
        if (diff < 10) feedbackText = "You're burning up!";
        else if (diff < 25) feedbackText = "You're lukewarm.";
        else if (diff < 50) feedbackText = "You're a bit chilly.";
        else feedbackText = "You're ice cold!";
        //to make hint button appear only after player has made 3 guesses. Below are two methods for adding a class to that button element. THen in main.css we can define .hidden class
        if (this.pastGuesses.length >= 3) {
          // const hintButton = document.getElementById("hint");
          // hintButton.className += " hidden";
          let hintButton = document.getElementById("hint");
          hintButton.classList.remove("hidden"); //this uses a method on the element object that makes it easier to add and remove classes from an element
        }
      }
    }

    document.querySelector("#subtitle").innerHTML = feedbackText;
    document.querySelector(
      `#guessList li:nth-child(${this.pastGuesses.length})`
    ).innerHTML =
      this.playersGuess; /*the :nth-child selector allows you to select one or more elements based on their source order, here we are selecting the nth number of list item in past guesses html unordered list where n is the length of past guesses currentlys stored by the game instance. so we are changing the html of ONE list item here, adding the last guess to that previous guesses displayed list  */
    return feedbackText; //mostly here for testing
  }

  provideHint() {
    const hintArr = [this.winningNumber];

    while (hintArr.length < 3) {
      let hintRandomNum = generateWinningNumber();

      if (
        !hintArr.includes(hintRandomNum) &&
        !this.pastGuesses.includes(hintRandomNum)
      ) {
        hintArr.push(hintRandomNum);
      }
    }

    return shuffle(hintArr);
  }
}

function newGame() {
  return new Game();
}

function playGame() {
  let game = newGame();
  const submitGuessButton = document.getElementById("submit");

  submitGuessButton.addEventListener("click", function () {
    //value is always in string form so we need to conver it to a number
    const playersGuess = Number(document.querySelector("input").value);

    document.querySelector("input").value = "";

    if (!game.gameOver) game.playersGuessSubmission(playersGuess);
  });

  const playAgainButton = document.getElementById("reset");
  playAgainButton.addEventListener("click", function () {
    game = newGame();

    let hintButton = document.getElementById("hint");
    hintButton.classList.add("hidden");
    document.querySelector("#subtitle").innerHTML =
      "Pick a number from 0 - 100";
    const listItems = document.getElementsByTagName("li");
    for (listItem of listItems) {
      listItem.innerHTML = "-";
    }
  });

  const hintButton = document.getElementById("hint");
  hintButton.addEventListener("click", () => {
    if (!game.gameOver) {
      const hintArr = game.provideHint();
      document.querySelector(
        "#subtitle"
      ).innerHTML = `Maybe one of these? ${hintArr.join(", ")}`;
    }
  });
}

playGame(); //starts up game, runs func that create a new instance of a game
