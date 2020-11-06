import "./style";
import { render } from "preact";
import { useState } from "preact/hooks";
import { getSeededSampleOfN, shuffle, uniqueShallow } from "./helpers.js";
import { getRealTerms } from "./getTerms.js";
import REDWINETERMS from "./punaviinitermit.json";
import WHITEWINETERMS from "./valkoviinitermit.json";
import { PreStart } from "./components/gamestates/PreStart.js";
import { GetDrink } from "./components/gamestates/GetDrink.js";
import { Guessing } from "./components/gamestates/Guessing.js";

const GAMESTATES = {
  PRESTART: 0,
  GETDRINK: 1,
  GUESSING: 2
};

//lower is easier
const DIFFICULTYLEVEL = 6;

const possibleRedSeed = Math.floor(REDWINETERMS.length * Math.random());

function App() {
  const [gameState, setGameState] = useState(GAMESTATES.PRESTART);
  const [inputState, setInputState] = useState("");
  const [guessableTermsState, setGuessableTermsState] = useState([]);
  const [searchedDrinks, setSearchedDrinks] = useState([]);
  const [guessesList, setGuessesList] = useState([]);
  const [correctDrinkTerms, setCorrectDrinkTerms] = useState([]);
  const [seed, setSeed] = useState(possibleRedSeed);
  const [numOfRepeats, setNumOfRepeats] = useState(0);
  const [selectedWineName, setSelectedWineName] = useState("");
  const getFakeSample = (type) =>
    getSeededSampleOfN(
      type.toLowerCase() === "punaviinit" ? REDWINETERMS : WHITEWINETERMS,
      DIFFICULTYLEVEL,
      seed
    );

  const handleInputChange = (ev) => {
    if (ev.target.value.length > 2) {
      fetch(
        "//lauri.space/alko-product-api/products/redwines?search=" +
          encodeURIComponent(ev.target.value)
      )
        .then((e) => e.json())
        .then((res) =>
          res.data.map((el) => ({
            id: el.attributes["product-id"],
            name: el.attributes.name
          }))
        )
        .then((e) => setSearchedDrinks(e));
    }
    setInputState(ev.target.value);
  };

  const handleDrinkChoose = (id) =>
    getRealTerms(id)
      // .then(res => (console.log("drinkchooses", res), res))
      .then(
        (res) =>
          setSelectedWineName(res.name) ||
          setCorrectDrinkTerms(
            res.terms.split(",").map((word) => word.trim())
          ) ||
          setGuessableTermsState(
            shuffle(
              getFakeSample(res.type)
                .concat(res.terms.split(",").map((word) => word.trim()))
                .filter(uniqueShallow)
            ).sort()
          ) ||
          setGameState(GAMESTATES.GUESSING)
      );

  const handleGuessingDrink = (guess) => {
    setGuessableTermsState(
      guessableTermsState.filter((term) => term !== guess)
    );
    setGuessesList(guessesList.concat(guess));
  };

  const getCorrectGuesses = (_) =>
    guessesList.filter((guess) => correctDrinkTerms.includes(guess));

  // const restartWithSameCode = (_) =>
  //   setNumOfRepeats(numOfRepeats + 1) || setGameState(GAMESTATES.GUESSING);

  const restartFromScratch = (_) => window.location.reload();

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
        [
          <span class="bold">{selectedWineName}</span>,
          <br />,
          <span>
            {correctDrinkTerms.every((e) => guessesList.includes(e)) ? (
              [
                <span>Arvasit kaikki oikein!</span>,
                <button onClick={restartFromScratch}>
                  Aloita uuden viinin kanssa
                </button>
              ]
            ) : (
              <span></span>
            )}
          </span>,
          <Guessing
            guessableTermsState={guessableTermsState}
            handleGuessingDrink={handleGuessingDrink}
            correctGuesses={getCorrectGuesses()}
            guessesList={guessesList}
            setGameState={setGameState}
            GAMESTATES={GAMESTATES}
            correctDrinkTerms={correctDrinkTerms}
          />
        ]
      ) : (
        <div />
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
