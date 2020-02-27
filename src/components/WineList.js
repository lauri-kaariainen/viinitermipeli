export const WineList = ({ wines, onClick }) => {
  const handleClick = (id, evt) => onClick(id);
  return (
    <div class="winelist">
      {wines.map(wine => (
        <button onClick={handleClick.bind(null, wine.id)}>{wine.name}</button>
      ))}
    </div>
  );
};
