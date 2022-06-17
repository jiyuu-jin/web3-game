import Game from '../utils/scenes/Game';
import { useEffect } from 'react';
import 'phaser';
import config from 'utils/config';

export default function Index() {
  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    if (typeof window !== 'object') {
      return;
    }

    new Phaser.Game(
      Object.assign(config, {
        scene: [Game]
      })
    );
  };

  return null;
}
