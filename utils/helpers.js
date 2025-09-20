function randomName() {
  const animals = ["Tiger", "Panda", "Dolphin", "Falcon", "Wolf"];
  const colors = ["Blue", "Red", "Green", "Purple", "Silver"];
  return colors[Math.floor(Math.random() * colors.length)] +
         animals[Math.floor(Math.random() * animals.length)];
}

function randomColor() {
  const palette = ["#6C63FF", "#FF6584", "#3DC1D3", "#F8A978", "#43A047"];
  return palette[Math.floor(Math.random() * palette.length)];
}

module.exports = { randomName, randomColor };
