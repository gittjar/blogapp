import React from 'react';
import axios from 'axios';

class CreateBlog extends React.Component {
  state = {
    author: '',
    title: '',
    likes: 0,
    url: '',
  };

  handleAuthorChange = (event) => {
    this.setState({ author: event.target.value });
  };

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleLikesChange = (event) => {
    this.setState({ likes: event.target.value });
  };

  handleUrlChange = (event) => {
    this.setState({ url: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const blog = {
      author: this.state.author,
      title: this.state.title,
      likes: this.state.likes,
      url: this.state.url,
    };

    const userToken = localStorage.getItem('userToken');

    const response = await axios.post('https://blogapp-backend-e23a.onrender.com/api/blogs', blog, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
  };

  render() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return <p>Please log in to create a blog.</p>;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Create a new blog</h2>
        <div className='create-blog'>
        <label>
          Author:<br></br>
          <input type="text" value={this.state.author} onChange={this.handleAuthorChange} />
        </label>
        <br></br>
        <label>
          Title:<br></br>
          <input type="text" value={this.state.title} onChange={this.handleTitleChange} />
        </label>
        <br></br>
        <label>
          Likes:<br></br>
          <input type="number" value={this.state.likes} onChange={this.handleLikesChange} />
        </label>
        <br></br>
        <label>
          URL:<br></br>
          <input type="text" value={this.state.url} onChange={this.handleUrlChange} />
        </label>
        <br></br>
        <button type="submit" className='l-button'>Create blog</button>
        </div>
      </form>

    );
  }
}

export default CreateBlog;