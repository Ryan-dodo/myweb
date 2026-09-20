import api from "../api/axios";
import { useEffect, useState } from "react";
import "./photography.css";


// ========================================
// 读取 src/photos 中的所有图片
// ========================================

const photoModules = import.meta.glob(
  "../photos/*.{png,jpg,jpeg,webp,gif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);


// ========================================
// 随机打乱数组
// ========================================

function shuffleArray(array) {

  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [result[i], result[j]] =
      [result[j], result[i]];
  }

  return result;
}


// ========================================
// 计算两个照片位置之间的距离
// ========================================

function getDistance(a, b) {

  const dx =
    a.left - b.left;

  const dy =
    a.top - b.top;

  return Math.sqrt(
    dx * dx + dy * dy
  );
}


// ========================================
// 生成一张照片的位置
//
// existingPhotos：已经落下的照片
// ========================================

function createPhotoData(
  src,
  index,
  existingPhotos
) {

  const maxAttempts = 40;

  let bestPosition = null;

  let bestScore = -Infinity;


  // ======================================
  // 随机寻找合适的位置
  // ======================================

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {

    const candidate = {

      // 左右随机
      left:
        10 +
        Math.random() * 80,

      // 上下随机
      //
      // 18%：
      // 避开顶部标题
      //
      // 55%：
      // 不让照片过于靠近底部
      top:
        18 +
        Math.random() * 55,
    };


    // ====================================
    // 第一张照片
    // ====================================

    if (
      existingPhotos.length === 0
    ) {

      bestPosition =
        candidate;

      break;
    }


    // ====================================
    // 计算距离最近的照片
    // ====================================

    let minDistance =
      Infinity;


    existingPhotos.forEach(
      (photo) => {

        const distance =
          getDistance(
            candidate,
            photo
          );

        minDistance =
          Math.min(
            minDistance,
            distance
          );
      }
    );


    // ====================================
    // 保存目前最分散的位置
    // ====================================

    if (
      minDistance >
      bestScore
    ) {

      bestScore =
        minDistance;

      bestPosition =
        candidate;
    }


    // ====================================
    // 已经足够分散
    // 直接使用
    // ====================================

    if (
      minDistance > 18
    ) {

      bestPosition =
        candidate;

      break;
    }
  }


  // ======================================
  // 安全检查
  // ======================================

  if (!bestPosition) {

    bestPosition = {

      left:
        20 +
        Math.random() * 60,

      top:
        25 +
        Math.random() * 45,
    };
  }


  // ======================================
  // 最终限制位置
  // ======================================

  const left =
    Math.max(
      10,
      Math.min(
        90,
        bestPosition.left
      )
    );


  const top =
    Math.max(
      18,
      Math.min(
        73,
        bestPosition.top
      )
    );


  // ======================================
  // 照片大小
  // ======================================

  let width;


  if (index < 10) {

    // 前期稍小
    // 减少重叠

    width =
      190 +
      Math.random() * 100;

  } else {

    // 后期稍微大一点

    width =
      210 +
      Math.random() * 140;
  }


  // ======================================
  // 随机旋转
  // ======================================

  const rotate =
    -15 +
    Math.random() * 30;


  // ======================================
  // 返回照片数据
  // ======================================

  return {

    id:
      `${src}-${index}-${Date.now()}-${Math.random()}`,

    src,

    left,

    top,

    width,

    rotate,

    zIndex:
      index + 1,

    delay:
      index * 180,
  };
}


// ========================================
// 主页面
// ========================================

