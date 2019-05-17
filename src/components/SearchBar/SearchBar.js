import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cachedSearchTerm: ''
    }

    this.cacheSearchTerm = this.cacheSearchTerm.bind(this);
    this.search = this.search.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem('searchTerm')) {
      this.setSearchTermFromStorage();
    }
  }

  cacheSearchTerm(term) {
    sessionStorage.setItem('searchTerm', term);
  }

  setSearchTermFromStorage() {
    this.setState({
      cachedSearchTerm: sessionStorage.getItem('searchTerm')
    })
  }

  search(term) {
    this.props.onSearch(term);
  }

  handleClick() {
    this.cacheSearchTerm(document.getElementById('searchBarField').value);
    this.search(document.getElementById('searchBarField').value);
  }

  handleTermChange(event) {
    this.setState({
      cachedSearchTerm: event.target.value
    })
  }

  render() {
    let inputField;
    if(sessionStorage.getItem('searchTerm')) {
      inputField = (
        <input
        id="searchBarField"
        value={this.state.cachedSearchTerm}
        onChange={this.handleTermChange}/>
      )
    } else {
      inputField = (
        <input
        id="searchBarField"
        placeholder="Enter Artist, Album or Title"
        onChange={this.handleTermChange}/>
      )
    }
    return(
      <div className="SearchBar">
        {inputField}
        <button className="SearchButton" onClick={this.handleClick}>SEARCH</button>
      </div>
    )
  }
}

export default SearchBar;
