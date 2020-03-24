import { SearchedList } from "../SearchedList.js";

export const GetDrink = ({
  handleInputChange,
  inputState,
  searchedDrinks,
  handleDrinkChoose
}) => (
  <div class="wrapper">
    <div class="text info">Haetaan ensin viini hakusanalla:</div>
    <input
      class=""
      placeholder="Tempranillo..."
      oninput={handleInputChange}
      value={inputState}
    />
    <SearchedList items={searchedDrinks} onClick={handleDrinkChoose} />
  </div>
);
