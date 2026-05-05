const board = document.querySelector("#board");
const levelNode = document.querySelector("#level");
const gridSizeNode = document.querySelector("#grid-size");
const scoreNode = document.querySelector("#score");
const difficultyNode = document.querySelector("#difficulty-label");
const messageNode = document.querySelector("#message");
const feedbackNode = document.querySelector(".feedback");
const restartButton = document.querySelector("#restart");

const state = {
  level: 1,
  score: 0,
  targetIndex: 0,
  locked: false,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function getGridSize(level) {
  return clamp(Math.floor((level + 3) / 2), 2, 10);
}

function getColorGap(level) {
  return clamp(34 - level * 1.7, 7, 30);
}

function createRoundColors(level) {
  const hue = randomInt(360);
  const saturation = 54 + randomInt(20);
  const lightness = 42 + randomInt(18);
  const gap = getColorGap(level);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const alternateLightness = clamp(lightness + gap * direction, 25, 76);

  return {
    base: `hsl(${hue} ${saturation}% ${lightness}%)`,
    odd: `hsl(${hue} ${saturation}% ${alternateLightness}%)`,
    gap,
  };
}

function getDifficultyText(level, gap) {
  if (level < 4) return "Цвета пока заметно разные";
  if (level < 8) return "Оттенки становятся ближе";
  if (gap > 10) return "Нужен спокойный взгляд";
  return "Почти одинаковые цвета";
}

function updateStats(gridSize, gap) {
  levelNode.textContent = state.level;
  scoreNode.textContent = state.score;
  gridSizeNode.textContent = `${gridSize} x ${gridSize}`;
  difficultyNode.textContent = getDifficultyText(state.level, gap);
}

function setMessage(text, mode) {
  messageNode.textContent = text;
  feedbackNode.classList.toggle("is-good", mode === "good");
  feedbackNode.classList.toggle("is-bad", mode === "bad");
}

function renderRound() {
  const gridSize = getGridSize(state.level);
  const tileCount = gridSize * gridSize;
  const colors = createRoundColors(state.level);

  state.locked = false;
  state.targetIndex = randomInt(tileCount);
  board.innerHTML = "";
  board.style.setProperty("--grid", gridSize);

  updateStats(gridSize, colors.gap);
  setMessage("Выбери плитку, которая отличается по цвету.");

  for (let index = 0; index < tileCount; index += 1) {
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.type = "button";
    tile.style.background = index === state.targetIndex ? colors.odd : colors.base;
    tile.setAttribute("role", "gridcell");
    tile.setAttribute("aria-label", `Плитка ${index + 1}`);
    tile.addEventListener("click", () => handleTileClick(tile, index));
    board.append(tile);
  }
}

function handleTileClick(tile, index) {
  if (state.locked) return;

  if (index === state.targetIndex) {
    state.locked = true;
    tile.classList.add("correct");
    state.score += state.level * 10;
    state.level += 1;
    setMessage("Верно. Следующий уровень сложнее.", "good");
    scoreNode.textContent = state.score;

    window.setTimeout(renderRound, 520);
    return;
  }

  tile.classList.remove("wrong");
  void tile.offsetWidth;
  tile.classList.add("wrong");
  state.score = Math.max(0, state.score - 5);
  scoreNode.textContent = state.score;
  setMessage("Не эта. Посмотри еще раз.", "bad");
}

function restartGame() {
  state.level = 1;
  state.score = 0;
  renderRound();
}

restartButton.addEventListener("click", restartGame);
renderRound();