export default function Photography() {


  // ======================================
  // 初始照片
  // ======================================

  const initialPhotos =
    Object.values(
      photoModules
    );


  // ======================================
  // 照片随机顺序
  // ======================================

  const [photos, setPhotos] =
    useState(() => {

      return shuffleArray(
        initialPhotos
      );

    });


  // ======================================
  // 已经落下的照片
  // ======================================

  const [photoItems, setPhotoItems] =
    useState([]);


  // ======================================
  // 一张一张落下
  // ======================================

  useEffect(() => {

    if (
      photos.length === 0
    ) {

      return;
    }


    let index = 0;


    const timer =
      setInterval(() => {

        if (
          index >= photos.length -1
        ) {

          clearInterval(
            timer
          );

          return;
        }


        // ------------------------------
        // 注意：
        // 根据当前已经存在的照片
        // 计算新照片的位置
        // ------------------------------

        setPhotoItems(
          (prev) => {

            const photo =
              createPhotoData(
                photos[index],
                index,
                prev
              );


            return [
              ...prev,
              photo,
            ];
          }
        );


        index++;

      }, 180);


    return () => {

      clearInterval(
        timer
      );

    };

  }, [photos]);


  // ========================================
  // 上传图片
  // ========================================

const handleUpload = async (event) => {
  const files = Array.from(
    event.target.files || []
  );

  if (files.length === 0) {
    return;
  }

  try {
    for (const file of files) {
      const formData = new FormData();

      formData.append("file", file);

      await api.post(
        "/api/photos/upload",
        formData
      );
    }

    // 所有图片上传完成后刷新页面
    window.location.reload();

  } catch (error) {
    console.error("图片上传失败：", error);

    alert("图片上传失败，请检查后端是否正常运行");
  }

  event.target.value = "";
};


  // ========================================
  // 重新播放
  // ========================================

  const handleRestart =
    () => {

      const shuffled =
        shuffleArray(
          initialPhotos
        );


      setPhotoItems(
        []
      );


      setPhotos(
        shuffled
      );
    };


  // ========================================
  // 页面
  // ========================================

  return (

    <div
      className="photography-page"
    >


      {/* ================================ */}
      {/* 背景霓虹 */}
      {/* ================================ */}

      <div
        className="photo-glow photo-glow-1"
      />

      <div
        className="photo-glow photo-glow-2"
      />

      <div
        className="photo-glow photo-glow-3"
      />

      <div
        className="photo-glow photo-glow-4"
      />


      {/* ================================ */}
      {/* 页面标题 */}
      {/* ================================ */}

      <header
        className="photography-header"
      >

        <h1>
          📷 照片墙
        </h1>

        <p>
          Memories · Moments · Life
        </p>

      </header>


      {/* ================================ */}
      {/* 照片区域 */}
      {/* ================================ */}

      <main
        className="photo-stage"
      >

        {photoItems.map(
          (photo) => (

            <div
              key={photo.id}

              className="falling-photo"

              style={{

                "--photo-left":
                  `${photo.left}%`,

                "--photo-top":
                  `${photo.top}%`,

                "--photo-width":
                  `${photo.width}px`,

                "--photo-rotate":
                  `${photo.rotate}deg`,

                "--photo-delay":
                  `${photo.delay}ms`,

                "--photo-z":
                  photo.zIndex,
              }}
            >

              <div
                className="photo-card"
              >

                <img
                  src={photo.src}
                  alt="照片"
                  draggable="false"
                />

              </div>

            </div>

          )
        )}


        {/* ============================== */}
        {/* 没有照片 */}
        {/* ============================== */}

        {initialPhotos.length === 0 &&
          photoItems.length === 0 && (

            <div
              className="empty-photo"
            >

              <div
                className="empty-icon"
              >
                📷
              </div>

              <h2>
                还没有照片
              </h2>

              <p>
                请把照片放入 src/photos 文件夹
              </p>

            </div>

          )}

      </main>


      {/* ================================ */}
      {/* 右下角控制 */}
      {/* ================================ */}

      <div
        className="photo-controls"
      >


        {/* 上传 */}

        <label
          className="photo-control-button"
        >

          <span>
            ＋
          </span>

          <span>
            上传照片
          </span>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleUpload
            }
          />

        </label>


        {/* 重新播放 */}

        <button
          className="photo-control-button"
          onClick={
            handleRestart
          }
        >

          <span>
            ↻
          </span>

          <span>
            重新播放
          </span>

        </button>


      </div>

    </div>
  );
}
