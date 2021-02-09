class Recipe extends React.Component {
  constructor(props) {
    super(props);

    if (localStorage.getItem("recipes_project") == undefined) {
      localStorage.setItem(
        "recipes_project",
        JSON.stringify([
          {
            title: "Cherry Pie",
            method:
              "1.Cook the juicy fillings for 10 minutes. 2.Brush the bottom crust with egg wash to create a protective barrier between the raw dough and the filling. Then, brush the remaining egg wash onto the top crust for a shiny, golden finish.3.Make a lattice or heavily vented crust with a double crust for good ventilation. Use a small cookie cutter to make circular, decorative vent holes, instead.4.Bake the pie on a preheated baking sheet. A blast of heat on the bottom of your pie pan will quickly help brown and cook the bottom crust.",
            ingredients:
              "For the filling: granulated sugar, cornstarch, fresh sweet cherries (stemmed and pitted), vanilla extract, kosher salt. For the pie: package prepared or homemade pie crusts, egg, water, coarse sugar.",
            img:
              "http://siftingthroughlife.com/wp-content/uploads/2017/09/Cherry-Pie-18-1024x683.jpg"
          }
        ])
      );
    }
    var initialRecipe = JSON.parse(localStorage.getItem("recipes_project"));
    this.state = {
      recipes: initialRecipe,
      recipe: { title: "", method: "", ingredients: "", img: "" }
    };
  }

  updateLocalStorage(recipes) {
    this.setState({ recipes: recipes });
    localStorage.setItem("recipes_project", JSON.stringify(recipes));
  }

  toggle_panel() {
    event.preventDefault();
    $(".add-recipe, .list-recipe").toggleClass("toggle-display");
  }
  deleteRecipe(index) {
    let recipes = this.state.recipes.slice();
    recipes.splice(index, 1);
    this.setState({ recipes });
    this.updateLocalStorage(recipes);
    //console.log(index)
  }

  saveRecipe(event) {
    event.preventDefault();
    this.state.recipes.push(this.state.recipe);
    this.updateLocalStorage(this.state.recipes);
    this.setState({
      recipe: { title: "", method: "", ingredients: "", img: "" }
    });
    this.toggle_panel(event);
  }

  updateRecipe(event) {
    var field = event.target.name;
    var value = event.target.value;
    this.state.recipe[field] = value;
    this.setState({ recipe: this.state.recipe });
  }
  editRecipe(title, event) {
    event.preventDefault();
    for (var i = 0; i < this.state.recipes.length; i++)
      if (this.state.recipes[i].title == title) {
        console.log(this.state.recipes[i]);
        this.setState = { recipe: this.state.recipes[i] };
        this.toggle_panel(event);
        break;
      }
  }

  render() {
    var createList = (recipe, index) => {
      return (
        <div className="list-group-item" key={recipe.title}>
          <div className="media col-md-3 left panel">
            <p className="lead recipeTitle">{recipe.title}</p>
            <figure className="pul-left">
              <img className="img-recipe" src={recipe.img}></img>
            </figure>
            <button
              type="button"
              className="recipeButton btn btn-primary"
              onClick={this.editRecipe.bind(this, recipe.title)}
            >
              Edit
            </button>

            <button
              type="button"
              className="recipeButton btn btn-danger"
              onClick={this.deleteRecipe.bind(this, index)}
            >
              Delete
            </button>
          </div>
          <div className="col-md-5">
            <h4 className="list-group-item-heading">Method</h4>
            <p className="list-group-item-text">{recipe.method}</p>
          </div>
          <div className="col-md-4">
            <h4 className="list-group-item-heading">Ingredients</h4>
            <p className="list-group-item-text">{recipe.ingredients}</p>
          </div>
        </div>
      );
    };
    return (
      <div>
        <Header onClick={this.toggle_panel} />
        <div className="container">
          <div className="row list-recipe">
            <div className="list-group">
              {this.state.recipes.map(createList, this)}
            </div>
          </div>
          <div className="row add-recipe toggle-display">
            <div className="row col-md-6 col-md-offset-3">
              <form>
                <div className="form-group">
                  <label>Recipe Name</label>
                  <input
                    required
                    className="form-control"
                    placeholder="Name"
                    name={"title"}
                    value={this.state.recipe.title}
                    onChange={this.updateRecipe.bind(this)}
                  />
                </div>
                <div className="form-group">
                  <label>Method</label>
                  <textarea
                    required
                    className="form-control"
                    placeholder="Method"
                    name={"method"}
                    value={this.state.recipe.method}
                    onChange={this.updateRecipe.bind(this)}
                  />
                </div>
                <div className="form-group">
                  <label>Ingredients</label>
                  <textarea
                    required
                    className="form-control"
                    placeholder="Ingredients"
                    name={"ingredients"}
                    value={this.state.recipe.ingredients}
                    onChange={this.updateRecipe.bind(this)}
                  />
                </div>
                <div className="form-group">
                  <label>Recipe Image</label>
                  <input
                    required
                    className="form-control"
                    placeholder="Name"
                    name={"img"}
                    value={this.state.recipe.img}
                    onChange={this.updateRecipe.bind(this)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-default"
                  onClick={this.saveRecipe.bind(this)}
                >
                  Save
                </button>
                <button
                  type="submit"
                  className="btn btn-default"
                  onClick={this.toggle_panel}
                >
                  Return
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  //under construction :-
  /*  handleSearch(event){
    var searchQuery=event.target.value.toLowerCase();
    var displayedContacts=initialRecipe.filter(function(el){
      var searchValue = el.title.toLowerCase();
      searchValue.indexOf(searchQuery) !=-1;
      console.log(searchValue)
    }) */

  render() {
    return (
      <div>
        <nav className="navbar navbar-dafault">
          <div className="container">
            <div className="navbar-header"></div>
            <ul className="nav navbar-nav">
              <button className="addButton " onClick={this.props.onClick}>
                Add Recipe
              </button>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

React.render(<Recipe />, document.getElementById("root"));
