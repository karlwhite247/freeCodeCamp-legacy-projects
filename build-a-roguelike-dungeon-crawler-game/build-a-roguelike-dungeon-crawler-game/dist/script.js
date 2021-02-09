//creates a random number between 1 and num
function randomNum(num) {
  return Math.floor(Math.random() * num);
}

function distance(p1, p2) {
  let xDiffSqr = Math.pow(p1[0] - p2[0], 2);
  let yDiffSqr = Math.pow(p1[1] - p2[1], 2);
  return Math.sqrt(xDiffSqr + yDiffSqr);
}

// Global Variables:
let ENEMY_HEALTH = [40, 50, 60, 70];
let ENEMY_HEALTH_VAR = 20;
let ENEMY_ATTACK = [10, 15, 20, 25];
let ENEMY_ATTACK_VAR = 5;
let BOSS_HEALTH = [100, 150, 200, 250];
let BOSS_HEALTH_VAR = 30;
let BOSS_ATTACK = [15, 25, 35, 45];
let BOSS_ATTACK_VAR = 10;
let WEAPONS = {
  0: { name: "Fists", attack: "15" },
  1: { name: "Dagger", attack: "30" },
  2: { name: "Sword", attack: "45" },
  3: { name: "Pistol", attack: "60" },
  4: { name: "Tank", attack: "75" }
};
let VIS_DISTANCE = 7;

class Cell extends React.Component {
  constructor() {
    super();
  }
  render() {
    let options = {
      0: "wall",
      1: "space",
      2: "player",
      3: "health",
      4: "item",
      5: "enemy",
      6: "boss",
      7: "hiddenCell"
    };
    let cellType = options[this.props.cellType];
    return <div className={cellType}></div>;
  }
}

class Row extends React.Component {
  constructor() {
    super();
  }
  render() {
    let row = [];
    for (let i = 0; i < this.props.dungeonRow.length; i++) {
      if (this.props.visRow[i] || !this.props.darkness) {
        row.push(<Cell cellType={this.props.dungeonRow[i]} />);
      } else {
        row.push(<Cell cellType={7} />);
      }
    }
    return <div className="row">{row}</div>;
  }
}

class Dungeon extends React.Component {
  constructor() {
    super();
  }

  dungeonToJsx(dungeon, visibility) {
    let jsxDungeon = [];
    for (let i = 0; i < dungeon.length; i++) {
      let row = dungeon[i];
      let visRow = visibility[i];
      jsxDungeon.push(
        <Row dungeonRow={row} visRow={visRow} darkness={this.props.darkness} />
      );
    }
    return jsxDungeon;
  }

  handleKeyDown(e) {
    this.props.handleKeyDown(e);
  }

  render() {
    let dungeon = this.props.dungeon;
    let visibility = this.props.visibility;
    let jsxDungeon = this.dungeonToJsx(dungeon, visibility);
    return (
      <div
        className="dungeon"
        tabIndex="0"
        onKeyDown={this.handleKeyDown.bind(this)}
      >
        {jsxDungeon}
      </div>
    );
  }
}

class Stats extends React.Component {
  constructor() {
    super();
  }
  render() {
    let enemyClass;
    let enemyHealth;
    let bossClass;
    let bossHealth;
    if (this.props.activeEnemy == undefined) {
      enemyClass = "display-none";
      enemyHealth = "";
    } else {
      enemyClass = "enemy-stats";
      enemyHealth = this.props.enemies[this.props.activeEnemy].health;
    }
    if (this.props.bossActive) {
      bossClass = "enemy-stats";
      bossHealth = this.props.boss.health;
    } else {
      bossClass = "display-none";
      bossHealth = "";
    }
    return (
      <div className="stats">
        <p className="health-stat">Health: {this.props.health}</p>
        <p>Weapon: {WEAPONS[this.props.currentWeapon].name}</p>
        <p>Attack: {WEAPONS[this.props.currentWeapon].attack}</p>
        <p>XP: {this.props.XP}</p>
        <p>Player Level: {Math.floor(this.props.XP / 100) + 1}</p>
        <p className={enemyClass}>Enemy Health: {enemyHealth}</p>
        <p className={bossClass}>Boss Health: {bossHealth}</p>
      </div>
    );
  }
}

