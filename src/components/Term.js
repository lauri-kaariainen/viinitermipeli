export const Term = ({
  term,
  onClick = (_) => _,
  isGuessed,
  isCorrectlyGuessed
}) => {
  return (
    <div
      class={
        "result" +
        (isGuessed ? " selected" : " ") +
        (isCorrectlyGuessed ? " correctGuess" : " ")
      }
    >
      <div>
        <button onClick={onClick.bind(null, term)}>{term}</button>
        {isCorrectlyGuessed ? "🌟" : ""}
      </div>
    </div>
  );
};
