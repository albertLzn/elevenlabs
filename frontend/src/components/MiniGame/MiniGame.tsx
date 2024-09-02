
import React, { useState, useEffect, useCallback } from 'react';
import { PlanetImages } from '../../constants/planetImages';
import styles from './MiniGame.module.css';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bullet extends GameObject {
  active: boolean;
}

interface Target extends GameObject {
  active: boolean;
  image?: string;
}

const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const TARGET_WIDTH = 20;
const TARGET_HEIGHT = 20;

export function MiniGame({ planetName }: { planetName: string }) {
  const [player, setPlayer] = useState<GameObject>({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 10, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setPlayer(prev => ({
      ...prev,
      x: Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, prev.x + (direction === 'left' ? -5 : 5)))
    }));
  }, []);

  const shoot = useCallback(() => {
    setBullets(prev => [...prev, { x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: player.y, width: BULLET_WIDTH, height: BULLET_HEIGHT, active: true }]);
  }, [player]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') movePlayer('left');
      if (e.key === 'ArrowRight') movePlayer('right');
      if (e.key === ' ') shoot();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, shoot]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameOver) return;

      setBullets(prev => prev.map(bullet => ({ ...bullet, y: bullet.y - 5 })).filter(bullet => bullet.y > 0));

      setTargets(prev => {
        const newTargets = prev.map(target => ({ ...target, y: target.y + 1 }));
        if (newTargets.filter(target => target.y > GAME_HEIGHT).length >= 3) {
          setGameOver(true);
          setScore(0);
        }
        return newTargets.filter(target => target.y < GAME_HEIGHT && target.active);
      });

      setBullets(prev => prev.filter(bullet => {
        const hitTarget = targets.find(target => 
          bullet.x < target.x + target.width &&
          bullet.x + bullet.width > target.x &&
          bullet.y < target.y + target.height &&
          bullet.y + bullet.height > target.y &&
          target.active
        );
        if (hitTarget) {
          setScore(s => s + 1);
          setTargets(t => t.map(target => 
            target === hitTarget ? { ...target, active: false } : target
          ));
          return false;
        }
        return true;
      }));

      if (Math.random() < 0.02 + (level * 0.01)) {
        const newTarget: Target = {
          x: Math.random() * (GAME_WIDTH - TARGET_WIDTH),
          y: 0,
          width: TARGET_WIDTH,
          height: TARGET_HEIGHT,
          active: true,
          image: PlanetImages[planetName as keyof typeof PlanetImages]
        };
        setTargets(prev => [...prev, newTarget]);
      }

      setLevel(prev => Math.floor(score / 10) + 1);
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameOver, score, level, targets, planetName]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTargets([]);
    setBullets([]);
    setPlayer({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 10, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
  };

  return (
    <div className={styles.game}>
      <div className={styles.score}>Score: {score}</div>
      <div className={styles.level}>Level: {level}</div>
      {showTutorial && (
        <div className={styles.tutorial}>
          <p>Use arrow keys to move left and right</p>
          <p>Press spacebar to shoot</p>
          <button onClick={() => setShowTutorial(false)}>Got it!</button>
        </div>
      )}
      {gameOver && (
        <div className={styles.gameOver}>
          <p>Game Over</p>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
      <div className={styles.gameArea} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        <div className={styles.player} style={{ left: player.x, top: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }}></div>
        {bullets.map((bullet, index) => (
          <div key={index} className={styles.bullet} style={{ left: bullet.x, top: bullet.y, width: BULLET_WIDTH, height: BULLET_HEIGHT }}></div>
        ))}
        {targets.map((target, index) => (
          target.active && (
            target.image ? (
              <img
                key={index}
                src={target.image}
                className={styles.target}
                style={{ left: target.x, top: target.y, width: TARGET_WIDTH, height: TARGET_HEIGHT }}
                alt="Target"
              />
            ) : (
              <div
                key={index}
                className={styles.target}
                style={{ left: target.x, top: target.y, width: TARGET_WIDTH, height: TARGET_HEIGHT }}
              ></div>
            )
          )
        ))}
      </div>
    </div>
  );
}
