import React from 'react';
import Post from './Post';

export default function PostsList({ posts }) {
  return (
    <ul>
      {posts.map((post, index) => (
        <Post key={post.id} postIndex={index} />
      ))
      }
    </ul>
  );
}
