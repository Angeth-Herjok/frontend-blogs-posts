const blogList = document.getElementById('blogList');
const createForm = document.getElementById('createForm');
const editForm = document.getElementById('editForm');
const editPostId = document.getElementById('editPostId');
const editTitle = document.getElementById('editTitle');
const editContent = document.getElementById('editContent');
const editAuthor = document.getElementById('editAuthor');

function fetchBlogPosts() {
    fetch('http://localhost:8000/')
        .then(response => response.json())
        .then(data => {
            blogList.innerHTML = '';
            data.forEach(post => {
                const listItem = document.createElement('li');
                listItem.textContent = `${post.title} by ${post.author}`;
                
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => showEditForm(post));
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteBlogPost(post.id));
                
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
                
                blogList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching blog posts:', error));
}

function showEditForm(post) {
    editPostId.value = post.id;
    editTitle.value = post.title;
    editContent.value = post.content;
    editAuthor.value = post.author;

    editForm.style.display = 'block';
}

function hideEditForm() {
    editForm.style.display = 'none';
}

function updateBlogPost(data) {
    const postId = editPostId.value;

    fetch(`http://localhost:8000/posts/${postId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post updated:', data);
        hideEditForm();
        fetchBlogPosts();
    })
    .catch(error => console.error(`Error updating post with ID ${postId}:`, error));
}

function createBlogPost(data) {
    fetch('http://localhost:8000/posts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post created:', data);
        createForm.reset();
        fetchBlogPosts();
    })
    .catch(error => console.error('Error creating post:', error));
}

function deleteBlogPost(postId) {
    fetch(`http://localhost:8000/posts/${postId}/`, {
        method: 'DELETE'
    })
    .then(response => {
        console.log(`Post with ID ${postId} deleted`);
        fetchBlogPosts();
    })
    .catch(error => console.error(`Error deleting post with ID ${postId}:`, error));
}

createForm.addEventListener('submit', event => {
    event.preventDefault();

    const newPostData = {
        title: createTitle.value,
        content: createContent.value,
        author: createAuthor.value
    };

    createBlogPost(newPostData);
});

editForm.addEventListener('submit', event => {
    event.preventDefault();

    const updatedPostData = {
        title: editTitle.value,
        content: editContent.value,
        author: editAuthor.value
    };

    updateBlogPost(updatedPostData);
});


fetchBlogPosts();





