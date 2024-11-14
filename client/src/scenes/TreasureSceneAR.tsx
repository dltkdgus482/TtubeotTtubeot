import React, { useState, useEffect, useCallback } from 'react';
import {
  ViroARScene,
  ViroBox,
  ViroMaterials,
  ViroARPlane,
  ViroAnimations,
  ViroSphere,
  ViroParticleEmitter,
} from '@reactvision/react-viro';
import useTreasureStore from '../store/treasure';
import { Vibration } from 'react-native';

const sandTexture = require('../assets/textures/SandTexture.jpg');
const crackTextures = [
  require('../assets/cracks/crack.png'),
  // require('../assets/cracks/crack1.png'),
  // require('../assets/cracks/crack2.png'),
  // require('../assets/cracks/crack3.png'),
  // require('../assets/cracks/crack4.png'),
  // require('../assets/cracks/crack5.png'),
  // require('../assets/cracks/crack6.png'),
  // require('../assets/cracks/crack7.png'),
  // require('../assets/cracks/crack8.png'),
];
const boxTexture = [
  require('../assets/boxes/box1.jpg'),
  require('../assets/boxes/box2.jpg'),
  require('../assets/boxes/box3.jpg'),
  require('../assets/boxes/box4.jpg'),
];
const getRandomBox = () => {
  const idx = Math.floor(Math.random() * boxTexture.length);
  return boxTexture[idx];
};

const getRandomCrack = () => {
  const idx = Math.floor(Math.random() * crackTextures.length);
  return crackTextures[idx];
};

ViroMaterials.createMaterials({
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
  const { hasTreasure, isDigging, setHasTreasure, setIsDigging } =
    useTreasureStore();
  const [boxTexture, setBoxTexture] = useState(null);
  const [crackTexture, setCrackTexture] = useState(null);
  const [objectPosition, setObjectPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [boxPositionY, setBoxPositionY] = useState(0);
  const [runAnimation, setRunAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('shakeLeft');
  const [particleAnimation, setParticleAnimation] = useState(
    Array(50).fill(false),
  );
  const [unboxingListener, setUnboxingListener] = useState(false);
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [diggingParticles, setDiggingParticles] = useState<any[]>([]);
  const [diggingInterval, setDiggingInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [diggingComplete, setDiggingComplete] = useState(false);
  const [crackLoading, setCrackLoading] = useState(true);
  const offsets = [
    [0.2, 0, 0.2],
    [-0.2, 0, 0.2],
    [0.2, 0, -0.2],
    [-0.2, 0, -0.2],
  ];

  useEffect(() => {
    setBoxTexture(getRandomBox());
    setCrackTexture(getRandomCrack());
  }, []);

  useEffect(() => {
    if (boxTexture) {
      ViroMaterials.createMaterials({
        box: {
          diffuseColor: '#F0D4A7',
          lightingModel: 'Constant',
          bloomThreshold: 0.2126,
          shininess: 0.6,
          diffuseTexture: boxTexture,
          normalTexture: boxTexture,
        },
      });
    }
  }, [boxTexture]);

  useEffect(() => {
    if (crackTexture) {
      ViroMaterials.createMaterials({
        crack: {
          diffuseColor: '#ffffff',
          // blendMode: 'Add',
          lightingModel: 'Constant',
          bloomThreshold: 0.8126,
          shininess: 0.6,
          diffuseTexture: crackTexture,
          normalTexture: crackTexture,
        },
      });
      setCrackLoading(false);
    }
  }),
    [crackTexture];

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
    if (!diggingComplete) {
      setBoxPositionY(0);
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
        setDiggingComplete(true);
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
            {boxPositionY > 0 && (
              <ViroBox
                position={[
                  objectPosition[0],
                  boxPositionY === 0.2 ? 0.3 : boxPositionY,
                  objectPosition[2],
                ]}
                scale={[0.2, boxPositionY, 0.2]}
                materials={['box']}
                animation={renderAnimation()}
                onClick={runAnimation ? handleClickBox : undefined}
                lightReceivingBitMask={10}
              />
            )}

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
            {!crackLoading && (
              <ViroBox
                position={objectPosition}
                scale={[0.7, 0, 0.7]}
                rotation={[0, -90, 0]}
                materials={['crack']}
                onClickState={stateValue => {
                  if (stateValue === 1) {
                    handleDiggingStart();
                  } else if (stateValue === 2) {
                    handleDiggingEnd();
                  }
                }}
              />
            )}
            {offsets.map((offset, index) => (
              <ViroParticleEmitter
                key={index}
                position={[
                  objectPosition[0] + offset[0],
                  objectPosition[1] + offset[1],
                  objectPosition[2] + offset[2],
                ]}
                duration={2000}
                run={true}
                image={{
                  source: require('../assets/textures/firework.png'),
                  height: 0.2,
                  width: 0.2,
                  bloomThreshold: 1,
                }}
              />
            ))}
          </>
        )}
      </ViroARPlane>
    </ViroARScene>
  );
};

export default TreasureSceneAR;
