/**
1. Wait for the player to click start
2. Add a random number to the sequence
3. Play the sequence to the player
4. Enable player interaction and register any clicks on Simon buttons
5. Wait for player input while the number of clicks is less than 20
6. Notify of error is player presses the wrong button, and start that series of button presses again
7. Notify of victory if the player answers 20 steps correct
*/
const sounds = [
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
];

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = Redux.createStore(app);

function app(state, action) {
  const initialState = {
    sequence: [],
    playerSequence: [],
    simon: [0, 1, 2, 3],
    active: [false, false, false, false],
    win: 20,
    turn: 0,
    start: false,
    interaction: false,
    playing: false,
    notice: false,
    strict: false
  };

  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    case "TILE_CLICK":
      if (!state.interaction) return state; // interaction is disabled

      let isCorrect = state.sequence[state.playerSequence.length] == action.id;
      if (isCorrect) {
        if (state.playerSequence.length != state.turn) {
          // Wait for player input while number of clicks is less than sequence length
          return Object.assign({}, state, {
            playerSequence: state.playerSequence.concat(action.id)
          });
        } else if (state.sequence.length == state.win) {
          // Victory
          return Object.assign({}, state, {
            notice: { code: 1, message: "" },
            interaction: false
          });
        }
        // Start next turn
        return Object.assign({}, state, {
          turn: state.turn + 1,
          playerSequence: [],
          interaction: false
        });
      }
      // Notify of error
      return Object.assign({}, state, {
        notice: { code: 0, message: "!!" },
        playerSequence: [],
        interaction: false
      });

    case "TOGGLE_TILE":
      let active = [0, 0, 0, 0];
      active[action.id] = !state.active[action.id];
      return Object.assign({}, state, { active: active });

    case "START_PLAYING":
      return Object.assign({}, state, { playing: true });

    case "STOP_PLAYING":
      return Object.assign({}, state, { playing: false });

    case "START_SEQUENCE":
      return Object.assign({}, state, {
        sequence: state.sequence.concat([getRandomArrayItem(state.simon)])
      });

    case "ENABLE_INTERACTION":
      return Object.assign({}, state, { interaction: true });

    case "DISABLE_INTERACTION":
      return Object.assign({}, state, { interaction: false });

    case "TOGGLE_START":
      if (state.start) return initialState;
      return Object.assign({}, state, {
        sequence: state.sequence.concat([getRandomArrayItem(state.simon)]),
        start: true
      });

    case "TOGGLE_STRICT":
      return Object.assign({}, state, { strict: !state.strict });

    case "CLEAR_NOTICE":
      return Object.assign({}, state, { notice: false });

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}

const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const Controls = ({
  start,
  onStartStop,
  toggleStrict,
  active,
  notice,
  turn,
  strict
}) => (
  <div className="controls">
    <h1>SIMON</h1>

    <div className="flex-center">
      <span className="controls__label">start</span>
      <button
        className={
          "controls__button controls__button--start " +
          (start ? "active" : "inactive")
        }
        onClick={onStartStop}
      ></button>
      <span className="controls__label">strict</span>
      <button
        className={
          "controls__button controls__button--strict " +
          (strict ? "active" : "inactive")
        }
        onClick={toggleStrict}
      ></button>
    </div>

    <div>
      <div
        className={"status status--" + (notice ? notice.code : "turn-" + turn)}
      >
        {notice ? notice.message : start ? turn + 1 : "--"}
      </div>
    </div>
  </div>
);

class Soundtile extends React.Component {
  constructor(props) {
    super(props);
  }

