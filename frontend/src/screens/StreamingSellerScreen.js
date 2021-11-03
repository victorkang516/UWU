import "./StreamingSellerScreen.css";

import io from 'socket.io-client';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';


const socket = io.connect("http://localhost:5000");
const userData = JSON.parse(localStorage.getItem("userData"));


const StreamingSellerScreen = () => {
  //const { id } = useParams();

  const [streamId, setStreamId] = useState("");
  const [username, setUsername] = useState(userData.name);

  const [started, setStarted] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [commentList, setCommentList] = useState([]);


  // UseEffect Callbacks
  useEffect(() => {
    //
  });

  useEffect(() => {
    socket.on("receive_comment", (data) => {
      setCommentList((list) => [...list, data]);
    });
  }, [])


  // Socket functions
  const startStreaming = () => {
    if (streamId !== ""){
      socket.emit("start_streaming", streamId);
      setStarted(true);
    }
  }

  const writeComment = () => {
    if(currentComment !== ""){
      const commentData = {
        room: streamId,
        author: username,
        message: currentComment,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      socket.emit("write_comment", commentData);
      setCommentList((list) => [...list, commentData]);
      setCurrentComment("");
    }
    
  }
  

  // Render Contents
  return (
    <div className="streaming">

      <div className="streaming-header">
        <h1>Seller Streaming - Sofia</h1>
      </div>

      <div className="streaming-body">

        <div className="body-left">
          <video></video>
        </div>

        {!started ? 
          <div className="body-right">
            <div className="optionmenu">
              <p>Enter your streaming detail.</p>
              <p>
                <input 
                  type="text" 
                  placeholder="Streaming Title" 
                  value={streamId} 
                  onChange={event=>{setStreamId(event.target.value)}} 
                />
              </p>
              <p>
                <button onClick={startStreaming}>Start</button>
              </p>
            </div>
          </div>
          :
        <div className="body-right">

          {/* Shop and product details */}
          <div className="right-top">
            <h2>Shop name</h2>
          </div>

          {/* Comment section */}
          <div className="right-bottom">
            <h2>Comments</h2>
            <div className="comment-body">
              <ScrollToBottom className="comment-container">
                {commentList.map((commentContent) => {
                  return<div>
                    <div>
                      <div className="comment-content">
                        <p>{commentContent.message}</p>
                      </div>
                      <div className="comment-meta">
                        <p id="time">{commentContent.time}</p>
                        <p id="author">{commentContent.author}</p>
                      </div>
                    </div>
                  </div>
                })}
              </ScrollToBottom>
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Write your comments..." 
                value={currentComment} 
                onChange={event=>{setCurrentComment(event.target.value)}} 
                onKeyPress={event => {
                  event.key === "Enter" && writeComment();
                }}
              />
              <button onClick={writeComment}>&#9658;</button>
            </div>
          </div>
        </div>
        }
      </div>

    </div>
  )
}

export default StreamingSellerScreen
