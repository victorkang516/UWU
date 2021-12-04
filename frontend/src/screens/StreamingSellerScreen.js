import "./StreamingScreen.css";

import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';

import {socket} from "../service/socket";

// Components
import Loading from "../components/Loading";
import Product from "../components/Product";

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

  // Condition booleans
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Streaming Details
  const [streamTitle, setStreamTitle] = useState("");
  const [streamId, setStreamId] = useState("");

  // Shop details
  const [shop, setShop] = useState(null);

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
        shopName: shop.shopName,
        productId: ""
      }

      await axios.post("http://localhost:5000/streamings", streaming)
        .then(res =>{
          console.log("Streaming "+res.data._id+" has started");
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

    const fetchShop = async () => {
      try{
        const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
        const result = await response.json();
        setShop(result);
        setLoading(false);
      } catch(error){
        console.log(error);
      }
    }
    if (shop == null)
      fetchShop();
    
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


  // --------------------- Sell Product -----------------------
  // Product
  const [productOnSale, setProductOnSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  const fetchProducts = async () => {
    try{
      const response = await fetch(`http://localhost:5000/products/seller/${shop._id}`);
      const result = await response.json();
      setProducts(result);
      setShowProducts(true);
    } catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    if (showProducts === true)
      setShowProducts(false);
    if (productOnSale!=null)
      dbUpdateStreamingProductId();
    else
      dbRemoveStreamingProductId();
  },[productOnSale]);


  const dbUpdateStreamingProductId = () => {
    const streaming = {
      productId: productOnSale._id
    };
    
    axios.put(`http://localhost:5000/streamings/${streamId}`, streaming)
    .then(res => {
      console.log(res);
      socketEmitStartSale();
    }).catch(error => {
      console.log(error);
    });
  }

  const dbRemoveStreamingProductId = () => {
    const streaming = {
      productId: ""
    };
    
    axios.put(`http://localhost:5000/streamings/${streamId}`, streaming)
    .then(res => {
      console.log(res);
      socketEmitEndSale();
    }).catch(error => {
      console.log(error);
    });
  }

  const socketEmitStartSale = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: `${productOnSale.name} is for sale!`,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    setCommentList((list) => [...list, commentData]);
    socket.emit("start_sale", commentData);
  }

  const socketEmitEndSale = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: `Sale Ended.`,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    setCommentList((list) => [...list, commentData]);
    socket.emit("end_sale", commentData);
  }


  // ----------------------- Render ------------------------------
  if (loading) {
    return <Loading />
  }
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
              <h2>Setup Streaming</h2>

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
                <button onClick={startStreaming} className="btn">Start Streaming</button>
              </div>
            </div>
          </div>
          :
        <div className="sections">

          {/* Shop and product details */}
          <div className="streaming-shop">
            <h2>{shop.shopName}</h2>

            <div className="streaming-shop-body">
              <div className="streaming-shelf">
                <img src="https://media.istockphoto.com/photos/empty-wooden-shelf-picture-id479473084?k=20&m=479473084&s=170667a&w=0&h=yHxDzAysnHsEmWtyL4dGeAqWGeqtA-EzdiRpBaCvkIE=" alt="shelf" className="shelf"></img>
                {productOnSale ? 
                <img src={productOnSale.imageUrl} alt="product" className="streaming-product"></img>
                :
                <div className="streaming-noproduct noselect">Nothing on sale</div>
                }
              </div>

              {productOnSale ? 
              <div className="productOnSale">
                <h3>{productOnSale.name}</h3>
                <div className="productOnSale-detail">
                  <p>{productOnSale.countInStock} left</p>
                  <p>RM {productOnSale.price}</p>
                </div>
              </div>
              :
              <div className="center grey noselect">
                <p>To sell your products, Click "Start Sale" to choose one of your product for sale</p>
              </div>
              }

              {productOnSale ?
              <div>
                <button onClick={()=>setProductOnSale(null)} className="btn btn-red">Stop Sale</button>
              </div>
              :
              <div>
                <button onClick={fetchProducts} className="btn">Start Sale</button>
              </div>
              }
            </div>
          </div>

          {showProducts ? 
          <div className="infobox">
            <div className="infobox-content">
              <h2>Select one For Sale</h2>
              <div className="productList">
                {products.map(product => {
                  return <div key={product._id} onClick={()=>setProductOnSale(product)}>
                    <Product {...product}/>
                  </div>
                })}
              </div>
              
              <button onClick={()=>setShowProducts(false)} className="btn">Cancel</button>
            </div>
          </div>
          : 
          <div></div>
          }

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
                        <p className="author noselect">{commentContent.author}</p>
                        <p>{commentContent.message}</p>
                      </div>
                    </div>
                  </div>
                })}
              </ScrollToBottom>
            </div>
            <div className="comment-footer">
              <p className="noselect">{shop.shopName}</p>
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
