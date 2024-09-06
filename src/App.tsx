import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderCanvas } from './utils/renderCanvas';

const quotes = ['人生就像一杯茶\n不会苦一辈子\n但总会苦一阵子'];
const fontFamilies = [
  'Arial',
  'Verdana',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Palatino Linotype',
  'Comic Sans MS',
];

const imageOptions = {
  '/assets/郭德纲.jpg': '郭德纲',
  '/assets/刘能.jpg': '刘能',
  '/assets/鲁迅.jpg': '鲁迅',
  '/assets/罗永浩.jpg': '罗永浩',
  '/assets/马斯克.jpg': '马斯克',
  '/assets/马云.jpg': '马云',
  '/assets/莫言.jpg': '莫言',
  '/assets/乔布斯.jpg': '乔布斯',
  '/assets/杨澜.jpg': '杨澜',
  '/assets/于丹.jpg': '于丹',
};

const getRandomImage = () => {
  const keys = Object.keys(imageOptions);
  return keys[Math.floor(Math.random() * keys.length)];
};

function App() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(getRandomImage());
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [watermarkText, setWatermarkText] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const memoizedQuotes = useMemo(() => quotes, []);
  // 添加状态来控制水印的显示
  const [showWatermark, setShowWatermark] = useState(true);

  // 处理开关变化的函数
  const handleToggleWatermark = () => {
    setShowWatermark(!showWatermark);
    // freshImg()
  };

  const handleRenderCanvas = useCallback(
    (text: string) => {
      const renderText = text || memoizedQuotes[Math.floor(Math.random() * memoizedQuotes.length)];
      const renderWatermarkText = watermarkText || "鹿先生";
      renderCanvas(canvasRef.current, renderText, image, fontFamily, fontSize, showWatermark, renderWatermarkText);
    },
    [image, fontFamily, fontSize, memoizedQuotes, showWatermark, watermarkText] // 添加 showWatermark 到依赖项列表
  );

  useEffect(() => {
    handleRenderCanvas(text);
  }, [text, image, fontFamily, fontSize, watermarkText, showWatermark, handleRenderCanvas]);

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontFamily = e.target.value;
    setFontFamily(newFontFamily);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImage(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    // 清除文件输入的当前值，以便再次触发 onChange 事件
    e.target.value = ''; // 添加这一行
  };

  const handleSaveClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="container mx-auto max-w-5xl min-w-fit">
      <header className="bg-blue-500 text-white p-10 text-center">
        <h1 className="text-4xl font-bold mb-10">我说过这话吗</h1>
        <p className="text-xl">"都有截图了，肯定是你说的"</p>
      </header>

      <main className="flex flex-wrap justify-center">
        <div className="column bg-white p-6 rounded shadow" style={{ width: 512 }}>
          <label htmlFor="image-select" className="block text-lg font-medium mb-2">
            选择英雄
          </label>
          <select
            id="image-select"
            className="w-full p-2 border rounded mb-4"
            value={image}
            onChange={handleImageChange}
          >
            {Object.entries(imageOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label
            htmlFor="image-upload"
            className="block text-lg font-medium mb-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded cursor-pointer transition-colors duration-300 ease-in-out hover:bg-blue-600"
          >
            上传本机英雄
          </label>
          <input type="file" id="image-upload" className="hidden" onChange={handleImageUpload} />

          <label htmlFor="text-input" className="block text-lg font-medium mb-2">
            台词（一排不要太长了，不然会显示不全）
          </label>
          <textarea
            id="text-input"
            rows={8}
            className="w-full p-2 border rounded mb-4"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={memoizedQuotes[Math.floor(Math.random() * memoizedQuotes.length)]}
          ></textarea>
          <label htmlFor="font-size-slider" className="block text-lg font-medium mb-2">
            字号
          </label>
          <div className="flex items-center">
            <input
              id="font-size-slider"
              type="range"
              min="12"
              max="48"
              step="1"
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="w-full mb-4 mr-4"
            />
            <span className="text-lg">{fontSize}px</span>
          </div>
          <label htmlFor="font-family-select" className="block text-lg font-medium mb-2">
            字体
          </label>
          <select
            id="font-family-select"
            className="w-full p-2 border rounded mb-4"
            value={fontFamily}
            onChange={handleFontFamilyChange}
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <div className="space-y-2">
            <textarea
              id="watermark-input"
              rows={1}
              className="w-full p-2 border rounded mb-4"
              value={watermarkText}
              onChange={e => setWatermarkText(e.target.value)}
              placeholder="鹿先生">
            </textarea>
            <div className="flex mx-2 space-x-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={handleToggleWatermark}
              >
                {showWatermark ? '隐藏水印' : '显示水印'}
              </button>

              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleSaveClick}
              >
                保存图片
              </button>
            </div>
          </div>
        </div>

        {/* add watermark toggle button */}

        {/* render part */}
        <div className="column bg-white rounded shadow" style={{ width: 512 }}>
          <canvas ref={canvasRef} className="w-full h-auto border rounded"></canvas>
        </div>
      </main>
    </div>
  );
}

export default App;
