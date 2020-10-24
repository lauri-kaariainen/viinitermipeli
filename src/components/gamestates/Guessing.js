import { Term } from "../Term.js";

export const Guessing = ({
  guessableTermsState,
  handleGuessingDrink,
  guessesList,
  setGameState,
  GAMESTATES,
  correctGuesses,
  correctDrinkTerms
}) => (
  <div class="wrapper">
    <div class="text info">Valitse mitkä termit koskevat tätä viiniä</div>
    <div class="list">
      {console.log(guessableTermsState)}
      {guessableTermsState.map((term) => (
        <Term
          term={term}
          onClick={handleGuessingDrink}
          isGuessed={false}
          isCorrectlyGuessed={false}
        />
      ))}
    </div>
    <hr />
    <div>
      <span>
        Arvattu oikein
        <br />
        <span class="bold">{correctGuesses.length}</span>/
        <span class="bold">{correctDrinkTerms.length}</span>
      </span>
      {guessesList.map((term) => (
        <Term
          term={term}
          // onClick={handleGuessingDrink}
          isGuessed={guessesList.includes(term)}
          isCorrectlyGuessed={correctGuesses.includes(term)}
        />
      ))}
    </div>
    <hr />

    {/* <button
      class="guessingDoneButton green"
      onClick={setGameState.bind(null, GAMESTATES.SHOWINGRESULTS)}
    >
      Lukitsen vastaukset
    </button> */}
  </div>
);
