import React, { useState } from 'react';
import { Image } from 'image-js';
import { Toast } from 'bootstrap';
import './App.css';

const App = () => {
  const placeholder = "data:image/jpeg;base64,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"

  const [outerImage, setOuterImage] = useState(placeholder);
  const [innerImage, setInnerImage] = useState(placeholder);
  const [resultImage, setResultImage] = useState(placeholder);

  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleOuterImageUpload = () => {
    const fileInput = document.getElementById('outerImageInput');
    fileInput.click();
  }

  const handleInnerImageUpload = () => {
    const fileInput = document.getElementById('innerImageInput');
    fileInput.click();
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
          setOuterImage(grey.toDataURL());
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
          setInnerImage(grey.toDataURL());
        });
    }
    reader.readAsDataURL(file);
  }

  const startProcess = async () => {
    let outer = await Image.load(outerImage);
    let inner = await Image.load(innerImage);

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
      setOuterImage(outer.toDataURL());
      setInnerImage(inner.toDataURL());
    } else if (outer.width !== inner.width || outer.height !== inner.height) {
      const toast = new Toast(document.getElementById('liveToast'));
      setToastTitle('警告：图片尺寸不一致');
      setToastMessage('程序将会将小图像缩放至大图像尺寸');
      toast.show();
      width = Math.max(outer.width, inner.width);
      height = Math.max(outer.height, inner.height);
      outer = outer.resize({ width, height });
      inner = inner.resize({ width, height });
      setOuterImage(outer.toDataURL());
      setInnerImage(inner.toDataURL());
    }

    // 正式处理
    // let outerMask = new Image(width, height);
    // for (let i = 0; i < height; i++) {
    //   for (let j = 0; j < width; j++) {
    //     outerMask.setPixelXY(j, i, (i + j) % 2 === 0 ? [0, 0, 0, 255] : [0, 0, 0, 0])
    //   }
    // }
    // let innerMask = new Image(width, height);
    // for (let i = 0; i < height; i++) {
    //   for (let j = 0; j < width; j++) {
    //     innerMask.setPixelXY(j, i, (i + j) % 2 === 0 ? [0, 0, 0, 0] : [255, 255, 255, 255])
    //   }
    // }
    const result = new Image(width, height);
    outer = outer.grey().invert();
    inner = inner.grey();
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if ((i + j) % 2 === 0) {
          result.setPixelXY(j, i, [0, 0, 0, outer.getPixelXY(j, i)[0]]); // outer
        } else {
          result.setPixelXY(j, i, [255, 255, 255, inner.getPixelXY(j, i)[0]]); // inner
        }
      }
    }
    setResultImage(result.toDataURL());
  }

  const handleDownload = () => {
    document.getElementById('resultImageDownload').click();
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-light">
        <div className="container-fluid">
          <div className="navbar-brand">
            <span>图片混合器</span>
          </div>
          <span className="fw-light float-end">By ChrisKim</span>
        </div>
      </nav >
      <div className='main-panel'>
        <div className="row">
          <div className="col">
            <div className="card text-bg-light">
              <div className="card-header">① 选择表图像</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={outerImage} alt="outer" className='image-preview' />
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={handleOuterImageUpload}>
                  <i className="bi bi-cloud-upload"></i> 选择图片
                </button>
                <input type="file" id="outerImageInput" style={{ display: 'none' }} onChange={handleOuterImageChange} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light">
              <div className="card-header">② 选择里图像</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={innerImage} alt="inner" className='image-preview' />
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={handleInnerImageUpload}>
                  <i className="bi bi-cloud-upload"></i> 选择图片
                </button>
                <input type="file" id="innerImageInput" style={{ display: 'none' }} onChange={handleInnerImageChange} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light">
              <div className="card-header">③ 预览</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={resultImage} alt="inner" className='image-preview' />
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={handleDownload}>
                  <i className="bi bi-cloud-download"></i> 下载结果
                </button>
                <button type="button" className="btn btn-success float-end me-2" onClick={startProcess}>
                  <i className="bi bi-play-circle"></i> 开始生成
                </button>
                <a download="result.png" href={resultImage} style={{ display: 'none' }} id="resultImageDownload" />
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
