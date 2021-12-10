import React from 'react';
import Comment from './Comment';

// stylesheets
import '../styles/CommentsList.css';

export default function CommentsList({ comments }) {
  return (
    <ul className={
      comments[0].post_id === comments[0].parent_id
        ? 'comment-list'
        : 'reply-list'
    }>
      {comments.map((comment) => (
        <Comment key={comment.id} data={comment} />
      ))}
    </ul>
  );
}
