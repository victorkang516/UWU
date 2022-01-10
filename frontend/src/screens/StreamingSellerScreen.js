import "./StreamingScreen.css";

import { useEffect, useState } from 'react';
import axios from 'axios';

// Service
import { socket } from "../service/socket";
import { useTimer } from 'react-timer-hook';

// Components
import Loading from "../components/Loading";
import CommentSection from "../components/streaming/CommentSection";
import ProductForSale from '../components/streaming/ProductForSale';

import AuctionTablePNG from './auction-table.png';


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

  const [commentList, setCommentList] = useState([]);

  const [isAuction, setIsAuction] = useState(false);


  // UseEffect Callbacks

  useEffect(() => {
    if (streamId !== "") {
      socket.emit("start_streaming", streamId);
      setStarted(true);
    }
  }, [streamId]);



  // Socket functions
  const startStreaming = async () => {

    if (streamTitle !== "") {

      // Create a new Streaming data into db
      const streaming = {
        title: streamTitle,
        shopId: shop._id,
        shopName: shop.shopName,
        productId: "",
        isAuction: isAuction,
        isAuctionStarted: false,
        minimumBid: 0,
        bidderId: "",
        bidderName: "",
        isAuctionEnded: false
      }

      await axios.post("http://localhost:5000/streamings", streaming)
        .then(res => {
          console.log("Streaming " + res.data._id + " has started");
          setStreamId(res.data._id);
        }).catch(error => {
          console.log(error);
        });

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
      .then(res => {
        // Video
        var videoElement = document.querySelector("video");
        let stream = videoElement.srcObject;
        stream.getTracks()[0].stop();
        stream.getTracks()[1].stop();

        // Peer connection
        peerConnections = {};

        // Socket
        //socket.disconnect();

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
      .then(function (devices) {
        setDeviceInfos(devices);
      })
      .catch(function (err) {
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
      try {
        const response = await fetch(`http://localhost:5000/shops/${userData.userId}`);
        const result = await response.json();
        setShop(result);
        setLoading(false);
      } catch (error) {
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
      console.log("viewer answer: " + id);
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on("viewer_joined", viewerId => {
      console.log("viewer_joined: " + viewerId);
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

    socket.on("auction_make_bid", (data) => {
      setBiddingnData(data);
      console.log(data);
    });

    socket.on("disconnectPeer", id => {
      console.log("disconnectPeer id: " + id);
      delete peerConnections[id];
    });
  }, []);


  // --------------------- Sell Product -----------------------
  // Product
  const [firstUpdate, setFirstUpdate] = useState(true);
  const [productOnSale, setProductOnSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/seller/${shop._id}`);
      const result = await response.json();
      setProducts(result);
      setShowProducts(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (firstUpdate === true) {
      setFirstUpdate(false);
      return;
    }
    if (showProducts === true)
      setShowProducts(false);
    if (isAuction === true)
      return;
    if (productOnSale !== null)
      dbUpdateStreamingProductId();
    else
      dbRemoveStreamingProductId();
  }, [productOnSale]);


  const startSale = (product) => {
    setProductOnSale(product);
  }

  const endSale = () => {
    setProductOnSale(null);
  }

  const dbUpdateStreamingProductId = () => {
    const streaming = {
      productId: productOnSale._id
    };

    axios.put(`http://localhost:5000/streamings/${streamId}`, streaming)
      .then(res => {
        console.log(res);
        if (!isAuction)
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


  // --------------------- Auction Product -----------------------
  const [isAuctionStarted, setIsAuctionStarted] = useState(false);
  const [minimumBid, setMinimumBid] = useState(0);
  const [biddingData, setBiddingnData] = useState(
    {
      bidderId: "",
      bid: 0,
      bidderName: ""
    }
  );
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
  } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => auctionRoundEnd() });


  const startAuction = () => {
    setIsAuctionStarted(true);
  }

  useEffect(() => {
    if (isAuctionStarted === true)
      dbUpdateAuctionStreaming();
  }, [isAuctionStarted]);

  const dbUpdateAuctionStreaming = () => {
    const streaming = {
      productId: productOnSale._id,
      isAuctionStarted: isAuctionStarted,
      minimumBid: biddingData.bid > minimumBid ? biddingData.bid : minimumBid,
      bidderId: biddingData.bidderId,
      bidderName: biddingData.bidderName,
      isAuctionEnded: isAuctionEnded
    };

    console.log(streaming);

    axios.put(`http://localhost:5000/streamings/${streamId}`, streaming)
      .then(res => {
        console.log(res);
        if (isAuctionEnded) {
          emitSocketEndAuction();
        } else if (biddingData.bid > minimumBid) {
          setMinimumBid(biddingData.bid);
          emitSocketAuctionNewHighestBid();
          auctionResetTimer();
        } else {
          socketEmitStartAuction();
        }
      }).catch(error => {
        console.log(error);
      });
  }

  const socketEmitStartAuction = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: `${productOnSale.name} is for auction now!`,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    setCommentList((list) => [...list, commentData]);
    socket.emit("start_auction", commentData);
  }

  const auctionNextRound = () => {
    socketEmitAuctionNextRound();
    const time = new Date();
    time.setSeconds(time.getSeconds() + 30);
    restart(time);
  }

  const socketEmitAuctionNextRound = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: "Next Round! Bid now.",
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    setCommentList((list) => [...list, commentData]);
    socket.emit("auction_next_round", commentData);
  }

  const auctionRoundEnd = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: "Round End! No more Bid",
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    setCommentList((list) => [...list, commentData]);
    socket.emit("write_comment", commentData);
  }

  const auctionResetTimer = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 30);
    restart(time);
    pause();
  }

  useEffect(() => {
    if (biddingData.bid > minimumBid) {
      dbUpdateAuctionStreaming();
    }
  }, [biddingData]);

  const emitSocketAuctionNewHighestBid = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: `${biddingData.bidderName} made a bid! Current Highest bid: RM${biddingData.bid}.`,
    };
    setCommentList((list) => [...list, commentData]);
    socket.emit("auction_new_highest_bid", commentData);
  }

  const endAuction = () => {
    setIsAuctionEnded(true);
  }

  useEffect(() => {
    if (isAuctionEnded === true) {
      dbUpdateAuctionStreaming();
      dbOrderAuctionItemForBidder();
    }
  }, [isAuctionEnded]);

  const dbOrderAuctionItemForBidder = () => {
    const order = {
      userId: biddingData.bidderId,
      productId: productOnSale._id,
      quantity: 1,
      shopId: productOnSale.shopId
    };

    axios.post('http://localhost:5000/orders', order)
      .then(res => {
        console.log(res);
      }).catch(error => {
        console.log(error);
      });
  }


  const emitSocketEndAuction = () => {
    const commentData = {
      room: streamId,
      author: "System",
      message: `Congratulations! ${biddingData.bidderName} win the auction with RM${biddingData.bid}.`,
    };
    setCommentList((list) => [...list, commentData]);
    socket.emit("end_auction", commentData);
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
                  onChange={event => { setStreamTitle(event.target.value) }}
                  className="uwu-input"
                />
              </div>

              {/* Video Setting */}
              <div>Camera</div>
              <div>
                <select id="videoSource" value={videoSource} onChange={(event) => setVideoSource(event.target.value)} className="uwu-select">
                  {deviceInfos ? deviceInfos.filter(device => device.kind === "videoinput").map(videoDevice => {
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
                <select id="audioSource" value={audioSource} onChange={(event) => setAudioSource(event.target.value)} className="uwu-select">
                  {deviceInfos ? deviceInfos.filter(device => device.kind === "audioinput").map(audioDevice => {
                    return <option key={audioDevice.deviceId} value={audioDevice.deviceId}>{audioDevice.label}</option>
                  })
                    :
                    <option>No audio device found.</option>
                  }
                </select>
              </div>

              {/* Streaming Type */}
              <div>Streaming Type</div>
              <div>
                <select id="audioSource" value={isAuction} onChange={(event) => setIsAuction(event.target.value)} className="uwu-select">
                  <option value={false}>Normal</option>
                  <option value={true}>Auction</option>
                </select>
              </div>
              <div>
                <button onClick={startStreaming} className="uwu-btn">Start Streaming</button>
              </div>
            </div>
          </div>
          :
          <div className="sections">

            {!isAuction ?


              // Normal Shop
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
                      <button onClick={endSale} className="uwu-btn uwu-btn-red">End Sale</button>
                    </div>
                    :
                    <div>
                      <button onClick={fetchProducts} className="uwu-btn">Start Sale</button>
                    </div>
                  }

                </div>
              </div>
              :


              // Auction Shop
              <div className="streaming-shop">
                <h2>{shop.shopName}</h2>

                <div className="streaming-shop-body">
                  <div className="streaming-shelf">
                    <img src={AuctionTablePNG} alt="shelf" className="shelf"></img>
                    {productOnSale ?
                      <img src={productOnSale.imageUrl} alt="product" className="streaming-product"></img>
                      :
                      <div className="streaming-noproduct noselect">Nothing on auction</div>
                    }
                  </div>

                  {productOnSale ?
                    <div className="productOnSale">
                      <h3>{productOnSale.name}</h3>
                      {!isAuctionStarted ?
                        <div className="productOnSale-detail">
                          <p>Product Price: RM {productOnSale.price}</p>
                          <p>{productOnSale.countInStock} left</p>
                        </div>
                        :
                        <div className="productOnSale-detail">
                          <p>Current Highest Bid</p>
                          <p>{minimumBid}</p>
                        </div>
                      }

                    </div>
                    :
                    <div className="center grey noselect">
                      <p>Before starting an auction, Please choose an item for the auction.</p>
                    </div>
                  }


                  {productOnSale ?
                    <div>
                      {isAuctionStarted ?
                        <div>
                          {isAuctionEnded ?
                            <div className="auction-win-message noselect center">
                              The Winner is {biddingData.bidderName} !!
                            </div>
                            :
                            <div>
                              <div className="center grey noselect">{isRunning ? "Wait for someone bids..." : "Buyer will only able to bid after you click next round."}</div>
                              <button onClick={auctionNextRound} className="uwu-btn" disabled={isRunning}>Next Round</button>
                              <button onClick={endAuction} className="uwu-btn uwu-btn-red" disabled={isRunning}>End Auction</button>
                            </div>
                          }
                        </div>
                        :
                        <div>
                          <div className="center grey noselect">{minimumBid != 0 ? "Start Auction if you are ready." : "Please Set Minimum Bid."}</div>
                          <input
                            type="number"
                            value={minimumBid}
                            onChange={(event) => setMinimumBid(event.target.value)}
                            min="1"
                            className="uwu-input"
                          />
                          <button onClick={fetchProducts} className="uwu-btn">Change Auction Item</button>
                          {minimumBid != 0 ?
                            <button onClick={startAuction} className="uwu-btn uwu-btn-yellow">Start Auction</button>
                            :
                            <div></div>
                          }
                        </div>
                      }
                    </div>
                    :
                    <div>
                      <button onClick={fetchProducts} className="uwu-btn">Choose Auction Item</button>
                    </div>
                  }

                </div>
              </div>
            }

            {showProducts ?
              <ProductForSale
                products={products}
                setShowProducts={setShowProducts}
                startSale={startSale}
              />
              :
              <div></div>
            }

            <CommentSection
              author={shop.shopName}
              streamId={streamId}
              socket={socket}
              commentList={commentList}
              setCommentList={setCommentList}
            />

          </div>
        }
      </div>

    </div >
  )
}

export default StreamingSellerScreen
