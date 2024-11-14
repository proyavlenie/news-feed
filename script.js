const postListContainer = document.getElementById('postList');
const newPostForm = document.getElementById('newPostForm');
const newPostText = document.getElementById('newPostText');
const postDetailModal = new bootstrap.Modal(document.getElementById('postDetailModal'));
const postTitleElem = document.getElementById('postTitle');
const postBodyElem = document.getElementById('postBody');
const commentsList = document.getElementById('commentsList');

const userId = 1; // ID автора, по умолчанию это Вы (Давалис Максим Андреевич)

async function loadPosts() {
  const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await postsResponse.json();
  const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await usersResponse.json();

  postListContainer.innerHTML = '';
  posts
    .sort((a, b) => b.id - a.id)  // Сортируем по ID (новые посты сверху)
    .forEach(post => {
      const author = users.find(user => user.id === post.userId);
      const postElem = document.createElement('div');
      postElem.classList.add('list-group-item');
      postElem.innerHTML = `
        <h5>${author?.name}</h5>
        <h6 class="text-muted">${post.title}</h6>
        <p>${post.body}</p>
      `;
      postElem.addEventListener('click', () => openPostDetail(post.id));
      postListContainer.appendChild(postElem);
    });
}

async function loadComments(postId) {
  const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  const comments = await commentsResponse.json();

  commentsList.innerHTML = '';
  if (comments.length === 0) {
    commentsList.innerHTML = '<p>Комментариев нет.</p>';
  } else {
    comments.forEach(comment => {
      const commentElem = document.createElement('div');
      commentElem.innerHTML = `
        <h5>${comment.name}</h5>
        <p>${comment.body}</p>
      `;
      commentsList.appendChild(commentElem);
    });
  }
}

function openPostDetail(postId) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then(response => response.json())
    .then(post => {
      postTitleElem.textContent = post.title;
      postBodyElem.textContent = post.body;
      loadComments(postId);
      postDetailModal.show();
    });
}

newPostForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newPost = {
    title: newPostText.value,
    body: newPostText.value,
    userId: userId,
  };

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  })
    .then(response => response.json())
    .then(post => {
      newPostText.value = '';

      const postElem = document.createElement('div');
      postElem.classList.add('list-group-item');
      postElem.innerHTML = `
        <h5>Давалис Максим Андреевич</h5>
        <h6 class="text-muted">${post.title}</h6>
        <p>${post.body}</p>
      `;
      postElem.addEventListener('click', () => openPostDetail(post.id));
      postListContainer.prepend(postElem);
    });
});

loadPosts();
