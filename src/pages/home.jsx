import { useEffect, useState } from "react";
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

const getOpposite = (player) => (player === "X" ? "O" : "X");

const getFields = (fields, val) =>
  Object.keys(
    Object.fromEntries(
      Object.entries(fields).filter(([key, value]) => value === val)
    )
  );

const ramdowPlay = ({ fildsAvailable }) => {
  return fildsAvailable[Math.floor(Math.random() * fildsAvailable.length)];
};

const checkPreWiner = (fildsAvailable, fildsCheck) => {
  let field = null;

  winer.forEach(([fieldOne, fieldTwo, fieldThree]) => {
    const oneCheck = fildsCheck.includes(fieldOne);
    const TwoCheck = fildsCheck.includes(fieldTwo);
    const ThreeCheck = fildsCheck.includes(fieldThree);

    if (oneCheck && TwoCheck && fildsAvailable.includes(fieldThree)) {
      field = fieldThree;
    }

    if (oneCheck && ThreeCheck && fildsAvailable.includes(fieldTwo)) {
      field = fieldTwo;
    }

    if (ThreeCheck && TwoCheck && fildsAvailable.includes(fieldOne)) {
      field = fieldOne;
    }
  });

  return field;
};

const winPlay = ({ fildsAvailable, fildsPlayer }) => {
  return checkPreWiner(fildsAvailable, fildsPlayer);
};

const blockPlay = ({ fildsAvailable, fildsOponent }) => {
  return checkPreWiner(fildsAvailable, fildsOponent);
};

const machinePlays = [winPlay, blockPlay, ramdowPlay];

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
  const player = getOpposite(board.lastPlayer);
  const fields = {
    player: player,
    filds: board.fields,
    fildsAvailable: getFields(board.fields, null),
    fildsPlayer: getFields(board.fields, player),
    fildsOponent: getFields(board.fields, board.lastPlayer),
  };

  const filedPlay = machinePlays.find((action) => action(fields))(fields);

  return filedPlay;
};

const colors = {
  v: "red",
  oponent: "red",
  player: "green",
};

//componentizar
function Home() {
  const [player, setPlayer] = useState("X");
  const [board, setBoard] = useState(boardDefaultValues);
  const [modalText, setModalText] = useState("");

  const colorWinner =
    board.playerWiner === "V"
      ? colors.v
      : board.playerWiner === player
      ? colors.player
      : colors.oponent;

  const machine = getOpposite(player);

  const handleClick = (id) => {
    if (!player) {
      setModalText("Selecione um jogador!");
      return;
    }

    if (player === board.lastPlayer) {
      setModalText("Jogada repedida!");
      return;
    }

    if (board.fields[id]) {
      setModalText("Campo ja preenchido!");
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
      setPlayer(machine);
    }

    console.log(colorWinner);

    if (result.player) {
      setBoard({
        ...board,
        state: false,
        playerWiner: result.player,
        fieldsWiner: result.fields,
      });

      if (board.gameMode === "M") {
        if (result.player === player) {
          setModalText(`O jogador ${result.player} ganhou!`);
        } else {
          setModalText(`A Maquina ganhou!`);
        }
      }

      if (board.gameMode === "P") {
        setModalText(`O jogador ${result.player} ganhou!`);
      }
      return;
    }

    if (Object.values(board.fields).every((x) => x)) {
      setBoard({
        ...board,
        state: false,
        playerWiner: "V",
      });
      setModalText(`O jogo deu velha!`);
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
  }, [board, modalText, machine, player]);

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
      <Modal
        text={modalText}
        color={colorWinner}
        closeModal={() => setModalText("")}
      />
    </div>
  );
}

const Modal = ({ text, color, closeModal }) => {
  if (text) {
    return (
      <div className="modal">
        <p style={{ color: color }}>{text}</p>
        <button className="close-modal" onClick={closeModal}>
          close
        </button>
      </div>
    );
  }

  return null;
};

export default Home;
