import "./style";
import { render } from "preact";
import { useState } from "preact/compat";
import { Result } from "./result";
import { getSeededSampleOfN, shuffle, uniqueShallow } from "./helpers.js";
import { getRealTerms } from "./getTerms.js";
import { WineList } from "./components/WineList.js";
import ALLWINETERMS from "./viinitermit.json";

const GAMESTATES = {
  PRESTART: 0,
  GETWINE: 1,
  GUESSING: 2,
  RESULT: 3
};

//lower is easier
const DIFFICULTYLEVEL = 6;

const possibleSeed = Math.floor(ALLWINETERMS.length * Math.random());

function App() {
  const [gameState, setGameState] = useState(GAMESTATES.PRESTART);
  const [inputState, setInputState] = useState("");
  const [guessableTermsState, setGuessableTermsState] = useState([]);
  const [searchedWines, setSearchedWines] = useState([]);
  const [guessesList, setGuessesList] = useState([]);
  const [correctWineTerms, setCorrectWineTerms] = useState([]);
  const [seed, setSeed] = useState(possibleSeed);
  const fakeSample = getSeededSampleOfN(ALLWINETERMS, DIFFICULTYLEVEL, seed);

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
        .then(e => setSearchedWines(e));
    }
    setInputState(ev.target.value);
  };

  const handleWineChoose = id =>
    getRealTerms(id)
      //   .then(res => (console.log("winechooses", res), res))
      .then(
        res =>
          setCorrectWineTerms(res.split(",").map(word => word.trim())) ||
          setGuessableTermsState(
            shuffle(
              fakeSample
                .concat(res.split(",").map(word => word.trim()))
                .filter(uniqueShallow)
            ).sort()
          ) ||
          setGameState(GAMESTATES.GUESSING)
      );

  const handleGuessingWine = term => {
    if (!guessesList.includes(term)) setGuessesList(guessesList.concat(term));
    else setGuessesList(guessesList.filter(guess => guess !== term));
  };

  const getCorrectGuesses = _ =>
    guessesList.filter(guess => correctWineTerms.includes(guess));

  return (
    <div>
      <h1>
        Viinipeli{" "}
        <span role="img" aria-label="wine glass">
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
        <div class="wrapper">
          <div class="text info">
            Jos haluat pelata muiden kanssa, anna heille siemenluku:{" "}
            <span class="seedcode">{seed}</span>
          </div>

          <div>
            Tai syötä tähän heidän siemenlukunsa:
            <input
              class="seedInput"
              onChange={evt => setSeed(evt.target.value)}
              value={seed}
            />
          </div>
          <button onClick={setGameState.bind(null, GAMESTATES.GETWINE)}>
            Aloita!
          </button>
        </div>
      ) : gameState === GAMESTATES.GETWINE ? (
        <div class="wrapper">
          <div class="text info">Haetaan ensin viini hakusanalla:</div>
          <input
            class=""
            placeholder="Tempranillo..."
            onChange={handleInputChange}
            value={inputState}
          />
          <WineList wines={searchedWines} onClick={handleWineChoose} />
        </div>
      ) : gameState === GAMESTATES.GUESSING ? (
        <div class="wrapper">
          {console.log(guessesList)}
          <div class="text info">Valitse mitkä termit koskevat tätä viiniä</div>
          <div class="list">
            {guessableTermsState.map(term => (
              <Result
                term={term}
                onClick={handleGuessingWine}
                isSelected={guessesList.includes(term)}
              />
            ))}
          </div>
          <button
            class="guessingDoneButton green"
            onClick={setGameState.bind(null, GAMESTATES.SHOWINGRESULTS)}
          >
            Lukitsen vastaukset
          </button>
        </div>
      ) : gameState === GAMESTATES.SHOWINGRESULTS ? (
        <div class="wrapper">
          <div class="text info">
            Sait oikein {getCorrectGuesses().length}/
            {correctWineTerms.length + " "}
            vaihtoehdosta
            {/* {getCorrectGuesses().length
              ? "; " + getCorrectGuesses().join(", ")
              : ""} */}
          </div>
          <div class="text info">
            Vääriä vastauksia oli{" "}
            {guessesList.length - getCorrectGuesses().length + " "} kpl
          </div>
          <div class="text info points">
            Pisteesi ovat{" "}
            {getCorrectGuesses().length -
              (guessesList.length - getCorrectGuesses().length)}
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
