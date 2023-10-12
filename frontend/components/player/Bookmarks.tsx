import React from 'react';

const bookmarksData = [
  { timestamp: "03:02", description: "This point was interesting" },
  { timestamp: "05:04", description: "Cool point they mentioned" },
  // ... other bookmarks
];

const Bookmarks: React.FC = () => {
  return (
    <div className="bookmarks-container">
      <h2>Bookmarks</h2>
      {bookmarksData.map((bookmark, index) => (
        <div key={index} className="bookmark">
          <span className="timestamp">{bookmark.timestamp}</span>
          <span className="description">{bookmark.description}</span>
        </div>
      ))}
    </div>
  );
}

export default Bookmarks;
