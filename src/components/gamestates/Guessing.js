import { Term } from "../Term.js";

export const Guessing = ({
  guessableTermsState,
  term,
  handleGuessingDrink,
  guessesList,
  setGameState,
  GAMESTATES
}) => (
  <div class="wrapper">
    <div class="text info">Valitse mitkä termit koskevat tätä viiniä</div>
    <div class="list">
      {console.log(guessableTermsState)}
      {guessableTermsState.map(term => (
        <Term
          term={term}
          onClick={handleGuessingDrink}
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
);
