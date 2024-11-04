import React, { useState, useEffect } from 'react';
import {
  ViroARScene,
  ViroText,
  ViroBox,
  ViroMaterials,
  ViroARPlane,
  ViroAnimations,
  ViroSphere,
} from '@reactvision/react-viro';
import useTreasureStore from '../store/treasure';

const woodenTexture = require('../assets/images/WoodenTexture.jpg');
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
});

ViroMaterials.createMaterials({
  glowingCoin: {
    diffuseColor: '#FFFF00',
    lightingModel: 'Constant',
    bloomThreshold: 0.2126,
    shininess: 0.6,
    diffuseTexture: coinIcon,
    normalTexture: coinIcon,
  },
});

ViroMaterials.createMaterials({
  glowingYellow: {
    diffuseColor: '#FFFFE0',
    blendMode: 'Add',
  },
});

ViroAnimations.registerAnimations({
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
});

const TreasureSceneAR = () => {
  const [objectPosition, setObjectPosition] = useState([0, 0, 0]);
  const [boxPositionY, setBoxPositionY] = useState(0);
  const [runAnimation, setRunAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('shakeLeft');
  const [unboxingListener, setUnboxingListener] = useState(false);
  const [isUnboxed, setIsUnboxed] = useState(false);

  const setHasTreasure = useTreasureStore(state => state.setHasTreasure);

  const handlePlaneDetected = () => {
    const randomX = (Math.random() - 0.5) * 3;
    const randomZ = (Math.random() - 0.5) * 3;
    setObjectPosition([randomX, 0, randomZ]);
  };

  const handleClick = () => {
    if (boxPositionY < 0.2) {
      setBoxPositionY(prevY => Math.min(prevY + 0.02, 0.2));
    }
  };

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

  return (
    <ViroARScene>
      <ViroARPlane
        minHeight={0.5}
        minWidth={0.5}
        alignment="Horizontal"
        onAnchorFound={handlePlaneDetected}>
        {isUnboxed ? (
          <ViroBox
            position={[objectPosition[0], 0.3, objectPosition[2]]}
            scale={[0.2, 0.2, 0]}
            materials={['glowingCoin']}
            animation={{ name: 'loopRotate', run: true, loop: true }}
            onClick={() => getTreasure()}
          />
        ) : (
          boxPositionY > 0 && (
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
          )
        )}
        <ViroSphere
          position={[objectPosition[0], objectPosition[1], objectPosition[2]]}
          radius={0.6}
          scale={[0.7, 0.1, 0.7]}
          materials={['glowingYellow']}
          onClick={handleClick}
        />
      </ViroARPlane>
    </ViroARScene>
  );
};

export default TreasureSceneAR;
