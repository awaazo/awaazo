import React, { useState } from 'react';

const buttonStyle = {
  width: '7em',
  borderRadius: '10em',
  margin: '15px',
  padding: '9px',
  color: '#fff',
  transition: 'opacity 0.8s',
  border: '2px solid rgba(255, 255, 255, 0.2)',
};
import techImage from '../../styles/images/genres/tech.png';
import { StaticImageData } from 'next/image';



const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, category: 'User', message: 'New follower: John Doe', image: techImage },
    { id: 2, category: 'Episode', message: 'New episode released: Episode 123', image: techImage },
    { id: 3, category: 'User', message: 'Friend request from Jane Smith', image: techImage },
    // Add more notifications as needed
  ]);

  const [filter, setFilter] = useState('All');

  const filteredNotifications = filter === 'All' ? notifications : notifications.filter(n => n.category === filter);

  return (
    <>
      <h1
        style={{
          color: 'white',
          fontSize: '2em',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0.5em 0',
          textShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        }}
      >"username", catch up on {notifications.length} notifications.</h1>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}>
        <button
          style={{ ...buttonStyle, backgroundColor: filter === 'All' ? '#007bff' : 'rgba(255, 255, 255, 0.1)', backdropFilter: filter === 'All' ? 'blur(25px)' : 'none', opacity: filter === 'All' ? 1 : 0.7 }}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: filter === 'User' ? '#007bff' : 'rgba(255, 255, 255, 0.1)', backdropFilter: filter === 'User' ? 'blur(25px)' : 'none', opacity: filter === 'User' ? 1 : 0.7 }}
          onClick={() => setFilter('User')}
        >
          User
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: filter === 'Episode' ? '#007bff' : 'rgba(255, 255, 255, 0.1)', backdropFilter: filter === 'Episode' ? 'blur(25px)' : 'none', opacity: filter === 'Episode' ? 1 : 0.7 }}
          onClick={() => setFilter('Episode')}
        >
          Episode
        </button>
      </div>

      <div style={{ display: 'grid', placeItems: 'center', gap: '20px', marginTop: '20px' }}>
        {filteredNotifications.map(notification => (
          <div key={notification.id} style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #E5E7EB29',
            padding: '20px',
            borderRadius: '20px',
            width: '60vw',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 0 25px rgba(0, 0, 0, 0.3)',
            marginBottom: '20px',
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}>
           <div style={{ position: 'relative' }}>
             <img
                src={notification.image.src as string}  
                alt={notification.category}
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '20px'}}
              />
                <img
                  src={notification.image.src as string}  
                  alt={notification.category}
                  style={{ 
                    width: '55px', 
                    height: '55px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    marginRight: '10px', 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-70%, -50%)', 
                    zIndex: -1,
                    filter: 'blur(13px)' 
                  }}
              />
           </div>
            <div>
              <strong style={{
                color: '#E8E8E8',
                marginBottom: '10px',
                display: 'block',
              }}>{notification.category}:</strong>
              <span style={{ color: '#fff' }}>{notification.message}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationsPage;
