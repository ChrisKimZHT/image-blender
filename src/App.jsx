import React, { useEffect, useState } from 'react';
import { Image } from 'image-js';
import { Toast } from 'bootstrap';
import { preprocessor, blender } from './process/blender';
import { resize2same } from './process/resize2same';
import './App.css';

const App = () => {
  const [outerImage, setOuterImage] = useState();
  const [innerImage, setInnerImage] = useState();
  const [resultImage, setResultImage] = useState();

  const [blenderMode, setBlenderMode] = useState('chessboard');

  const [outerColorMode, setOuterColorMode] = useState(false);
  const [innerColorMode, setInnerColorMode] = useState(false);

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

  const refreshOuterThumb = (original = outerImage) => {
    setOuterThumb(generateThumbURL(preprocessor(original, "outer", outerColorMode, blenderMode)));
  }

  const refreshInnerThumb = (original = innerImage) => {
    setInnerThumb(generateThumbURL(preprocessor(original, "inner", innerColorMode, blenderMode)));
  }

  useEffect(() => {
    if (outerImage) { refreshOuterThumb(outerImage); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerImage, outerColorMode, blenderMode]);

  useEffect(() => {
    if (innerImage) { refreshInnerThumb(innerImage); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerImage, innerColorMode, blenderMode]);

  const handleOuterImageChange = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      Image.load(reader.result)
        .then((original) => {
          setOuterImage(original);
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
          setInnerImage(original);
          setInnerStatus(true);
          setResultStatus(false);
        });
    }
    reader.readAsDataURL(file);
  }

  const startProcess = () => {
    let [outer, inner, resizeType] = resize2same(outerImage, innerImage);

    if (resizeType === 1) {
      const toast = new Toast(document.getElementById('liveToast'));
      setToastTitle('警告：图片比例不一致');
      setToastMessage('程序将会填充图片四周以适应比例');
      toast.show();
    } else if (resizeType === 2) {
      const toast = new Toast(document.getElementById('liveToast'));
      setToastTitle('警告：图片尺寸不一致');
      setToastMessage('程序将会将小图像缩放至大图像尺寸');
      toast.show();
    }

    outer = preprocessor(outer, "outer", outerColorMode, blenderMode);
    inner = preprocessor(inner, "inner", innerColorMode, blenderMode);

    setOuterThumb(generateThumbURL(outer));
    setInnerThumb(generateThumbURL(inner));

    const result = blender(outer, inner, outerColorMode, innerColorMode, blenderMode);

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
          <div className="col">
            <div className="card text-bg-light mb-4">
              <div className="card-header">① 混合方式</div>
              <div className="card-body">
                <select class="form-select" value={1} onChange={(e) => { setBlenderMode(e.target.value) }}>
                  <option value="chessboard" selected>棋盘混合</option>
                  <option value="direct" disabled>直接混合</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-xl-4 mb-4">
            <div className="card text-bg-light">
              <div className="card-header">② 选择表图像（白底时可见）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={outerThumb} alt="outer" className='image-preview' />
                </div>
                <div className="form-check form-switch float-start">
                  <input className="form-check-input" type="checkbox" role="switch" id="outer-color-mode" value={outerColorMode} onChange={(e) => setOuterColorMode(e.target.checked)} />
                  <label className="form-check-label" htmlFor="outer-color-mode">彩色模式</label>
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
              <div className="card-header">③ 选择里图像（黑底时可见）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={innerThumb} alt="inner" className='image-preview' />
                </div>
                <div className="form-check form-switch float-start">
                  <input className="form-check-input" type="checkbox" role="switch" id="inner-color-mode" value={innerColorMode} onChange={(e) => setInnerColorMode(e.target.checked)} />
                  <label className="form-check-label" htmlFor="inner-color-mode">彩色模式</label>
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
              <div className="card-header">④ 预览（预览有压缩，仅供参考）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={resultThumb} alt="inner" className={`image-preview ${bgColor ? 'bg-black' : 'bg-white'}`} />
                </div>
                <div className="form-check form-switch float-start">
                  <input className="form-check-input" type="checkbox" role="switch" id="bg-color" value={bgColor} onChange={(e) => setBgColor(e.target.checked)} />
                  <label className="form-check-label" htmlFor="bg-color">白底 / 黑底</label>
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