class Buttons extends React.Component {
  constructor() {
    super();
  }

  restartHandler() {
    this.props.restart();
  }

  toggleHandler() {
    this.props.toggleDarkness();
  }

  render() {
    return (
      <div className="button-row">
        <button onClick={this.restartHandler.bind(this)}>Restart</button>
        <p>Level: {this.props.level + 1}</p>
        <button onClick={this.toggleHandler.bind(this)}>Toggle Darkness</button>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.setLevel(0, 0, 0);
  }

  setLevel(level, currentWeapon, XP) {
    //create Dungeon
    let dungeon = this.createDungeon();

    // Place player
    let playerLoc = this.spawnSomething(dungeon);
    dungeon[playerLoc[0]][playerLoc[1]] = 2;

    //create Visibility array
    let visibility = this.createVisibility(playerLoc);

    // place Health
    for (let i = 0; i < 8; i++) {
      let loc = this.spawnSomething(dungeon);
      dungeon[loc[0]][loc[1]] = 3;
    }

    // Place Weapon
    let loc = this.spawnSomething(dungeon);
    dungeon[loc[0]][loc[1]] = 4;

    // Place Enemies
    let enemies = {};
    for (let i = 0; i < 8; i++) {
      let loc = this.spawnSomething(dungeon);
      dungeon[loc[0]][loc[1]] = 5;
      let health = ENEMY_HEALTH[level] + randomNum(ENEMY_HEALTH_VAR);
      let attack = ENEMY_ATTACK[level] + randomNum(ENEMY_ATTACK_VAR);
      enemies[loc.toString()] = { health: health, attack: attack };
    }

    // Place Boss
    let bossLoc = this.spawnSomething(dungeon);
    dungeon[bossLoc[0]][bossLoc[1]] = 6;
    let bossHealth = BOSS_HEALTH[level] + randomNum(BOSS_HEALTH_VAR);
    let bossAttack = BOSS_ATTACK[level] + randomNum(BOSS_ATTACK_VAR);
    let boss = { health: bossHealth, attack: bossAttack };

    this.state = {
      dungeon: dungeon,
      visibility: visibility,
      darkness: true,
      playerLoc: playerLoc,
      enemies: enemies,
      activeEnemy: undefined,
      boss: boss,
      bossActive: false,
      health: 100,
      level: level,
      currentWeapon: currentWeapon,
      XP: XP
    };
  }

  createDungeon() {
    // Creates a dungeon map with numbers representing walls, space etc.
    /*** 
    Each position in the dungeon is represented by a number:
    0: wall
    1: room or passage  2: player
    3: health           4: item
    5: enemy            6: boss
    ***/
    let dungeon = [];
    for (let i = 0; i < this.props.dungeonDim[0]; i++) {
      let row = [];
      for (let j = 0; j < this.props.dungeonDim[1]; j++) {
        if (
          i === 0 ||
          i + 1 === this.props.dungeonDim[0] ||
          j === 0 ||
          j + 1 === this.props.dungeonDim[1]
        ) {
          row.push(0);
        } else {
          row.push(1);
        }
      }
      dungeon.push(row);
    }

    let walls = 0;
    while (walls < this.props.dungeonDim[0] / 3) {
      dungeon = this.addWall(dungeon);
      walls++;
    }
    return dungeon;
  }

  addWall(dungeon) {
    let wallDir = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ][randomNum(4)];
    let pos = [
      randomNum(this.props.dungeonDim[0] / 2) * 2,
      randomNum(this.props.dungeonDim[1] / 2) * 2
    ];
    let nextPos = [pos[0] + wallDir[0], pos[1] + wallDir[1]];

    // While the position is not a wall
    // or the next position is not in the dungeon
    // or the next position is a wall
    while (
      dungeon[pos[0]][pos[1]] === 1 ||
      !this.isInDungeon(nextPos) ||
      dungeon[(nextPos[0], nextPos[1])] === 0
    ) {
      pos = [
        randomNum(this.props.dungeonDim[0] / 2) * 2,
        randomNum(this.props.dungeonDim[1] / 2) * 2
      ];
      nextPos = [pos[0] + wallDir[0], pos[1] + wallDir[1]];
    }

    pos = [nextPos[0], nextPos[1]];
    nextPos[0] += wallDir[0];
    nextPos[1] += wallDir[1];

    // While the wall hasn't hit another wall
    while (dungeon[nextPos[0]][nextPos[1]] === 1) {
      dungeon[pos[0]][pos[1]] = 0;
      pos = [nextPos[0], nextPos[1]];
      nextPos[0] += wallDir[0];
      nextPos[1] += wallDir[1];
    }
    return dungeon;
  }

