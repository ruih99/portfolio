import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rui Honda - Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OGP画像を動的に生成するコンポーネント
 * マトリックス風のダークテーマデザイン
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d1117",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* マトリックス風の背景パターン */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.15,
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "30px",
                fontSize: "14px",
                fontFamily: "monospace",
                color: "#00ff00",
                lineHeight: 1.2,
              }}
            >
              {Array.from({ length: 25 }).map((_, j) => (
                <span key={j}>
                  {String.fromCharCode(0x30a0 + Math.floor(((i * 25 + j) * 7) % 96))}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* グラデーションオーバーレイ */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at center, transparent 0%, #0d1117 70%)",
          }}
        />

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* 名前 */}
          <h1
            style={{
              fontSize: "80px",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-2px",
              textShadow: "0 0 40px rgba(0, 255, 0, 0.3)",
            }}
          >
            Rui Honda
          </h1>

          {/* 肩書き */}
          <p
            style={{
              fontSize: "36px",
              fontWeight: 400,
              color: "#00ff00",
              margin: "16px 0 0 0",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Software Engineer
          </p>

          {/* 区切り線 */}
          <div
            style={{
              width: "200px",
              height: "2px",
              backgroundColor: "#00ff00",
              margin: "32px 0",
              opacity: 0.6,
              boxShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
            }}
          />

          {/* サイトURL */}
          <p
            style={{
              fontSize: "24px",
              fontWeight: 300,
              color: "#8b949e",
              margin: 0,
              fontFamily: "monospace",
            }}
          >
            ruih99.dev
          </p>
        </div>

        {/* 左上のアクセント */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "60px",
            height: "60px",
            borderLeft: "3px solid #00ff00",
            borderTop: "3px solid #00ff00",
            opacity: 0.6,
          }}
        />

        {/* 右下のアクセント */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "60px",
            height: "60px",
            borderRight: "3px solid #00ff00",
            borderBottom: "3px solid #00ff00",
            opacity: 0.6,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
