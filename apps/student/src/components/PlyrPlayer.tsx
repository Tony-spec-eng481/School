import React from 'react';
import { Plyr, type PlyrProps } from 'plyr-react';
import 'plyr-react/plyr.css';

interface PlyrPlayerProps {
  url: string;
  type: 'video' | 'audio';
  title?: string;
}

const PlyrPlayer: React.FC<PlyrPlayerProps> = ({ url, type, title }) => {
  const plyrProps: PlyrProps = {
    source: {
      type: type,
      title: title || 'Media',
      sources: [
        {
          src: url,
        },
      ],
    },
    options: {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        'fullscreen',
      ],
      ratio: type === 'video' ? '16:9' : undefined,
    },
  };

  return <Plyr {...plyrProps} />;
};

export default PlyrPlayer;