  isInDungeon(pos) {
    return (
      pos[0] >= 0 &&
      pos[0] < this.props.dungeonDim[0] &&
      pos[1] >= 0 &&
      pos[1] < this.props.dungeonDim[1]
    );
  }

  createVisibility(playerLoc) {
    let visibility = [];
    for (let i = 0; i < this.props.dungeonDim[0]; i++) {
      let row = [];
      for (let j = 0; j < this.props.dungeonDim[1]; j++) {
        if (distance(playerLoc, [i, j]) < VIS_DISTANCE) {
          row.push(true);
        } else {
          row.push(false);
        }
      }
      visibility.push(row);
    }
    return visibility;
  }

  spawnSomething(dungeon) {
    let loc = [
      randomNum(this.props.dungeonDim[0]),
      randomNum(this.props.dungeonDim[1])
    ];
    while (dungeon[loc[0]][loc[1]] !== 1) {
      loc = [
        randomNum(this.props.dungeonDim[0]),
        randomNum(this.props.dungeonDim[1])
      ];
    }
    return loc;
  }

  handleKeyDown(e) {
    e.preventDefault();
    switch (e.key) {
      case "ArrowUp":
        this.playerAction([0, -1]);
        break;
      case "ArrowDown":
        this.playerAction([0, 1]);
        break;
      case "ArrowLeft":
        this.playerAction([-1, 0]);
        break;
      case "ArrowRight":
        this.playerAction([1, 0]);
        break;
    }
  }

