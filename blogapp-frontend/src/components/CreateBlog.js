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

        <label>
          Author:
          <input type="text" value={this.state.author} onChange={this.handleAuthorChange} />
        </label>

        <label>
          Title:
          <input type="text" value={this.state.title} onChange={this.handleTitleChange} />
        </label>

        <label>
          Likes:
          <input type="number" value={this.state.likes} onChange={this.handleLikesChange} />
        </label>

        <label>
          URL:
          <input type="text" value={this.state.url} onChange={this.handleUrlChange} />
        </label>

        <button type="submit">Create blog</button>
      </form>
    );
  }
}

export default CreateBlog;