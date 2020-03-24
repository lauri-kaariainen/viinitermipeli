import "./style";
import { render } from "preact";
import { useState } from "preact/hooks";
import { getSeededSampleOfN, shuffle, uniqueShallow } from "./helpers.js";
import { getRealTerms } from "./getTerms.js";
import ALLDRINKTERMS from "./punaviinitermit.json";
import { PreStart } from "./components/gamestates/PreStart.js";
import { GetDrink } from "./components/gamestates/GetDrink.js";
import { Guessing } from "./components/gamestates/Guessing.js";
import { ShowingResults } from "./components/gamestates/ShowingResults";

const GAMESTATES = {
  PRESTART: 0,
  GETDRINK: 1,
  GUESSING: 2,
  RESULT: 3
};

//lower is easier
const DIFFICULTYLEVEL = 6;

const possibleSeed = Math.floor(ALLDRINKTERMS.length * Math.random());

function App() {
  const [gameState, setGameState] = useState(GAMESTATES.PRESTART);
  const [inputState, setInputState] = useState("");
  const [guessableTermsState, setGuessableTermsState] = useState([]);
  const [searchedDrinks, setSearchedDrinks] = useState([]);
  const [guessesList, setGuessesList] = useState([]);
  const [correctDrinkTerms, setCorrectDrinkTerms] = useState([]);
  const [seed, setSeed] = useState(possibleSeed);
  const fakeSample = getSeededSampleOfN(ALLDRINKTERMS, DIFFICULTYLEVEL, seed);

  const handleInputChange = ev => {
    if (ev.target.value.length > 2) {
      fetch(
        "//lauri.space/alko-product-api/products/redwines?search=" +
          encodeURIComponent(ev.target.value)
      )
        .then(e => e.json())
        // .then(e => console.log(e))
        .then(res =>
          res.data.map(el => ({
            id: el.attributes["product-id"],
            name: el.attributes.name
          }))
        )
        // .then(e => (console.log(e), e))
        .then(e => setSearchedDrinks(e));
    }
    setInputState(ev.target.value);
  };

  const handleDrinkChoose = id =>
    getRealTerms(id)
      //   .then(res => (console.log("drinkchooses", res), res))
      .then(
        res =>
          setCorrectDrinkTerms(res.split(",").map(word => word.trim())) ||
          setGuessableTermsState(
            shuffle(
              fakeSample
                .concat(res.split(",").map(word => word.trim()))
                .filter(uniqueShallow)
            ).sort()
          ) ||
          setGameState(GAMESTATES.GUESSING)
      );

  const handleGuessingDrink = term => {
    if (!guessesList.includes(term)) setGuessesList(guessesList.concat(term));
    else setGuessesList(guessesList.filter(guess => guess !== term));
  };

  const getCorrectGuesses = _ =>
    guessesList.filter(guess => correctDrinkTerms.includes(guess));

  return (
    <div>
      <h1>
        Viinipeli{" "}
        <span role="img" aria-label="drink glass">
          🍷
        </span>
        <span
          class="right seedcode"
          title="share this number if playing with friends"
        >
          {" "}
          {seed}
        </span>
      </h1>
      {gameState === GAMESTATES.PRESTART ? (
        <PreStart
          seed={seed}
          setSeed={setSeed}
          setGameState={setGameState}
          GAMESTATES={GAMESTATES}
        />
      ) : gameState === GAMESTATES.GETDRINK ? (
        <GetDrink
          handleInputChange={handleInputChange}
          inputState={inputState}
          searchedDrinks={searchedDrinks}
          handleDrinkChoose={handleDrinkChoose}
        />
      ) : gameState === GAMESTATES.GUESSING ? (
        <Guessing
          guessableTermsState={guessableTermsState}
          handleGuessingDrink={handleGuessingDrink}
          guessesList={guessesList}
          setGameState={setGameState}
          GAMESTATES={GAMESTATES}
        />
      ) : gameState === GAMESTATES.SHOWINGRESULTS ? (
        <ShowingResults
          getCorrectGuesses={getCorrectGuesses}
          guessesList={guessesList}
          correctDrinkTerms={correctDrinkTerms}
        />
      ) : (
        <div />
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
