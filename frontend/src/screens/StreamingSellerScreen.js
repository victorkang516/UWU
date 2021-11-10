import "./StreamingSellerScreen.css";

import io from 'socket.io-client';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';


const socket = io.connect("http://localhost:5000");
const userData = JSON.parse(localStorage.getItem("userData"));


const StreamingSellerScreen = () => {
  //const { id } = useParams();

  const [streamTitle, setStreamTitle] = useState("");
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
  }, []);

  useEffect(() => {
    if (streamId !== ""){
      socket.emit("start_streaming", streamId);
      setStarted(true);
      window.addEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }
  }, [streamId]);


  // Socket functions
  const startStreaming = async () => {

    if (streamTitle !== ""){

      // Create a new Streaming data into db
      const streaming = {
        title: streamTitle,
        shopId: "6182052c05f674859f8a8ded",
        shopName: "Amir Shop"
      }

      await axios.post("http://localhost:5000/streamings", streaming)
        .then(res =>{
          console.log(res.data._id);
          setStreamId(res.data._id);
        }).catch(error => {
          console.log(error);
        })
      
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


  const stopStreaming = async () => {

    const commentData = {
      room: streamId,
      author: "System",
      message: "This streaming is now stopped by host.",
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    socket.emit("stop_streaming", commentData);
    setCommentList((list) => [...list, commentData]);


    await axios.delete(`http://localhost:5000/streamings/${streamId}`)
      .then(res =>{
        setStreamId(null);
      }).catch(error => {
        console.log(error);
      })
  }

  const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = "Your streaming are still running. Stop the streaming before you leave.";
  };
  

  // Render Contents
  return (
    <div className="streaming">

      <div className="streaming-header">
        <h1>Seller Streaming - Sofia</h1>
        <div className="align-right">
          {started ? 
          <button onClick={stopStreaming}>Stop Streaming</button>
          :
          <div></div>
          }
        </div>
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
                  value={streamTitle} 
                  onChange={event=>{setStreamTitle(event.target.value)}} 
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
