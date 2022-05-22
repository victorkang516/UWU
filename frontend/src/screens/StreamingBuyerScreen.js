import "./StreamingScreen.css";
import "./StreamingBuyerScreen.css";

import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import axios from 'axios';

import { socket } from "../service/socket";

import AuctionTablePNG from './auction-table.png';


import auth from '../authentication/auth';

import CommentSection from "../components/streaming/CommentSection";

import backendUrl from "../service/backendUrl";


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

  const [commentList, setCommentList] = useState([]);

  const [isAuction, setIsAuction] = useState(false);

  // UseEffect Callbacks

  const fetchStreaming = async () => {
    try {
      const response = await fetch(`${backendUrl}/streamings/${streamId}`);
      const result = await response.json();
      console.log(result);
      setStreaming(result);
      if (loading == true)
        setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Get Streaming data
    fetchStreaming();
  }, [streamId]);

  useEffect(() => {
    if (streaming != null) {
      if (streaming.productId != "")
        fetchProduct();
      else
        setProductOnSale(null);

      if (streaming.isAuctionEnded)
        setIsAuctionEnded(streaming.isAuctionEnded);
      // For Auction
      setIsAuction(streaming.isAuction);
      //setIsAuctionStarted(streaming.isAuctionStarted);
      // For Auction
    }

  }, [streaming])

  useEffect(() => {
    if (!loading) {
      socket.emit("join_streaming", streamId);
      console.log("Join streaming" + streamId);
    }
  }, [loading]);


  // -------------------------- Socket for Comment -----------------------------

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
      console.log("streamerId: " + streamerId);
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
        if (event.streams[0] != null) {
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
      fetchStreaming();
    });

    socket.on("sale_ended", (data) => {
      setCommentList((list) => [...list, data]);
      fetchStreaming();
    });

    // Auction /////////////////////
    socket.on("auction_started", (data) => {
      setCommentList((list) => [...list, data]);
      fetchStreaming();
    });

    socket.on("auction_next_round", (data) => {
      setCommentList((list) => [...list, data]);
      auctionNextRound();
    });

    socket.on("auction_new_highest_bid", (data) => {
      setCommentList((list) => [...list, data]);
      fetchStreaming();
      auctionResetTimer();
    });

    socket.on("auction_ended", (data) => {
      setCommentList((list) => [...list, data]);
      fetchStreaming();
    });

    socket.on("streamer_disconnected", () => {
      // Video
      var videoElement = document.querySelector("video");
      let stream = videoElement.srcObject;
      if (stream != null) {
        stream.getTracks()[0].stop();
        stream.getTracks()[1].stop();
      }

      // Peer connection
      peerConnection = null;

      // Socket
      //socket.disconnect();

    })
  }, []);


  // ----------------------------- Make Order --------------------------------
  // Product
  const [productOnSale, setProductOnSale] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderMessage, setShowOrderMessage] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${backendUrl}/products/${streaming.productId}`);
      const result = await response.json();
      console.log(result);
      setProductOnSale(result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (productOnSale !== null && isAuction) // For Auction
      setIsAuctionStarted(true);
    else if (productOnSale === null && isAuction)
      setIsAuctionStarted(false);
  }, [productOnSale]);

  const makeOrder = () => {
    const order = {
      userId: userData.userId,
      productId: productOnSale._id,
      quantity: quantity,
      shopId: productOnSale.shopId
    };

    axios.post(`${backendUrl}/orders`, order)
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


  // --------------------- Auction Product -----------------------
  const [isAuctionStarted, setIsAuctionStarted] = useState(false);
  const [bid, setBid] = useState();
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 30);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => console.log("Round ended") });


  const auctionNextRound = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 30);
    restart(time);
  }

  const auctionResetTimer = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 30);
    restart(time);
    pause();
  }

  const endAuction = () => {
    //setIsAuctionEnded(true);
  }

  const auctionMakeBid = () => {
    socketEmitAuctionMakeBid()
  }

  const socketEmitAuctionMakeBid = () => {
    const bidData = {
      room: streamId,
      bidderId: userData.userId,
      bidderName: userData.name,
      bid: bid
    };
    socket.emit("auction_make_bid", bidData);
  }




  // ------------------------------ Render Contents --------------------------------
  if (loading) {
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
          <video autoPlay width="100%" height="480" muted></video>
          {isAuctionStarted ?
            <div className="uwu-auctiontimer">
              {isRunning ?
                < p className="uwu-auctiontimer-title">Bid Now!!</p>
                :
                <p className="uwu-auctiontimer-title">Wait For Next Round</p>
              }
              <p className="uwu-auctiontimer-time">{minutes >= 10 ? "" + minutes : "0" + minutes}:{seconds >= 10 ? "" + seconds : "0" + seconds}</p>
            </div>
            :
            <div></div>
          }
        </div>

        <div className="sections">


          {!isAuction ?

            //Normal Shop
            <div className="streaming-shop">
              <h2>{streaming.shopName}</h2>

              <div className="streaming-shop-body">
                <div className="streaming-shelf">
                  <img src="https://media.istockphoto.com/photos/empty-wooden-shelf-picture-id479473084?k=20&m=479473084&s=170667a&w=0&h=yHxDzAysnHsEmWtyL4dGeAqWGeqtA-EzdiRpBaCvkIE=" alt="shelf" className="shelf"></img>
                  {productOnSale ?
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${productOnSale.imageUrl}?${Date.now()}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/945/593/non_2x/empty-price-tag-icon-shopping-product-label-sign-and-symbol-free-vector.jpg'
                      }}
                      alt=""
                      className="streaming-product" />
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
                      onChange={(event) => { setQuantity(event.target.value) }}
                      min="1"
                      max={productOnSale.countInStock}
                      className="uwu-input"
                    />
                    {auth.isAuthenticated() ?
                      <button onClick={makeOrder} className="uwu-btn">Make Order</button>
                      :
                      <button onClick={() => setShowLoginMessage(true)} className="uwu-btn">Make Order</button>
                    }
                  </div>
                  :
                  <div></div>
                }
              </div>
            </div>
            :


            // Aucion Shop
            <div className="streaming-shop">
              <h2>{streaming.shopName}</h2>

              <div className="streaming-shop-body">
                <div className="streaming-shelf">
                  <img src={AuctionTablePNG} alt="shelf" className="shelf"></img>
                  {productOnSale ?
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${productOnSale.imageUrl}?${Date.now()}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/945/593/non_2x/empty-price-tag-icon-shopping-product-label-sign-and-symbol-free-vector.jpg'
                      }}
                      alt=""
                      className="streaming-product" />
                    :
                    <div className="streaming-noproduct">Nothing on auction</div>
                  }
                </div>

                {isAuctionStarted && productOnSale != null ?
                  <div className="productOnSale">
                    <h3>{productOnSale.name}</h3>
                    <div className="productOnSale-detail">
                      <p>Current Highest Bid</p>
                      <p>{streaming.minimumBid}</p>
                    </div>
                  </div>
                  :
                  <div></div>
                }

                {isAuctionStarted && productOnSale != null ?
                  <div className="productOnSale-makebid">
                    {isAuctionEnded ?
                      <div className="auction-win-message center noselect">
                        The Winner is {streaming.bidderName} !!
                      </div>
                      :
                      <div>
                        <div className="center grey noselect">
                          {!isRunning ? "You can only bid after seller start next round." : "Your bid amount must higher than minimum bid."}
                        </div>
                        <input
                          type="number"
                          value={bid}
                          onChange={(event) => { setBid(event.target.value) }}
                          min={streaming.minimumBid}
                          className="uwu-input"
                          placeholder="Enter your Bid Amount"
                        />
                        {auth.isAuthenticated() ?
                          <button onClick={auctionMakeBid} className="uwu-btn" disabled={!isRunning}>Make Bid</button>
                          :
                          <button onClick={() => setShowLoginMessage(true)} className="btn">Make Bid</button>
                        }
                      </div>
                    }
                  </div>
                  :
                  <div className="center grey noselect">Auction is not started yet.</div>
                }
              </div>
            </div>
          }



          {showOrderMessage ?
            <div className="message">
              <div className="message-content">
                <h2>Your Order on {quantity} quantity of {productOnSale.name} is successfully placed</h2>
                <p>View your orders in Myorder.</p>
                <button onClick={() => setShowOrderMessage(false)}>OK</button>
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
                <button onClick={() => setShowLoginMessage(false)}>OK</button>
              </div>
            </div>
            :
            <div></div>
          }


          <CommentSection
            author={username}
            streamId={streamId}
            socket={socket}
            commentList={commentList}
            setCommentList={setCommentList}
          />
        </div>

      </div>

    </div >
  )
}

export default StreamingSellerScreen