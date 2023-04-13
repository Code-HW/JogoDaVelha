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
  gameMode: "M",
  startedGame: false,
  fields: {
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

const ramdowPlay = (fields) => {
  const fildsAvailable = Object.entries(fields).filter(
    ([key, value]) => value === null
  );

  return fildsAvailable[Math.floor(Math.random() * fildsAvailable.length)][0];
};

/* const winPlay = (fields) => {
  const fildsAvailable = Object.entries(fields).filter(
    ([key, value]) => value === null
  );

  return fildsAvailable[Math.floor(Math.random() * fildsAvailable.length)][0];
}; */

const machinePlays = [ramdowPlay];

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

const machinePlay = (board) => {
  const filedPlay = machinePlays.find((action) => action(board.fields))(
    board.fields
  );

  return filedPlay;
};

//componentizar
function Home() {
  const [player, setPlayer] = useState("X");
  const [board, setBoard] = useState(boardDefaultValues);
  const [modalText, SetModalText] = useState("");
  const [colorMessageModal, SetColorMessageModal] = useState("#000000");

  const machine = player === "X" ? "O" : "X";

  const handleClick = (id) => {
    if (!player) {
      SetModalText("Selecione um jogador!");
      return;
    }

    if (player === board.lastPlayer) {
      SetModalText("Jogada repedida!");
      return;
    }

    if (board.fields[id]) {
      SetModalText("Campo ja preenchido!");
      return;
    }

    setBoard({
      ...board,
      lastPlayer: player,
      startedGame: true,
      fields: { ...board.fields, [id]: player },
    });
  };

  const handleChangePlayerSelect = (e) => {
    setPlayer(e.target.value);
  };

  const handleChangeGameModeSelect = (e) => {
    setBoard({
      ...board,
      gameMode: e.target.value,
    });
  };

  const handleResetBoard = () => {
    setBoard(boardDefaultValues);
  };

  useEffect(() => {
    if (!board.state || !board.gameMode) return;

    const result = checkWiner(board.fields);

    if (board.gameMode === "P" && player === board.lastPlayer) {
      setPlayer(player === "X" ? "O" : "X");
    }

    if (result.player) {
      setBoard({
        ...board,
        state: false,
        playerWiner: result.player,
        fieldsWiner: result.fields,
      });

      SetModalText(`O jogador ${result.player} ganhou o jogo!`);
      SetColorMessageModal("green");
      return;
    }

    if (Object.values(board.fields).every((x) => x)) {
      setBoard({
        ...board,
        state: false,
        playerWiner: "V",
      });
      SetModalText(`O jogo deu velha!`);
      SetColorMessageModal("red");
      return;
    }

    if (board.gameMode === "M" && player === board.lastPlayer) {
      const fieldPlay = machinePlay(board);
      const tmr = setTimeout(() => {
        setBoard({
          ...board,
          lastPlayer: machine,
          fields: { ...board.fields, [fieldPlay]: machine },
        });
      }, 400);
      return () => clearTimeout(tmr);
    }
  }, [board, modalText]);

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="top">
          <div className="header">
            HwCode <br /> Jogo da Velha
          </div>

          <div className="item">
            <p>Modo de jogo: </p>
            <select
              disabled={board.startedGame}
              onChange={handleChangeGameModeSelect}
              value={board.gameMode}
            >
              <option value="M">Jogador vs Maquina</option>
              <option value="P">Jogador vs Jogador</option>
            </select>
          </div>

          <div className="item">
            <p>Jogador: </p>

            <select
              disabled={board.startedGame}
              onChange={handleChangePlayerSelect}
              value={player}
            >
              <option value="X">Jogador X</option>
              <option value="O">Jogador O</option>
            </select>
          </div>
        </div>
        <div className="body"></div>
        <div className="bottom">
          <button className="reset" onClick={handleResetBoard}>
            REINICIAR
          </button>
        </div>
      </aside>
      <div className="board" style={modalText ? { filter: `blur(3px)` } : null}>
        {Object.keys(board.fields).map((key, index) => (
          <Square
            color={
              !board.state &&
              board.fieldsWiner?.find((x) => x === key) &&
              "green"
            }
            value={board.fields[key]}
            id={`field-${key}`}
            key={`field-${key}`}
            event={() => board.state && handleClick(key)}
          />
        ))}
      </div>
      {modalText ? (
        <div className="modal">
          <p style={{ color: colorMessageModal }}>{modalText}</p>
          <button className="close-modal" onClick={() => SetModalText("")}>
            close
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Home;
