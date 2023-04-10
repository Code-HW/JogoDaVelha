import React, { useEffect, useState } from "react";
import Square from "../components/square";
import "./style.css";

const winer = [
  ["a", "b", "c"],
  ["d", "e", "f"],
  ["g", "h", "i"],
  ["a", "d", "g"],
  ["b", "e", "h"],
  ["c", "f", "i"],
  ["a", "e", "i"],
  ["c", "e", "g"],
];

const boardDefaultValues = {
  state: true,
  playerWiner: null,
  fieldsWiner: null,
  lastPlayer: null,
  fileds: {
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
    f: null,
    g: null,
    h: null,
    i: null,
  },
};

const checkWiner = (board) => {
  const fieldVictory = winer.find(
    ([fieldOne, fieldTwo, fieldThree]) =>
      (board[fieldOne], board[fieldTwo], board[fieldThree]) &&
      board[fieldOne] === board[fieldTwo] &&
      board[fieldTwo] === board[fieldThree]
  );

  return {
    fields: fieldVictory,
    player: fieldVictory && board[fieldVictory[0]],
  };
};

//componentizar
function Home() {
  const [player, setPlayer] = useState("X");
  const [board, setBoard] = useState(boardDefaultValues);

  const handleClick = (id) => {
    if (!player) {
      window.alert("Selecione um jogador!");
      return;
    }

    if (player === board.lastPlayer) {
      window.alert("Jogada repedida!");
      return;
    }

    if (board.fileds[id]) {
      window.alert("Campo ja preenchido!");
      return;
    }

    setBoard({
      ...board,
      lastPlayer: player,
      fileds: { ...board.fileds, [id]: player },
    });
  };

  /* const handleChangeSelect = (e) => {
    setPlayer(e.target.value);
  }; */

  const handleResetBoard = () => {
    setBoard(boardDefaultValues);
  };

  useEffect(() => {
    if (!board.state) return;

    const result = checkWiner(board.fileds);

    if (player === board.lastPlayer) {
      setPlayer(player === "X" ? "O" : "X");
    }

    if (result.player) {
      setBoard({
        ...board,
        state: false,
        playerWiner: result.player,
        fieldsWiner: result.fields,
      });

      console.log(`O jogador ${result.player} ganhou o jogo!`);
      return;
    }

    if (Object.values(board.fileds).every((x) => x)) {
      setBoard({
        ...board,
        state: false,
        playerWiner: "V",
      });
      console.log(`O jogo deu velha!`);
    }
  }, [board]);

  return (
    <div className="container">
      <div className="status">
        <button className="reset" onClick={handleResetBoard}>
          REINICIAR
        </button>
        {/* <select disabled={player} onChange={handleChangeSelect} value={player}>
          <option value="">Esolha o Jogador</option>
          <option value="X">Jogador X</option>
          <option value="O">Jogador O</option>
        </select> */}
        {player ? <span>Jogador {player} </span> : null}
      </div>
      <div className="board">
        {Object.keys(board.fileds).map((key, index) => (
          <Square
            color={
              !board.state &&
              board.fieldsWiner?.find((x) => x === key) &&
              "green"
            }
            value={board.fileds[key]}
            id={`field-${key}`}
            key={`field-${key}`}
            event={() => board.state && handleClick(key)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
