import './Streaming.css';
import {Link} from 'react-router-dom';

const Streaming = ({_id, title, shopName}) => {
  return (
    <div className="streaming-card">
      <div className="gradient"></div>
      <Link to={`/streamingbuyer/${_id}`}>
        <h3 className="streaming-title">{title}</h3>
        <p className="streaming-shopName">{shopName}</p>
      </Link>
      <img src="http://cdn2.hubspot.net/hubfs/53/00-Blog_Thinkstock_Images/Live_Streaming_Video_Guide.jpg" className="streaming-image" alt="streamingImg"/>
      <div className="streaming-icon">Live</div>
    </div>
  )
}

export default Streaming
