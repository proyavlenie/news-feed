// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  // Функция для добавления нового поста
  const handlePostAdded = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Добавляем новый пост в начало списка
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(postsResponse.data);
    };
    const fetchUsers = async () => {
      const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(usersResponse.data);
    };
    fetchPosts();
    fetchUsers();
  }, []);

  return (
    <Router>
      <div className="container">
        {/* Компонент для добавления нового поста */}
        <AddPostForm onPostAdded={handlePostAdded} />
        <Routes>
          <Route path="/" element={<PostList posts={posts} users={users} />} />
          <Route path="/post/:postId" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

// Компонент для добавления нового поста
const AddPostForm = ({ onPostAdded }) => {
  const [newPost, setNewPost] = useState('');

  const handlePostChange = (e) => setNewPost(e.target.value);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const post = {
      title: newPost,
      body: newPost,
      userId: 1, // Поставим фиксированного пользователя
    };

    // Отправляем новый пост на сервер
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', post);

    // Добавляем имя автора в объект поста
    const postWithAuthor = {
      ...response.data,
      authorName: 'Давалис Максим Андреевич', // Имя автора
    };

    // Очищаем поле ввода
    setNewPost('');

    // Обновляем список постов в родительском компоненте
    onPostAdded(postWithAuthor);
  };

  return (
    <div className="mb-4">
      <h3>Добавить новый пост</h3>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={newPost}
          onChange={handlePostChange}
          className="form-control"
          rows="4"
          placeholder="Введите текст поста..."
        />
        <button type="submit" className="btn btn-primary mt-2">
          Опубликовать
        </button>
      </form>
    </div>
  );
};

// Компонент для отображения списка постов
const PostList = ({ posts, users }) => {
  return (
    <div>
      <h3>Новостная лента</h3>
      {posts
        .sort((a, b) => b.id - a.id)  // Сортировка по убыванию ID (новые посты сверху)
        .map((post) => {
          const author = users.find((user) => user.id === post.userId) || {};
          return (
            <div key={post.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{post.authorName || author.name}</h5> {/* Используем имя автора */}
                <h6 className="card-subtitle mb-2 text-muted">{post.title}</h6>
                <p className="card-text">{post.body}</p>
                <Link to={`/post/${post.id}`} className="btn btn-link">
                  Читать далее
                </Link>
              </div>
            </div>
          );
        })}
    </div>
  );
};

// Компонент для отображения деталей поста
const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const postResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setPost(postResponse.data);
    };
    const fetchComments = async () => {
      const commentsResponse = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      setComments(commentsResponse.data);
    };
    fetchPost();
    fetchComments();
  }, [postId]);

  if (!post) return <div>Загрузка...</div>;

  return (
    <div>
      <h3>{post.title}</h3>
      <h5>{post.body}</h5>
      <h6>Автор: Давалис Максим Андреевич</h6>

      <h4>Комментарии:</h4>
      {comments.length ? (
        comments.map((comment) => (
          <div key={comment.id} className="mb-3">
            <h5>{comment.name}</h5>
            <p>{comment.body}</p>
          </div>
        ))
      ) : (
        <p>Комментариев нет.</p>
      )}
    </div>
  );
};

export default App;
