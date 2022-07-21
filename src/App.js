import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

class Word extends React.Component {
  render() {
    const { wordList } = this.props;

    return (
      <ul>
        {wordList.map((word) => (
          <li key={word.id}>{word.gloss}: {word.surface}</li>
        ))}
      </ul>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      searchText: ''
    }
  }

  handleSearchText = (e) => {
    const prefix = e.target.value;
    this.setState({searchText: prefix});
    console.log(`handleSearchText ${prefix}`)
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/search/${prefix}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({words: data.matches})
      })
  }

  handleSubmit = (e) => {
    const prefix = this.state.searchText;
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/search/${prefix}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({words: data.matches})
      })
  }

  render() {
    console.log(`render ${this.state.searchText}`)
    return (
    <div className='search-box'>
      <h1>Korean Dictionary</h1>
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="word" id="word" placeholder='English here' required value={this.state.searchText} onChange={this.handleSearchText} />
        <FontAwesomeIcon className='icon' icon={faCircleArrowRight} />
      </form>
      <Word wordList={this.state.words}></Word>
    </div>
    )
  }
}

export default App;
