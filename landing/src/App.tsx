import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import forestBackground from "./assets/6202160.jpg";
import ttubeotLogo from "./assets/ttubeot.png";
import ttuDogBig from "./assets/ttubeot/ttu_dog_big.png";
import ttuElephant from "./assets/ttubeot/ttu_elephant.png";
import ttuRabbit from "./assets/ttubeot/ttu_rabbit.png";
import ttuFox from "./assets/ttubeot/ttu_fox.png";

function App() {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animalImage, setAnimalImage] = useState<string>("");
  const [animationClass, setAnimationClass] = useState("");
  const [arrowAnimation, setArrowAnimation] = useState("arrowMoveDown");

  const scaleValues = {
    section0: 1,
    section1: 1.2,
    section2: 1.4,
    section3: 1.6,
  };

  // 각 scale 값에 따라 표시할 동물 이미지와 애니메이션 방향을 매핑합니다.
  const animalMap = {
    1: { image: ttuDogBig, animation: "slideInRight" },
    1.2: { image: ttuRabbit, animation: "slideInLeft" },
    1.4: { image: ttuElephant, animation: "slideInRight" },
    1.6: { image: ttuFox, animation: "slideInLeft" },
  };

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("data-id");
          if (sectionId) {
            const newScale =
              scaleValues[`section${sectionId}` as keyof typeof scaleValues];
            if (newScale) {
              setScale(newScale);
            }
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    const backgroundElement = document.querySelector(
      ".backgroundContainer"
    ) as HTMLDivElement;
    if (backgroundElement) {
      backgroundElement.style.transform = `scale(${scale})`;
    }

    // 현재 scale 값에 맞는 동물 이미지와 애니메이션 방향을 설정합니다.
    if (animalMap[scale as keyof typeof animalMap]) {
      setAnimalImage(animalMap[scale as keyof typeof animalMap].image);
      setAnimationClass(animalMap[scale as keyof typeof animalMap].animation);
    }

    if (scale <= 1.2) {
      setArrowAnimation("arrowMoveDown");
    } else {
      setArrowAnimation("arrowMoveUp");
    }
  }, [scale]);

  useEffect(() => {
    const landingElement = document.querySelector(".landing") as HTMLDivElement;
    if (landingElement) {
      landingElement.style.backgroundColor = isModalOpen ? "black" : "white";
    }
  }, [isModalOpen]);

  return (
    <div className="landing">
      <div className="backgroundContainer">
        <img src={forestBackground} alt="forest background" />
      </div>
      <div className="ttubeotLogoContainer">
        <img src={ttubeotLogo} alt="ttubeot logo" className="ttubeotLogo" />
      </div>
      <div className="contentWrapper" ref={contentWrapperRef}>
        <div className="content">
          <div className="section" data-id="0"></div>
          <div className="section" data-id="1"></div>
          <div className="section" data-id="2"></div>
          <div className="section" data-id="3"></div>
        </div>
      </div>

      <div className={`animalImage ${animationClass}`}>
        <img src={animalImage} alt="animal" className="animalImage" />
      </div>

      {isModalOpen && (
        <div className="uccModal">
          <div className="uccTitle">ucc 타이틀</div>
          <div className="ucc">ucc 올자리</div>
          <button className="closeButton" onClick={() => setIsModalOpen(false)}>
            X
          </button>
        </div>
      )}

      <div className="buttonContainer">
        <button onClick={() => setIsModalOpen(false)}>영상 on</button>
        <button
          onClick={() =>
            (window.location.href = "https://e101.ssafy.picel.net/ttubeot.apk")
          }>
          게임 다운로드
        </button>
      </div>

      <div className="scrollHint scrollHintBottom">
        {/* scale이 1일 때 아래쪽 화살표만 표시 */}
        {scale === 1 && (
          <>
            <div className="wheelIcon"></div>
            <div className={`arrow arrowDown`}></div>
            <div className={`arrow arrowDown`}></div>
          </>
        )}
        {/* scale이 1.6일 때 위쪽 화살표만 표시 */}
        {scale === 1.6 && (
          <>
            <div className={`arrow arrowUp`}></div>
            <div className={`arrow arrowUp`}></div>
            <div className="wheelIcon"></div>
          </>
        )}
        {/* scale이 1과 1.6이 아닐 때는 모든 화살표 표시 */}
        {scale !== 1 && scale !== 1.6 && (
          <>
            <div className={`arrow arrowUp`}></div>
            <div className={`arrow arrowUp`}></div>
            <div className="wheelIcon"></div>
            <div className={`arrow arrowDown`}></div>
            <div className={`arrow arrowDown`}></div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
