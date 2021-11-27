import "./StreamingSellerScreen.css";

import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';

import {socket} from "../service/socket";

const userData = JSON.parse(localStorage.getItem("userData"));

let peerConnections = {};
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

  // Shop details
  const [shop, setShop] = useState("");

  // Streaming Details
  const [streamTitle, setStreamTitle] = useState("");
  const [streamId, setStreamId] = useState("");

  // Condition booleans
  const [started, setStarted] = useState(false);

  // Comment section
  const [currentComment, setCurrentComment] = useState("");
  const [commentList, setCommentList] = useState([]);


  // UseEffect Callbacks

  useEffect(() => {
    if (streamId !== ""){
      socket.emit("start_streaming", streamId);
      setStarted(true);
    }
  }, [streamId]);
  


  // Socket functions
  const startStreaming = async () => {

    if (streamTitle !== ""){

      // Create a new Streaming data into db
      const streaming = {
        title: streamTitle,
        shopId: shop._id,
        shopName: shop.shopName
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
        author: shop.shopName,
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
      message: "This streaming has been stopped by the streamer.",
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    socket.emit("stop_streaming", commentData);
    setCommentList((list) => [...list, commentData]);


    await axios.delete(`http://localhost:5000/streamings/${streamId}`)
      .then(res =>{
        // Video
        var videoElement = document.querySelector("video");
        let stream = videoElement.srcObject;
        stream.getTracks()[0].stop();
        stream.getTracks()[1].stop();

        // Peer connection
        peerConnections = {};

        // Socket
        socket.disconnect();

      }).catch(error => {
        console.log(error);
      })
  }


  // Video and audio
  // Get camera and microphone
  const [audioSource, setAudioSource] = useState();
  const [videoSource, setVideoSource] = useState();
  const [deviceInfos, setDeviceInfos] = useState([]);

  useEffect(() => {
    getStream()
      .then(getDevices);
  }, [audioSource, videoSource]);


  function getDevices() {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      setDeviceInfos(devices);
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
  }

  function getStream() {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }

    const constraints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    };
    return navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  }

  function gotStream(stream) {
    window.stream = stream;

    var videoElement = document.querySelector("video");
    if (stream != null)
      videoElement.srcObject = stream;
  }

  function handleError(error) {
    console.error("Error: ", error);
  }



  useEffect(() => {

    //-------------------------- Get Shop data -------------------------------

    const fetchData = async () => {
      try{
        const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
        const result = await response.json();
        setShop(result);
      } catch(error){
        console.log(error);
      }
    }
    if (shop != null)
      fetchData();

    
    // ----------------------------- Socket --------------------------------
    
    socket.on('connect', () => {
      const roomID = socket.id;
      console.log(roomID);
    });
  
    socket.on("answer", (id, description) => {
      console.log("viewer answer: "+id);
      peerConnections[id].setRemoteDescription(description);
    });
  
    socket.on("viewer_joined", viewerId => {
      console.log("viewer_joined: "+viewerId);
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[viewerId] = peerConnection;
  
      var videoElement = document.querySelector("video");
      let stream = videoElement.srcObject;
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidate", viewerId, event.candidate);
        }
      };
  
      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offer", viewerId, peerConnection.localDescription);
        });
    });
  
    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("receive_comment", (data) => {
      setCommentList((list) => [...list, data]);
    });
  
    socket.on("disconnectPeer", id => {
      console.log("disconnectPeer id: "+id);
      delete peerConnections[id];
    });
  }, []);
  


  // --------------------- Render ------------------------------
  return (
    <div className="streaming">

      <div className="streaming-header">
        <h1>{streamTitle}</h1>
        <div className="align-right">
          {started ? 
          <button onClick={stopStreaming} className="btn-stopstreaming">Stop Streaming</button>
          :
          <div></div>
          }
        </div>
      </div>

      <div className="streaming-content">

        <div className="video-content">
          <video autoPlay width="70%" muted></video>
        </div>

        {!started ? 
          <div className="sections">
            <div className="setupSection">

              {/* Streaming Title */}

              <div>
                <h2>Setup Streaming</h2>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Enter Your Streaming Title" 
                  value={streamTitle} 
                  onChange={event=>{setStreamTitle(event.target.value)}} 
                />
              </div>

              {/* Video Setting */}
              <div>Camera</div>
              <div>
                <select id="videoSource" value={videoSource} onChange={(event)=>setVideoSource(event.target.value)}>
                  {deviceInfos ? deviceInfos.filter(device => device.kind === "videoinput").map(videoDevice=>{
                    return <option key={videoDevice.deviceId} value={videoDevice.deviceId}>{videoDevice.label}</option>
                  })
                  :
                  <option>No video device found.</option>
                  }
                </select>
              </div>

              {/* Audio Setting */}
              <div>Microphone</div>
              <div>
                <select id="audioSource" value={audioSource} onChange={(event)=>setAudioSource(event.target.value)}>
                  {deviceInfos ? deviceInfos.filter(device => device.kind === "audioinput").map(audioDevice=>{
                    return <option key={audioDevice.deviceId} value={audioDevice.deviceId}>{audioDevice.label}</option>
                  })
                  :
                  <option>No audio device found.</option>
                  }
                </select>
              </div>
              <div>
                <button onClick={startStreaming}>Start Streaming</button>
              </div>
            </div>
          </div>
          :
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
              <p>{shop.shopName}</p>
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

      <div className="footer">
        <p>Copyright © 2021 UWU Shopping Site</p>
        <p>For course purposes: TTTH3404 Pembangunan Perisian untuk Sistem Multimedia, FTSM, UKM</p>
      </div>

    </div>
  )
}

export default StreamingSellerScreen
