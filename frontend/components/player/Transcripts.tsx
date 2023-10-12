import React from 'react';

const transcriptData = "Lorem ipsum..."; // This could be fetched from an API or stored in a state.

const Transcripts: React.FC = () => {
  return (
    <div className="transcripts-container">
      <h2>Transcript</h2>
      <div className="transcript-content">
        {transcriptData}
      </div>
    </div>
  );
}

export default Transcripts;
