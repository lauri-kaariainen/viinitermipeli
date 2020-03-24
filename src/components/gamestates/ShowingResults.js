export const ShowingResults = ({
  getCorrectGuesses,
  correctDrinkTerms,
  guessesList
}) => (
  <div class="wrapper">
    <div class="text info">
      Sait oikein {getCorrectGuesses().length}/{correctDrinkTerms.length + " "}
      vaihtoehdosta
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
);
