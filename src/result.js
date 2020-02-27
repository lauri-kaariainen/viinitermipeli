// import { useState } from "preact/compat";

export const Result = ({ term, onClick, isSelected }) => {
  // const [isSelected, setSelected] = useState(false);
  return (
    // <div class={"result " + (isSelected ? "selected" : "")}>
    <div class={"result " + (isSelected ? "selected" : "")}>
      <div>
        {/* <button onClick={evt => setSelected(!isSelected)}>{term}</button> */}
        <button onClick={onClick.bind(null, term)}>{term}</button>
        🌟
      </div>
    </div>
  );
};
