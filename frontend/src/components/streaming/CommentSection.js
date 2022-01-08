import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

import './CommentSection.css';


const CommentSection = ({ author, streamId, socket, commentList, setCommentList }) => {

  const [currentComment, setCurrentComment] = useState("");

  const writeComment = () => {
    if (currentComment !== "") {
      const commentData = {
        room: streamId,
        author: author,
        message: currentComment,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      socket.emit("write_comment", commentData);
      setCommentList((list) => [...list, commentData]);
      setCurrentComment("");
    }
  }

  return (
    <div className="commentSection">
      <h2>Live Chats</h2>
      <div className="comment-body">
        <ScrollToBottom className="comment-container">
          {commentList.map((commentContent, index) => {
            return <div
              key={index}
              className="comment"
            >
              <div>
                <div className="comment-content">
                  <p className="author noselect">{commentContent.author}</p>
                  <p>{commentContent.message}</p>
                </div>
              </div>
            </div>
          })}
        </ScrollToBottom>
      </div>
      <div className="comment-footer">
        <p className="noselect">{author}</p>
        <input
          type="text"
          placeholder="Write your comments..."
          value={currentComment}
          onChange={event => { setCurrentComment(event.target.value) }}
          onKeyPress={event => {
            event.key === "Enter" && writeComment();
          }}
        />
        <button onClick={writeComment}>&#9658;</button>
      </div>
    </div>
  )
}

export default CommentSection
