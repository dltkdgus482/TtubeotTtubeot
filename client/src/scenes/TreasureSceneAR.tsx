import React, { useState, useEffect, useCallback } from 'react';
import {
  ViroARScene,
  ViroBox,
  ViroMaterials,
  ViroARPlane,
  ViroAnimations,
  ViroSphere,
} from '@reactvision/react-viro';
import useTreasureStore from '../store/treasure';
import { Vibration } from 'react-native';

const woodenTexture = require('../assets/images/WoodenTexture.jpg');
const sandTexture = require('../assets/images/SandTexture.jpg');
const dirtTexture = require('../assets/images/DirtTexture.jpg');
const coinIcon = require('../assets/icons/coinIcon.png');

ViroMaterials.createMaterials({
  glowingBox: {
    diffuseColor: '#F0D4A7',
    lightingModel: 'Constant',
    bloomThreshold: 0.2126,
    shininess: 0.6,
    diffuseTexture: woodenTexture,
    normalTexture: woodenTexture,
  },
  glowingCoin: {
    diffuseColor: '#FFFF00',
    lightingModel: 'Constant',
    bloomThreshold: 0.2126,
    shininess: 0.6,
    diffuseTexture: coinIcon,
    normalTexture: coinIcon,
  },
  glowingYellow: {
    diffuseColor: '#E8C7AB',
    blendMode: 'None',
    diffuseTexture: dirtTexture,
    normalTexture: dirtTexture,
  },
  sandParticle: {
    diffuseColor: '#efac75',
    diffuseTexture: sandTexture,
    normalTexture: sandTexture,
  },
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

Array.from({ length: 50 }).forEach((_, index) => {
  ViroMaterials.createMaterials({
    [`UnboxParticle_${index}`]: {
      diffuseColor: getRandomColor(),
      lightingModel: 'Constant',
      blendMode: 'Add',
      bloomThreshold: 0.1,
      shininess: 0.1,
    },
  });
});

ViroAnimations.registerAnimations({
  initializeRotation: {
    properties: {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
    },
    duration: 100,
  },
  loopRotate: {
    properties: {
      rotateY: '+=360',
    },
    duration: 3000,
    easing: 'Linear',
  },
  shakeLeft: {
    properties: {
      rotateX: '-=10',
      rotateZ: '-=10',
    },
    duration: 10,
    easing: 'Linear',
  },
  shakeRight: {
    properties: {
      rotateX: '+=10',
      rotateZ: '+=10',
    },
    duration: 10,
    easing: 'Linear',
  },
  unbox: {
    properties: {
      positionY: 0.08,
    },
    duration: 800,
    easing: 'EaseIn',
  },
});

const TreasureSceneAR = () => {
  const [objectPosition, setObjectPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [boxPositionY, setBoxPositionY] = useState(0);
  const [runAnimation, setRunAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('shakeLeft');
  // const [currentCoinAnimation, setCurrentCoinAnimation] =
  //   useState('initializeRotation');
  const [particleAnimation, setParticleAnimation] = useState(
    Array(50).fill(false),
  );
  const [unboxingListener, setUnboxingListener] = useState(false);
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [diggingParticles, setDiggingParticles] = useState<any[]>([]);
  const [isDigging, setIsDigging] = useState(false);
  const [diggingInterval, setDiggingInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  const setHasTreasure = useTreasureStore(state => state.setHasTreasure);

  const handlePlaneDetected = () => {
    if (isDetected) return;

    const randomX = (Math.random() - 0.5) * 3;
    const randomZ = (Math.random() - 0.5) * 3;
    setObjectPosition([randomX, 0, randomZ]);
    setIsDetected(true);
  };

  const handleDiggingStart = () => {
    if (boxPositionY >= 0.2 || isDigging) return;
    setIsDigging(true);

    const intervalId = setInterval(() => {
      setBoxPositionY(prevY => {
        const newY = Math.min(prevY + 0.04, 0.2);
        if (newY >= 0.2) {
          clearInterval(intervalId);
          setIsDigging(false);
        }
        Vibration.vibrate();
        return newY;
      });

      const newParticles = Array.from({ length: 35 }).map((_, index) => {
        const randomDirectionX = (Math.random() - 0.5) * 2;
        const randomDirectionZ = (Math.random() - 0.5) * 2;
        const distanceMultiplier = 0.25;

        const targetX = randomDirectionX * distanceMultiplier;
        const targetZ = randomDirectionZ * distanceMultiplier;

        const randomScale = 0.014 + Math.random() * 0.014;

        const randomDeltaY = Math.random() * 0.009;
        const animationName = `diggingFlyAnimation_${index}_${Date.now()}`;

        ViroAnimations.registerAnimations({
          [animationName]: {
            properties: {
              positionX: `+=${targetX}`,
              positionZ: `+=${targetZ}`,
            },
            duration: 420,
            easing: 'EaseInEaseOut',
          },
        });

        return {
          id: `${index}_${Date.now()}`,
          position: [objectPosition[0], 0.12 + randomDeltaY, objectPosition[2]],
          animationName,
          scale: [randomScale, randomScale, randomScale],
        };
      });

      setDiggingParticles(newParticles);
    }, 500);

    setDiggingInterval(intervalId);
  };

  const handleDiggingEnd = () => {
    setDiggingParticles([]);
    if (diggingInterval) {
      clearInterval(diggingInterval);
      setDiggingInterval(null);
      setIsDigging(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDiggingParticles([]);
    }, 600);

    return () => clearTimeout(timeout);
  }, [diggingParticles]);

  const handleClickBox = () => {
    setUnboxingListener(true);
  };

  const renderAnimation = () => {
    if (unboxingListener) {
      return {
        name: currentAnimation,
        run: true,
        loop: false,
        interruptible: true,
        onFinish: () => {
          setCurrentAnimation(prev =>
            prev === 'shakeLeft' ? 'shakeRight' : 'shakeLeft',
          );
          Vibration.vibrate();
        },
      };
    } else if (runAnimation) {
      return { name: 'loopRotate', run: true, loop: true };
    } else {
      return undefined;
    }
  };

  const getTreasure = () => {
    setHasTreasure(true);
  };

  useEffect(() => {
    if (unboxingListener) {
      if (currentAnimation === 'shakeLeft') {
        setTimeout(() => {
          setCurrentAnimation('shakeRight');
        }, 100);
      } else {
        setTimeout(() => {
          setCurrentAnimation('shakeLeft');
        }, 100);
      }
    }
  }, [currentAnimation, unboxingListener]);

  useEffect(() => {
    if (unboxingListener) {
      setTimeout(() => {
        setUnboxingListener(false);
        setIsUnboxed(true);
      }, 2500);
    }
  }, [unboxingListener]);

  useEffect(() => {
    if (boxPositionY >= 0.2) {
      setTimeout(() => {
        setRunAnimation(true);
      }, 500);
    }
  }, [boxPositionY]);

  useEffect(() => {
    if (isUnboxed) {
      setTimeout(() => {
        getTreasure();
      }, 1500);
    }
  }, [isUnboxed]);

  return (
    <ViroARScene>
      <ViroARPlane
        minHeight={0.5}
        minWidth={0.5}
        alignment="Horizontal"
        onAnchorFound={handlePlaneDetected}>
        {isUnboxed && (
          <>
            {/* <ViroBox
              position={[objectPosition[0], 0.3, objectPosition[2]]}
              scale={[0.2, 0.2, 0]}
              materials={['glowingCoin']}
              animation={renderCoinAnimation()}
              onClick={() => getTreasure()}
            /> */}
            {Array.from({ length: 50 }).map((_, index) => {
              const randomDirectionX = (Math.random() - 0.5) * 2;
              const randomDirectionZ = (Math.random() - 0.5) * 2;

              const distanceMultiplier = 0.4;
              const targetX = randomDirectionX * distanceMultiplier;
              const targetZ = randomDirectionZ * distanceMultiplier;

              const randomScale = 0.02 + Math.random() * 0.03;

              const animationName = `unBoxAnimation_${index}`;

              ViroAnimations.registerAnimations({
                [animationName]: {
                  properties: {
                    positionX: `+=${targetX}`,
                    positionZ: `+=${targetZ}`,
                    positionY: '+=0.08',
                  },
                  duration: 500,
                  easing: 'EaseInEaseOut',
                },
              });

              return (
                <ViroSphere
                  key={index}
                  position={[objectPosition[0], 0.2, objectPosition[2]]}
                  scale={[randomScale, randomScale, randomScale]}
                  materials={[`UnboxParticle_${index}`]}
                  animation={{
                    name: particleAnimation[index] ? 'unbox' : animationName,
                    run: true,
                    loop: false,
                    delay: 100,
                    onFinish: () => {
                      setParticleAnimation(prev => {
                        const newAnimations = [...prev];
                        newAnimations[index] = true;
                        return newAnimations;
                      });
                    },
                  }}
                />
              );
            })}
          </>
        )}
        {!isUnboxed && boxPositionY >= 0 && (
          <>
            <ViroBox
              position={[
                objectPosition[0],
                boxPositionY === 0.2 ? 0.3 : boxPositionY,
                objectPosition[2],
              ]}
              scale={[0.2, boxPositionY, 0.2]}
              materials={['glowingBox']}
              animation={renderAnimation()}
              onClick={runAnimation ? handleClickBox : undefined}
              lightReceivingBitMask={10}
            />

            {diggingParticles.map(({ id, position, animationName, scale }) => (
              <ViroSphere
                key={id}
                position={position}
                scale={scale}
                materials={['sandParticle']}
                animation={{
                  name: animationName,
                  run: true,
                  loop: false,
                  delay: 100,
                }}
              />
            ))}

            <ViroSphere
              position={[
                objectPosition[0],
                objectPosition[1],
                objectPosition[2],
              ]}
              radius={0.6}
              scale={[0.7, 0.1, 0.7]}
              materials={['glowingYellow']}
              onClickState={stateValue => {
                if (stateValue === 1) {
                  handleDiggingStart();
                } else if (stateValue === 2) {
                  handleDiggingEnd();
                }
              }}
            />
          </>
        )}
      </ViroARPlane>
    </ViroARScene>
  );
};

export default TreasureSceneAR;
