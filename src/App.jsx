import React, { useState } from 'react';
import { Image } from 'image-js';
import { Toast } from 'bootstrap';
import './App.css';

const App = () => {
  const [outerImage, setOuterImage] = useState();
  const [innerImage, setInnerImage] = useState();
  const [resultImage, setResultImage] = useState();

  const [outerThumb, setOuterThumb] = useState("./placeholder.svg");
  const [innerThumb, setInnerThumb] = useState("./placeholder.svg");
  const [resultThumb, setResultThumb] = useState("./placeholder.svg");

  const [outerStatus, setOuterStatus] = useState(false);
  const [innerStatus, setInnerStatus] = useState(false);
  const [resultStatus, setResultStatus] = useState(false);

  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [bgColor, setBgColor] = useState(false);

  const handleOuterImageUpload = () => {
    const fileInput = document.getElementById('outerImageInput');
    fileInput.click();
  }

  const handleInnerImageUpload = () => {
    const fileInput = document.getElementById('innerImageInput');
    fileInput.click();
  }

  const generateThumbURL = (image) => {
    const thumb = image.resize({ width: 1024 });
    return thumb.toDataURL();
  }

  const handleOuterImageChange = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      Image.load(reader.result)
        .then((original) => {
          const grey = original.grey().rgba8();
          setOuterImage(grey);
          setOuterThumb(generateThumbURL(grey));
          setOuterStatus(true);
          setResultStatus(false);
        });
    }
    reader.readAsDataURL(file);
  }

  const handleInnerImageChange = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      Image.load(reader.result)
        .then((original) => {
          const grey = original.grey().rgba8();
          setInnerImage(grey);
          setInnerThumb(generateThumbURL(grey));
          setInnerStatus(true);
          setResultStatus(false);
        });
    }
    reader.readAsDataURL(file);
  }

  const startProcess = async () => {
    let outer = outerImage.clone();
    let inner = innerImage.clone();

    let width = outer.width, height = outer.height;

    // 图片尺寸预处理
    if (outer.width * inner.height !== inner.width * outer.height) {
      const toast = new Toast(document.getElementById('liveToast'));
      setToastTitle('警告：图片比例不一致');
      setToastMessage('程序将会填充图片四周以适应比例');
      toast.show();
      width = Math.max(outer.width, inner.width);
      outer = outer.resize({ width });
      inner = inner.resize({ width });
      if (inner.height < outer.height) {
        height = outer.height;
        let result = new Image(width, height, Array.from({ length: width * height * 4 }, () => 255));
        let offsetY = Math.round((height - inner.height) / 2);
        inner = result.insert(inner.rgba8(), { x: 0, y: offsetY });
      } else {
        height = inner.height;
        let result = new Image(width, height, Array.from({ length: width * height * 4 }, () => 255));
        let offsetY = Math.round((height - outer.height) / 2);
        outer = result.insert(outer.rgba8(), { x: 0, y: offsetY });
      }
    } else if (outer.width !== inner.width || outer.height !== inner.height) {
      const toast = new Toast(document.getElementById('liveToast'));
      setToastTitle('警告：图片尺寸不一致');
      setToastMessage('程序将会将小图像缩放至大图像尺寸');
      toast.show();
      width = Math.max(outer.width, inner.width);
      height = Math.max(outer.height, inner.height);
      outer = outer.resize({ width, height });
      inner = inner.resize({ width, height });
    }
    setOuterThumb(generateThumbURL(outer));
    setInnerThumb(generateThumbURL(inner));

    // 正式处理
    const result = new Image(width, height);
    outer = outer.grey();
    inner = inner.grey();
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if ((i + j) % 2 === 0) {
          result.setPixelXY(j, i, [0, 0, 0, 255 - outer.getPixelXY(j, i)[0]]); // outer
        } else {
          result.setPixelXY(j, i, [255, 255, 255, inner.getPixelXY(j, i)[0]]); // inner
        }
      }
    }
    setResultImage(result);
    setResultThumb(generateThumbURL(result));
    setResultStatus(true);
  }

  const downloadBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "result.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-light">
        <div className="container-fluid">
          <div className="navbar-brand">
            <span>图片混合器</span>
          </div>
          <span className="fw-light float-end"><a href="https://github.com/ChrisKimZHT/image-blender">Image Blender</a> v1.1.1 by ChrisKim</span>
        </div>
      </nav >
      <div className='main-panel'>
        <div className="row">
          <div className="col-sm-6 col-xl-4 mb-4">
            <div className="card text-bg-light">
              <div className="card-header">① 选择表图像（白底时可见）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={outerThumb} alt="outer" className='image-preview' />
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={handleOuterImageUpload}>
                  <i className="bi bi-cloud-upload"></i> 选择
                </button>
                <input type="file" id="outerImageInput" style={{ display: 'none' }} onChange={handleOuterImageChange} />
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 mb-4">
            <div className="card text-bg-light">
              <div className="card-header">② 选择里图像（黑底时可见）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={innerThumb} alt="inner" className='image-preview' />
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={handleInnerImageUpload}>
                  <i className="bi bi-cloud-upload"></i> 选择
                </button>
                <input type="file" id="innerImageInput" style={{ display: 'none' }} onChange={handleInnerImageChange} />
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-4 mb-4">
            <div className="card text-bg-light">
              <div className="card-header">③ 预览（预览有压缩，仅供参考）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={resultThumb} alt="inner" className={`image-preview ${bgColor ? 'bg-black' : 'bg-white'}`} />
                </div>
                <div className="form-check form-switch float-start">
                  <input className="form-check-input" type="checkbox" role="switch" id="bg-color" value={bgColor} onChange={(e) => setBgColor(e.target.checked)} />
                  <label className="form-check-label" for="bg-color">白底 / 黑底</label>
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={async () => downloadBlob(await resultImage.toBlob())} disabled={!resultStatus}>
                  <i className="bi bi-cloud-download"></i> 下载
                </button>
                <button type="button" className="btn btn-success float-end me-2" onClick={startProcess} disabled={outerStatus && innerStatus ? false : true}>
                  <i className="bi bi-play-circle"></i> 生成
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">{toastTitle}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {toastMessage}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
