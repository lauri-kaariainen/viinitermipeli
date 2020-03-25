export const ShowingResults = ({
  getCorrectGuesses,
  correctDrinkTerms,
  guessesList,
  numOfRepeats
}) => (
  <div class="wrapper">
    <div class="text info">
      {numOfRepeats ? (
        <span>
          {" "}
          Toistoja: <span class="bold">{numOfRepeats}</span>
        </span>
      ) : (
        <span />
      )}
      <br />
      Sait oikein <span class="bold">{getCorrectGuesses().length}</span>/
      <span class="bold">{correctDrinkTerms.length + " "}</span>
      vaihtoehdosta
    </div>
    <div class="text info">
      Vääriä vastauksia oli{" "}
      <span class="bold">
        {" "}
        {guessesList.length - getCorrectGuesses().length + " "}
      </span>{" "}
      kpl
    </div>
    <div class="text info points">
      Pisteesi ovat{" "}
      <span class="bold">
        {getCorrectGuesses().length -
          (guessesList.length - getCorrectGuesses().length)}
      </span>
    </div>
  </div>
);
