class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      boardData: [],
      generation: 0,
      timer: null
    };
  }
  componentWillMount() {
    this.setState({ boardData: this.createBoard("random") });
  }
  componentDidMount() {
    this.state.timer = setInterval(
      this.updateBoard.bind(this),
      this.props.delay
    );
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  createBoard(type) {
    let BoardData = [];
    let { NumOfRows, NumOfCols } = this.props;
    for (let r = 0; r < NumOfRows; r++) {
      let rowData = [];
      let alive;
      for (let c = 0; c < NumOfCols; c++) {
        if (type == "random") {
          alive = Math.round(Math.random()) === 0 ? false : true;
        } else if (type == "empty") {
          alive = false;
        }
        rowData.push({ rowId: r, colId: c, alive: alive, isNew: false });
      }
      BoardData.push(rowData);
    }
    return BoardData;
  }
  updateBoard() {
    let newBoard = [];
    let { NumOfRows, NumOfCols } = this.props;
    for (let r = 0; r < NumOfRows; r++) {
      let rowData = [];
      for (let c = 0; c < NumOfCols; c++) {
        rowData.push(this.updateCell(r, c));
      }
      newBoard.push(rowData);
    }
    this.setState({
      boardData: newBoard,
      generation: this.state.generation + 1
    });
  }
  updateCell(r, c) {
    let { NumOfRows, NumOfCols } = this.props;
    let curBoard = this.state.boardData;
    let activeNeighbour = 0;
    let alive = curBoard[r][c].alive;
    let isNew = curBoard[r][c].isNew;
    let neighbourIndices = [
      [r - 1, c - 1],
      [r - 1, c],
      [r - 1, c + 1],
      [r, c - 1],
      [r, c + 1],
      [r + 1, c - 1],
      [r + 1, c],
      [r + 1, c + 1]
    ];
    // get all valid neighbours
    neighbourIndices = neighbourIndices.filter((index) => {
      return (
        index[0] >= 0 &&
        index[0] != NumOfRows &&
        index[1] >= 0 &&
        index[1] != NumOfCols
      );
    });
    let neighbours = neighbourIndices.map(
      (index) => curBoard[index[0]][index[1]]
    );
    // count activeNeighbour
    neighbours.forEach((neighbour) => {
      if (neighbour.alive) {
        activeNeighbour++;
      }
    });
    // determine the alive and new status
    if (alive) {
      // currently alive
      isNew = false;
      if (activeNeighbour === 2 || activeNeighbour === 3) {
        alive = true;
      } else {
        alive = false;
      }
    } else {
      // currently dead
      isNew = false;
      if (activeNeighbour === 3) {
        // new-born
        alive = true;
        isNew = true;
      }
    }
    return { rowId: r, colId: c, alive: alive, isNew: isNew };
  }
  handleCellClick(coordinates) {
    let boardData = this.state.boardData.slice();
    let [r, c] = coordinates;
    if (boardData[r][c].alive) {
      boardData[r][c].alive = false;
      boardData[r][c].isNew = false;
    } else {
      boardData[r][c].alive = true;
      boardData[r][c].isNew = true;
    }
    this.setState({ boardData: boardData });
  }
  handleWidgetClick(type) {
    switch (type) {
      case "Run":
        if (this.state.timer) {
          // to avoid setInterval's accumulation
          clearInterval(this.state.timer);
        }
        this.state.timer = setInterval(
          this.updateBoard.bind(this),
          this.props.delay
        );
        break;
      case "Pause":
        clearInterval(this.state.timer);
        break;
      case "Clear":
        clearInterval(this.state.timer);
        this.setState({ boardData: this.createBoard("empty"), generation: 0 });
        break;
      case "Restart":
        this.setState({ boardData: this.createBoard("random"), generation: 0 });
        if (this.state.timer) {
          clearInterval(this.state.timer);
        }
        this.state.timer = setInterval(
          this.updateBoard.bind(this),
          this.props.delay
        );
        break;
    }
  }
  render() {
    return (
      <div>
        <div className="controls">
          <Widget
            type="Run"
            onWidgetClick={(type) => this.handleWidgetClick(type)}
          />
          <Widget
            type="Pause"
            onWidgetClick={(type) => this.handleWidgetClick(type)}
          />
          <Widget
            type="Clear"
            onWidgetClick={(type) => this.handleWidgetClick(type)}
          />
          <Widget
            type="Restart"
            onWidgetClick={(type) => this.handleWidgetClick(type)}
          />
        </div>
        <Display generation={this.state.generation} />
        <Board
          boardData={this.state.boardData}
          onCellClick={(coordinates) => this.handleCellClick(coordinates)}
        />
      </div>
    );
  }
}

const Widget = (props) => (
  <div className="btn" onClick={() => props.onWidgetClick(props.type)}>
    {props.type}
  </div>
);

const Display = (props) => (
  <div className="display">Generation: {props.generation}</div>
);

const Board = (props) => (
  <div className="board">
    {props.boardData.map((row, index) => (
      <Row
        key={index}
        rowData={row}
        onCellClick={(coordinates) => props.onCellClick(coordinates)}
      />
    ))}
  </div>
);

const Row = (props) => (
  <div className="row">
    {props.rowData.map((cell) => (
      <Cell
        key={cell.rowId + "-" + cell.colId}
        {...cell}
        onCellClick={(coordinates) => props.onCellClick(coordinates)}
      />
    ))}
  </div>
);

const Cell = (props) => {
  let { rowId, colId, alive, isNew } = props;
  let className = classNames({
    cell: true,
    alive: alive,
    new: isNew
  });
  return (
    <div
      className={className}
      onClick={() => props.onCellClick([rowId, colId])}
    />
  );
};

ReactDOM.render(
  <Game NumOfRows={40} NumOfCols={70} delay={100} />,
  document.getElementById("root")
);
