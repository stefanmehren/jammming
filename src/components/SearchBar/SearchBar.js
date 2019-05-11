import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(term) {
    this.props.onSearch(term)
  }

  handleTermChange(event) {
    this.search(document.getElementById('searchBarField').value)
  }

  render() {
    return(
      <div className="SearchBar">
        <input id="searchBarField" placeholder="Enter A Song, Album, or Artist"/>
        <button className="SearchButton" onClick={this.handleTermChange}>SEARCH</button>
      </div>
    )
  }
}

export default SearchBar;