  playerAction(dir) {
    let dungeon = this.state.dungeon;
    let playerLoc = this.state.playerLoc;
    let newLoc = [playerLoc[0] + dir[0], playerLoc[1] + dir[1]];
    let visibility = this.state.visibility;

    if (dungeon[newLoc[0]][newLoc[1]] === 1) {
      // newLoc is Empty Space
      movePlayer();
      this.setState({
        dungeon: dungeon,
        playerLoc: playerLoc,
        activeEnemy: undefined,
        bossActive: false,
        visibility: visibility
      });
    } else if (dungeon[newLoc[0]][newLoc[1]] === 3) {
      // newLoc is Health
      movePlayer();
      let health = this.state.health + randomNum(10) + 20;
      this.setState({
        dungeon: dungeon,
        playerLoc: playerLoc,
        health: health,
        activeEnemy: undefined,
        bossActive: false,
        visibility: visibility
      });
    } else if (dungeon[newLoc[0]][newLoc[1]] === 4) {
      // newLoc is Weapon
      movePlayer();
      let weapon = this.state.currentWeapon + 1;
      this.setState({
        dungeon: dungeon,
        playerLoc: playerLoc,
        currentWeapon: weapon,
        activeEnemy: undefined,
        bossActive: false,
        visibility: visibility
      });
    } else if (dungeon[newLoc[0]][newLoc[1]] === 5) {
      // newLoc is Enemy
      let playerHealth =
        this.state.health - this.state.enemies[newLoc.toString()].attack;
      let enemies = this.state.enemies;
      enemies[newLoc.toString()].health -=
        WEAPONS[this.state.currentWeapon].attack;
      let XP =
        this.state.XP + parseInt(WEAPONS[this.state.currentWeapon].attack);
      let activeEnemy = newLoc.toString();
      if (playerHealth <= 0) {
        alert("You Loose :( Try Again.");
        this.restart();
      } else {
        if (enemies[newLoc.toString()].health <= 0) {
          movePlayer();
          delete enemies[newLoc.toString()];
          activeEnemy = undefined;
        }
        this.setState({
          dungeon: dungeon,
          playerLoc: playerLoc,
          health: playerHealth,
          enemies: enemies,
          activeEnemy: activeEnemy,
          bossActive: false,
          visibility: visibility,
          XP: XP
        });
      }
    } else if (dungeon[newLoc[0]][newLoc[1]] === 6) {
      // newLoc is Boss
      let playerHealth = this.state.health - this.state.boss.attack;
      let boss = this.state.boss;
      boss.health -= WEAPONS[this.state.currentWeapon].attack;
      let XP =
        this.state.XP + parseInt(WEAPONS[this.state.currentWeapon].attack);
      if (boss.health <= 0) {
        movePlayer();
        if (this.state.level === 3) {
          let playerLevel = Math.floor(XP / 100) + 1;
          setTimeout(function () {
            alert("YOU WIN with a level of " + playerLevel + "!!!");
          }, 50);
        } else {
          setTimeout(function () {
            alert("You beat the boss! Go to the next level.");
          }, 50);
          let level = this.state.level + 1;
          this.setState({ level: level });
          this.setLevel(level, this.state.currentWeapon, XP);
        }
      } else {
        this.setState({
          dungeon: dungeon,
          playerLoc: playerLoc,
          health: playerHealth,
          boss: boss,
          activeEnemy: undefined,
          bossActive: true,
          visibility: visibility,
          XP: XP
        });
      }
    }

    function movePlayer() {
      dungeon[playerLoc[0]][playerLoc[1]] = 1;
      playerLoc[0] += dir[0];
      playerLoc[1] += dir[1];
      dungeon[playerLoc[0]][playerLoc[1]] = 2;
      updateVisibility();
    }

    function updateVisibility() {
      for (let i = 0; i < dungeon.length; i++) {
        for (let j = 0; j < dungeon[0].length; j++) {
          if (distance(playerLoc, [i, j]) < VIS_DISTANCE) {
            visibility[i][j] = true;
          }
        }
      }
    }
  }

  restart() {
    this.setState({ level: 0 });
    this.setLevel(0, 0, 0);
  }

  toggleDarkness() {
    let darkness = !this.state.darkness;
    this.setState({ darkness: darkness });
  }

  render() {
    return (
      <div>
        <Buttons
          restart={this.restart.bind(this)}
          toggleDarkness={this.toggleDarkness.bind(this)}
          level={this.state.level}
        />
        <Stats
          enemies={this.state.enemies}
          activeEnemy={this.state.activeEnemy}
          boss={this.state.boss}
          bossActive={this.state.bossActive}
          health={this.state.health}
          currentWeapon={this.state.currentWeapon}
          XP={this.state.XP}
        />
        <Dungeon
          dungeon={this.state.dungeon}
          visibility={this.state.visibility}
          darkness={this.state.darkness}
          handleKeyDown={this.handleKeyDown.bind(this)}
        />
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <Game dungeonDim={[121, 61]} />;
  }
}

ReactDOM.render(<App />, document.getElementById("app"));