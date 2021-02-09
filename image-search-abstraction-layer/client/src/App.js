import React, { Component } from 'react';
import axios from 'axios';

import Loader from './Loader';
import RecentSearches from './RecentSearches';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      activeSearch: false,
      data: '',
      recent: null,
      error: false,
      errorMsg: '',
      preview: false,
      loading: false
    };

    this.search = this.search.bind(this);
    this.setSearchTerm = this.setSearchTerm.bind(this);
  }

  setSearchTerm(term) {
    document.getElementById('searchInput').value = term;
    const newState = { ...this.state }
    newState.searchTerm = term;
    this.setState({ ...newState });
  }

  clearInput() {
    const newState = { ...this.state }
    newState.searchTerm = '';
    newState.error = false;
    newState.activeSearch = false;
    newState.preview = false;
    newState.recent = null;
    this.setState(newState);
  }

  getRecent() {
    const rootUrl = window.location.origin;
    axios.get(`${rootUrl}/api/recent`)
      .then((resp) => {
        const newState = { ...this.state }
        newState.recent = resp.data;
        this.setState(newState);
      })
      .catch(err => console.log(err));
    }

  close() {
    const newState = { ...this.state }
    newState.recent = null;
    newState.error = false;
    this.setState(newState);
  }

  search(searchTerm, offset) {
    const rootUrl = window.location.origin;
    if (!offset) {
      offset = 1;
    }
    const newState = { ...this.state }
    newState.activeSearch = true;
    newState.loading = true;
    newState.error = false;
    this.setState(newState, () => {
      axios.get(`${rootUrl}/api/search/${searchTerm}?offset=${offset}`)
      .then((resp) => {
        // console.log(resp.data);
        const newState = { ...this.state }
        newState.data = { ...resp.data };
        if (!newState.data.items.length) {
          newState.error = true;
          newState.loading = false;
          newState.errorMsg = 'Sorry, no Results :(';
        }
        this.setState(newState, () => {
          const newState = { ...this.state }
          newState.preview = true;
          newState.loading = false;
          this.setState(newState);
        });
      })
      .catch((error) => {
        console.log(error);
        const newState = { ...this.state }
        newState.error = true;
        newState.errorMsg = error;
        this.setState(newState);
      });
    });


  }

  render() {
    const { activeSearch, error, errorMsg } = this.state;
    const { query, offset, items } = this.state.data;
    let thumbnails;
    if (this.state.data.items) {
      thumbnails = this.state.data.items.map(item => (
          <a href={item.context} target="_blank" rel="noopener noreferrer" title={item.snippet} key={item.id}>
            <img className="image" src={item.thumbnail} alt={item.snippet} />
          </a>
        ));
    }
    return (
      <div className="App">
        {this.state.loading && <Loader />}
        <header className="head">
          <h1 className="header">
            Image Search Abstraction Layer
          </h1>
          <h2 className="subhead">
            FreeCodeCamp Back End Certification API project #4
          </h2>
        </header>
        <main className="container">
          <div className="row">
            <div className={activeSearch ? 'hidden' : 'card'} id="user_stories">
              <h3 className="card__title">User stories:</h3>
              <ul>
                <li>I can get the image URLs, alt text and page urls for a set of images relating to a given search string.</li>
                <li>I can paginate through the responses by adding a ?offset=2 parameter to the URL.</li>
                <li>I can get a list of the most recently submitted search strings.</li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="card">
              <fieldset>
                <input
                  type="text"
                  className="input"
                  id="searchInput"
                  placeholder="Search for images"
                />
                <button
                  className="card__action"
                  id="searchButton"
                  onClick={() => this.search(document.getElementById('searchInput').value, 1)}
                  >
                  search
                </button>
              </fieldset>
              <div id="search_actions" className={activeSearch ? 'visible' : 'hidden'}>
                <span className="info">Search again</span>
                <button
                  id="clear_active_search"
                  className="close"
                  onClick={() => this.clearInput()}
                >&times;</button>
              </div>
              {!this.state.preview &&
                <button
                  className="get-recent"
                  onClick={() => {
                    if (!this.state.recent) {
                      this.getRecent();
                    } else {
                      this.close();
                    }
                  }}
                >{this.state.recent && !this.state.preview ? 'Hide Recent Searches' : 'Show Recent Searches'}
                </button>
              }
              {this.state.recent && !this.state.preview &&
                <RecentSearches
                  items={this.state.recent}
                  search={this.search}
                  setSearchTerm={this.setSearchTerm}
                />}
            </div>
          </div>
          {activeSearch &&
            <div className="row">
              <h3 className="subhead center">
                { this.state.preview ? `Search results for ${query}` : "Loading..." }
              </h3>
              {this.state.preview &&
                <div className="navigation">
                  <button
                    id="prev"
                    className={this.state.data.offset > 1 ? 'arrow' : 'arrow disabled'}
                    disabled={this.state.data.offset ===1}
                    onClick={() => {
                      if (this.state.data.offset > 1) {
                        this.search(query, +offset - 1);
                      }
                    }}
                  >
                    <div className="prev">&#9664; Previous page</div>
                  </button>
                  <button
                    id="next"
                    className="arrow"
                    onClick={() => this.search(query, +offset + 1)}
                  >
                    <div className="next">Next page &#9654;</div>
                  </button>
                </div>
              }
              {this.state.preview &&
                <div id="results" className={error ? 'card' : 'card results'}>
                  {items.length ? thumbnails :
                    <div className="center error">
                      {errorMsg || 'No results'}
                    </div>
                  }
                </div>
              }
            </div>
          }
        </main>
        <footer className="foot">
          <div className="icon__wrap">
            <a className="github" href="https://github.com/rifkegribenes/image-search-abstraction-layer" target="_blank" rel="noopener noreferrer">
              <img className="github" src="https://cdn.glitch.com/22a70955-ef8c-44b6-9fd7-5377da7be776%2Ficon-github.png?1516058791588" alt="view code on github" />
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