  playSound(id) {
    sounds[id].currentTime = 0;
    sounds[id].play();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.active !== this.props.active ||
      nextProps.interaction != this.props.interaction
    );
  }

  render() {
    if (this.props.interaction) {
      return (
        <div
          className={"soundtile soundtile--" + this.props.id}
          onClick={() => {
            this.playSound(this.props.id);
            this.props.onClick();
          }}
        ></div>
      );
    } else {
      return (
        <div
          className={
            "disabled soundtile soundtile--" +
            this.props.id +
            (this.props.active ? " active" : "")
          }
        ></div>
      );
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  playSequenceRecursive(sequence, acceleration) {
    if (sequence.length) {
      setTimeout(() => {
        let item = sequence.shift();
        sounds[item].play();
        this.props.toggleTile(item);
        setTimeout(() => {
          this.props.toggleTile(item);
        }, 500 * acceleration);

        if (sequence.length) {
          this.playSequenceRecursive(sequence, acceleration);
        } else {
          // activate player interaction
          setTimeout(() => {
            this.props.enableInteraction();
          }, 500 * acceleration);
          setTimeout(() => {
            this.props.stopPlaying();
          }, 500 * acceleration);
        }
      }, 1000 * acceleration);
    }
  }

  getAcceleration() {
    let turn = this.props.data.turn;

    return turn <= 5 ? 1 : turn <= 9 ? 0.8 : turn <= 13 ? 0.6 : 0.5;
  }

  startPlaying() {
    this.props.startPlaying();
    this.playSequenceRecursive(
      this.props.data.sequence.slice(),
      this.getAcceleration()
    );
  }

  render() {
    const data = this.props.data;

    if (!data.playing && !data.interaction && data.start) {
      const turn = data.turn,
        sequenceLength = data.sequence.length,
        playerMoves = data.playerSequence.length;

      // Notify of error is player presses the wrong button, and start that series of button presses again
      if (data.notice && data.notice.code == 0) {
        if (data.strict) {
          setTimeout(() => {
            this.props.resetGame();
          }, 2000);
        } else {
          this.startPlaying();
          setTimeout(() => {
            this.props.clearNotice();
          }, sequenceLength * 1000);
        }
      }

      // Notify of victory if the player answers 20 steps correct
      else if (data.notice && data.notice.code == 1) {
        setTimeout(() => {
          this.props.resetGame();
        }, 3000);
      }

      // User interaction done; start new sequence
      else if (0 == playerMoves && turn == sequenceLength) {
        this.props.startSequence();
      }

      // Play the sequence to the player
      else if (sequenceLength > turn) {
        this.startPlaying();
      }
    }

    return (
      <div className="simon">
        {data.simon.map((tile, i) => (
          <Soundtile
            id={i}
            active={data.active[i]}
            interaction={data.interaction}
            {...tile}
            onClick={() => this.props.onTileClick(i)}
          />
        ))}
        <Controls
          start={data.start}
          onStartStop={() => this.props.onStartStop()}
          toggleStrict={() => this.props.toggleStrict()}
          notice={data.notice}
          turn={data.turn}
          strict={data.strict}
        />
      </div>
    );
  }
}

function render() {
  ReactDOM.render(
    <App
      data={store.getState()}
      onTileClick={(id) =>
        store.dispatch({
          type: "TILE_CLICK",
          id: id
        })
      }
      toggleTile={(id) =>
        store.dispatch({
          type: "TOGGLE_TILE",
          id: id
        })
      }
      onStartStop={() =>
        store.dispatch({
          type: "TOGGLE_START"
        })
      }
      toggleStrict={() =>
        store.dispatch({
          type: "TOGGLE_STRICT"
        })
      }
      enableInteraction={() =>
        store.dispatch({
          type: "ENABLE_INTERACTION"
        })
      }
      disableInteraction={() =>
        store.dispatch({
          type: "DISABLE_INTERACTION"
        })
      }
      startSequence={() =>
        store.dispatch({
          type: "START_SEQUENCE"
        })
      }
      startPlaying={() =>
        store.dispatch({
          type: "START_PLAYING"
        })
      }
      stopPlaying={() =>
        store.dispatch({
          type: "STOP_PLAYING"
        })
      }
      clearNotice={() =>
        store.dispatch({
          type: "CLEAR_NOTICE"
        })
      }
      resetGame={() =>
        store.dispatch({
          type: "RESET_GAME"
        })
      }
    />,
    document.getElementById("root")
  );
}

render();
store.subscribe(render);