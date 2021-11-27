import "./StreamingSellerScreen.css";

import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';

import {socket} from "../service/socket";


const userData = JSON.parse(localStorage.getItem("userData"));

let peerConnection;
const config = {
  iceServers: [
      { 
        "urls": "stun:stun.l.google.com:19302",
      },
      // { 
      //   "urls": "turn:TURN_IP?transport=tcp",
      //   "username": "TURN_USERNAME",
      //   "credential": "TURN_CREDENTIALS"
      // }
  ]
};


const StreamingSellerScreen = () => {
  let { streamingId } = useParams();

  const [streaming, setStreaming] = useState(null);
  const [streamId] = useState(streamingId);
  const [username] = useState(userData.name);

  const [loading, setLoading] = useState(true);
  const [currentComment, setCurrentComment] = useState("");
  const [commentList, setCommentList] = useState([]);


  // UseEffect Callbacks

  useEffect(() => {
    // Get Streaming data
    const fetchData = async () => {
      try{
        const response = await fetch(`http://localhost:5000/streamings/${streamId}`);
        const result = await response.json();
        console.log(result);
        setStreaming(result);
        setLoading(false);
      } catch(error){
        console.log(error);
      }
    }
    fetchData();
  }, [streamId]);

  useEffect(()=>{
    if (!loading){
      socket.emit("join_streaming", streamId);
      console.log("Join streaming" + streamId);
    }
  }, [loading]);


  // -------------------------- Socket for Comment -----------------------------

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

  const joinMessage = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: `${username} joined!`,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    socket.emit("write_comment", commentData);
    setCommentList((list) => [...list, commentData]);
  }


  useEffect(() => {

    // ----------------------- Socket for Video streaming ----------------------------

    socket.on("offer", (streamerId, description) => {
      peerConnection = new RTCPeerConnection(config);
      console.log("streamerId: "+ streamerId);
      console.log(description);
      joinMessage();
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answer", streamerId, peerConnection.localDescription);
        });
      peerConnection.ontrack = event => {
        if (event.streams[0]!=null){
          const video = document.querySelector("video");
          video.srcObject = event.streams[0];
        } else {
          console.log("No stream");
        }
      };
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidate", streamerId, event.candidate);
        }
      };
    });

    socket.on("candidate", (id, candidate) => {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    });

    socket.on("receive_comment", (data) => {
      setCommentList((list) => [...list, data]);
    });

    socket.on("streamer_disconnected", ()=>{
      // Video
      
      var videoElement = document.querySelector("video");
      let stream = videoElement.srcObject;
      if (stream != null){
        stream.getTracks()[0].stop();
        stream.getTracks()[1].stop();
      }

      // Peer connection
      peerConnection = null;

      // Socket
      socket.disconnect();

      // Database
      stopStreaming();
    })
  }, []);


  const stopStreaming = async () => {
    await axios.delete(`http://localhost:5000/streamings/${streamId}`)
      .then(res =>{
      }).catch(error => {
        console.log(error);
      })
  }

  

  // #1 Receive signal from broadcaster, emit watcher
  // socket.on("broadcaster", () => {
  //   socket.emit("watcher", streamId); // pass streamId here
  // });


  window.onunload = window.onbeforeunload = () => {
    socket.close();
    peerConnection.close();
  };
  

  // ------------------------------ Render Contents --------------------------------
  if (loading){
    return <div className="loadingscreen">
      <div className="loading"></div>
    </div>
  }

  return (
    <div className="streaming">

      <div className="streaming-header">
        <h1>{streaming.title}</h1>
      </div>

      <div className="streaming-content">

        <div className="video-content">
          <video autoPlay width="70%"></video>
        </div>

        <div className="sections">

          {/* Shop and product details */}
          <div className="shopSection">
            <h2>Shop</h2>
          </div>

          {/* Comment section */}
          <div className="commentSection">
            <h2>Live Chats</h2>
            <div className="comment-body">
              <ScrollToBottom className="comment-container">
                {commentList.map((commentContent, index) => {
                  return<div
                    key={index} 
                    className="comment"
                  >
                    <div>
                      <div className="comment-content">
                        <p className="author">{commentContent.author}</p>
                        <p>{commentContent.message}</p>
                      </div>
                    </div>
                  </div>
                })}
              </ScrollToBottom>
            </div>
            <div className="comment-footer">
              <p>{username}</p>
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
        
      </div>

      <div className="footer">
        <p>Copyright © 2021 UWU Shopping Site</p>
        <p>For course purposes: TTTH3404 Pembangunan Perisian untuk Sistem Multimedia, FTSM, UKM</p>
      </div>

    </div>
  )
}

export default StreamingSellerScreen