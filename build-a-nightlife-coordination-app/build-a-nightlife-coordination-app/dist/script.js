let user = {
  authenticated: true,
  lastSearch: "Portland, OR",
  id: 1
};

let bars = [
  { id: 1, usersGoing: [0, 1, 2, 3, 4] },
  { id: 2, usersGoing: [0, 1, 4] },
  { id: 3, usersGoing: [0, 1, 2] }
];

let exampleData = [
  {
    name: "Jazz Cafe",
    address: "St Mary Street",
    img:
      "https://raw.githubusercontent.com/karlwhite247/testable-projects-fcc/master/images/photo-1554118811-1e0d58224f24.webp",
    id: 1
  },
  {
    name: "Frankies",
    address: "Rulers Way",
    img:
      "https://raw.githubusercontent.com/karlwhite247/testable-projects-fcc/master/images/photo-1577169995124-d7be4d4d9df0.webp",
    id: 2
  },
  {
    name: "Bowling",
    address: "Lexington Avenue",
    img:
      "https://raw.githubusercontent.com/karlwhite247/testable-projects-fcc/master/images/photo-1518620025093-fbca064bdd9a.webp",
    id: 3
  }
];

//Component - TODO: When plugging into router set inner routes as children.
class Home extends React.Component {
  constructor(props) {
    super(props);
    //Todo: Replace body with simply the hero moving up.
    this.state = {
      user: this.props.user,
      ui: {
        plane: "",
        hero: "hero",
        search: "verticalBlock",
        searchWrap: "search"
      },
      display: "home"
    };

    this.toggleAuth = this.toggleAuth.bind(this);
    this.updateUI = this.updateUI.bind(this);
    this.removeUI = this.removeUI.bind(this);
    this.addElement = this.addElement.bind(this);
    this.containsStr = this.containsStr.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
  }

  //Simulated authentication. In production, this would be done
  //using an authentication middleware, like passport.js. However,
  //this is suitable for the purpose of mocking up the front-end.

  updateDisplay(display) {
    this.setState({ display: display });
  }

  toggleAuth() {
    user.authenticated = !user.authenticated;
    this.setState({ user: this.props.user });
  }

  //Tests whether a value is an object.

  isObject(value) {
    if (typeof value !== "object") return false;
    if (value instanceof Array) return false;
    if (value === null) return false;
    return true;
  }

  //Tests whether a string contains a substring.
  containsStr(string, substr) {
    if (string.indexOf(substr) === -1) {
      return false;
    }
    return true;
  }

  //Updates
  addElement(element, value, updatedUI = { ...this.state.ui }) {
    if (typeof updatedUI[element] === "undefined") updatedUI[element] = "";
    if (value instanceof Array) {
      value = value
        .filter((val) => !this.containsStr(updatedUI[element], val))
        .join(" ");
    } else {
      if (this.containsStr(updatedUI[element], value)) return updatedUI;
    }
    if (typeof value === "string") {
      updatedUI[element] = updatedUI[element].concat(" ", value).trim();
    }
    if (updatedUI[element] === "") delete updatedUI[element];

    return updatedUI;
  }

  updateUI(element, value) {
    const add = this.addElement;
    let newUi;

    if (typeof element === "string" && typeof value === "string") {
      newUi = add(element, value);
    }

    if (typeof value === "undefined" && this.isObject(element)) {
      newUi = Object.keys(element).reduce(
        (prev, next) => {
          return add(next, element[next], prev);
        },
        { ...this.state.ui }
      );
    }

    this.setState({ ui: newUi });
  }

  removeUI(element, value) {
    let ui = { ...this.state.ui };
    ui[element] = ui[element].replace(value, "");

    this.setState({ ui: ui });
  }

