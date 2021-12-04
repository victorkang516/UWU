import "./StreamingScreen.css";

import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';

import {socket} from "../service/socket";

import auth from '../authentication/auth';

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
  const [username] = useState(userData ? userData.name : "Noname");

  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentComment, setCurrentComment] = useState("");
  const [commentList, setCommentList] = useState([]);


  // UseEffect Callbacks

  const fetchStreaming = async () => {
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

  useEffect(() => {
    // Get Streaming data
    fetchStreaming();
  }, [streamId]);

  useEffect(() => {
    if(streaming!=null)
      if(streaming.productId!="")
        setProductOnSaleId(streaming.productId);
  },[streaming])

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

    socket.on("sale_started", (data) => {
      setCommentList((list) => [...list, data]);
      fetchProductId();
    });

    socket.on("sale_ended", (data) => {
      setCommentList((list) => [...list, data]);
      setProductOnSaleId("");
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

  // ----------------------------- Make Order --------------------------------
  // Product
  const [productOnSaleId, setProductOnSaleId] = useState("");
  const [productOnSale, setProductOnSale] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderMessage, setShowOrderMessage] = useState(false);
 
  const fetchProductId = async () => {
    try{
      const response = await fetch(`http://localhost:5000/streamings/${streamId}`);
      const result = await response.json();
      setProductOnSaleId(result.productId);
    } catch(error){
      console.log(error);
    }
  }

  const fetchProduct = async () => {
    try{
      const response = await fetch(`http://localhost:5000/products/${productOnSaleId}`);
      const result = await response.json();
      console.log(result);
      setProductOnSale(result);
    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if(productOnSaleId!="")
      fetchProduct();
    else
      setProductOnSale(null);
      
  },[productOnSaleId]);

  const makeOrder = () => {
    const order = {
      userId: userData.userId,
      productId: productOnSale._id,
      quantity: quantity,
      shopId: productOnSale.shopId
    };

    axios.post('http://localhost:5000/orders', order)
      .then(res => {
        console.log(res);
        setShowOrderMessage(true);
        makeOrderMessage();
      }).catch(error => {
        console.log(error);
      });
  }

  const makeOrderMessage = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: `${username} made ${quantity} order on ${productOnSale.name}!`,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    socket.emit("write_comment", commentData);
    setCommentList((list) => [...list, commentData]);
  }

  

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
          <div className="streaming-shop">
            <h2>{streaming.shopName}</h2>

            <div className="streaming-shop-body">
              <div className="streaming-shelf">
                <img src="https://media.istockphoto.com/photos/empty-wooden-shelf-picture-id479473084?k=20&m=479473084&s=170667a&w=0&h=yHxDzAysnHsEmWtyL4dGeAqWGeqtA-EzdiRpBaCvkIE=" alt="shelf" className="shelf"></img>
                {productOnSale ? 
                <img src={productOnSale.imageUrl} alt="product" className="streaming-product"></img>
                :
                <div className="streaming-noproduct">Nothing on sale</div>
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
              <div></div>
              }

              {productOnSale ?
              <div className="productOnSale-makeorder">
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(event)=>{setQuantity(event.target.value)}} 
                  min="1" 
                  max={productOnSale.countInStock}
                />
                {auth.isAuthenticated() ? 
                <button onClick={makeOrder} className="btn">Make Order</button>
                :
                <button onClick={()=>setShowLoginMessage(true)} className="btn">Make Order</button>
                }
              </div>
              :
              <div></div>
              }
            </div>
          </div>

          {showOrderMessage ? 
          <div className="message">
            <div className="message-content">
              <h2>Your Order on {quantity} quantity of {productOnSale.name} is successfully placed</h2>
              <p>View your orders in Myorder.</p>
              <button onClick={()=>setShowOrderMessage(false)}>OK</button>
            </div>
          </div>
          : 
          <div></div>
          }

          {showLoginMessage ? 
          <div className="message">
            <div className="message-content">
              <h2>Signup Required</h2>
              <p>Please signup <Link to="/login">Here</Link> before making order.</p>
              <button onClick={()=>setShowLoginMessage(false)}>OK</button>
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

    </div>
  )
}

export default StreamingSellerScreen