  render() {
    const ui = this.state.ui;
    const display = this.state.display;
    const updateDisplay = this.updateDisplay;
    const toggleAuth = this.toggleAuth;
    const user = this.props.user;

    return (
      <div>
        <Nav user={user} toggleAuth={toggleAuth} />
        <div className="bodyContent">
          <Hero ui={ui} display={display} />
          <Search
            updateUI={this.updateUI}
            removeUI={this.removeUI}
            display={display}
            updateDisplay={updateDisplay}
            ui={ui}
          />
          {display === "showBars" ? (
            <BarDisplay
              bars={this.props.bars}
              data={this.props.data}
              display={display}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

/* *
 * NAVIGATION COMPONENTS & CONTAINERS
 * */

//Container - TODO: Need to split this into a sub component.
class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  login() {
    const authenticatedUser = this.props.user.authenticated;
    return authenticatedUser ? "LOGOUT" : "LOGIN";
  }

  render() {
    const toggleAuth = this.props.toggleAuth;
    return (
      <header>
        <nav>
          <ul>
            <a href="/">
              <li className="logo-txt"> Rendezvous</li>
            </a>
            <span>
              <a href="#" onClick={toggleAuth}>
                <li> {this.login()}</li>
              </a>
            </span>
          </ul>
        </nav>
      </header>
    );
  }
}

/* *
 * HERO IMAGE COMPONENTS
 * */

//Component
class Hero extends React.Component {
  constructor(props) {
    super(props);
  }

  heroDisplay() {
    const ui = this.props.ui;
    const display = this.props.display;

    if (display === "home") {
      return (
        <div className={ui.hero}>
          <FullLogo ui={ui} />
          <p className="slogan">Meet, Mix, Mingle </p>
        </div>
      );
    }
    if (display === "search") {
      return;
    }
  }

  render() {
    const ui = this.props.ui;
    const display = this.props.display;
    return <div className="heroWrapper">{this.heroDisplay()}</div>;
  }
}

//Component
class FullLogo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const ui = this.props.ui;
    return (
      <div className="fullLogo">
        <h1 className="logo-txt">Rendezvous</h1>
        <div className={ui.plane}>
          <i className="fa fa-paper-plane-o"></i>
        </div>
      </div>
    );
  }
}

/* *
 * SEARCH
 * */

//Conatiner
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {
        topic: ""
      }
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onSearchChange(value) {
    const search = this.state.search;
    if (typeof value === "string") {
      this.setState({ search: { ...search, topic: value } });
    }
  }

  onSearchSubmit(value) {
    const updateUI = this.props.updateUI;
    const updateDisplay = this.props.updateDisplay;
    const search = value.trim();
    const removeUI = this.props.removeUI;

    updateUI({ plane: "planeWrap" });

    setTimeout(() => {
      updateUI({ hero: "moveUp", search: "repositionForm" });
    }, 750);

    setTimeout(() => {
      updateDisplay("search");
    }, 1950);

    setTimeout(() => {
      updateUI("searchWrap", "noGrow");
      updateDisplay("showBars");
    }, 2150);
  }

  componentDidMount() {
    /*ReactDOM.findDOMNode(this.refs.search).focus(); */
  }

  render() {
    const search = this.state.search;
    const ui = this.props.ui;
    return (
      <SearchForm
        onSearchChange={this.onSearchChange}
        onSearchSubmit={this.onSearchSubmit}
        value={search.topic}
        ui={ui}
      />
    );
  }
}

//Component - Handles change and form submits
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(e) {
    const onSearchChange = this.props.onSearchChange;
    onSearchChange(e.target.value);
  }

  handleSubmit(e) {
    e.preventDefault();
    const submitSearch = this.props.onSearchSubmit;
    submitSearch(this.props.value);
  }

  render() {
    return (
      <div className={this.props.ui.searchWrap}>
        <form className={this.props.ui.search} onSubmit={this.handleSubmit}>
          <input
            className="searchBar"
            ref="search"
            type="text"
            placeholder="Search for your city, state, or neighborhood to get going."
            onChange={this.onChange}
            value={this.props.value}
          />
          <input type="submit" hidden />
        </form>
      </div>
    );
  }
}

/* *
 * Bar Display
 * */

class BarDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.barGrid = this.barGrid.bind(this);
  }

  barGrid() {
    return this.props.data.map((bar) => {
      return (
        <div className="bar fadeAndShrink">
          <img className="barImage" src={bar.img} />
          <div className="barDetails">
            <h3 className="barHeader">{bar.name}</h3>
            <p className="barAddress">{bar.address}</p>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div className="barGrid">{this.barGrid()}</div>;
  }
}

ReactDOM.render(
  <Home bars={bars} data={exampleData} user={user} />,
  document.getElementById("shudl")
);