import React, { useEffect, useState } from 'react';
import { Image } from 'image-js';
import { preprocessor, blender } from './process/blender';
import { resize2same } from './process/resize2same';
import './App.css';

const App = () => {
  const [outerImage, setOuterImage] = useState();
  const [innerImage, setInnerImage] = useState();

  const [blenderMode, setBlenderMode] = useState("direct");

  const [outerColorMode, setOuterColorMode] = useState(false);
  const [innerColorMode, setInnerColorMode] = useState(false);

  const [outerThumb, setOuterThumb] = useState();
  const [innerThumb, setInnerThumb] = useState();

  const [displayOuterThumb, setDisplayOuterThumb] = useState("./placeholder.svg");
  const [displayInnerThumb, setDisplayInnerThumb] = useState("./placeholder.svg");
  const [displayResultThumb, setDisplayResultThumb] = useState("./placeholder.svg");

  const [bgColor, setBgColor] = useState(false);

  const handleOuterImageUpload = () => {
    const fileInput = document.getElementById('outerImageInput');
    fileInput.click();
  }

  const handleInnerImageUpload = () => {
    const fileInput = document.getElementById('innerImageInput');
    fileInput.click();
  }

  useEffect(() => {
    if (outerThumb) {
      const processedThumb = preprocessor(outerThumb, "outer", outerColorMode, blenderMode);
      setDisplayOuterThumb(processedThumb.toDataURL());
    }
  }, [outerThumb, outerColorMode, blenderMode]);

  useEffect(() => {
    if (innerThumb) {
      const processedThumb = preprocessor(innerThumb, "inner", innerColorMode, blenderMode);
      setDisplayInnerThumb(processedThumb.toDataURL());
    }
  }, [innerThumb, innerColorMode, blenderMode]);

  useEffect(() => {
    if (outerThumb && innerThumb) {
      const [result, outer, inner] = process(outerThumb, innerThumb);

      setDisplayOuterThumb(outer.toDataURL());
      setDisplayInnerThumb(inner.toDataURL());
      setDisplayResultThumb(result.toDataURL());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerThumb, innerThumb, outerColorMode, innerColorMode, blenderMode]);

  useEffect(() => {
    setOuterColorMode(false);
    setInnerColorMode(false);
  }, [blenderMode]);

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
          setOuterThumb(original.resize({ width: 512 }));
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
          setInnerThumb(original.resize({ width: 512 }));
        });
    }
    reader.readAsDataURL(file);
  }

  const process = (_outerImage = outerImage, _innerImage = innerImage) => {
    const [outer, inner] = resize2same(_outerImage, _innerImage);

    const processedOuter = preprocessor(outer, "outer", outerColorMode, blenderMode);
    const processedInner = preprocessor(inner, "inner", innerColorMode, blenderMode);

    const result = blender(processedOuter, processedInner, blenderMode);

    return [result, processedOuter, processedInner];
  }

  const handleExport = async () => {
    const [result] = process(outerImage, innerImage);
    const blob = await result.toBlob();
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
              <div className="card-header">① 参数选择</div>
              <div className="card-body">
                <div class="input-group">
                  <span class="input-group-text">混合方式</span>
                  <select class="form-select" defaultValue={"direct"} value={blenderMode} onChange={(e) => { setBlenderMode(e.target.value) }}>
                    <option value="direct">直接混合</option>
                    <option value="chessboard">棋盘混合</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-xl-4 mb-4">
            <div className="card text-bg-light">
              <div className="card-header">② 选择表图像（白底时可见）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={displayOuterThumb} alt="outer" className='image-preview' />
                </div>
                <div className="form-check form-switch float-start">
                  <input className="form-check-input" type="checkbox" role="switch" id="outer-color-mode"
                    checked={outerColorMode} onChange={(e) => setOuterColorMode(e.target.checked)} disabled={blenderMode === "chessboard"} />
                  <label className="form-check-label" htmlFor="outer-color-mode">彩色模式</label>
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={handleOuterImageUpload}>
                  <i className="bi bi-cloud-upload"></i> 选择
                </button>
                <input type="file" id="outerImageInput" style={{ display: 'none' }} onChange={handleOuterImageChange} />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-4 mb-4">
            <div className="card text-bg-light">
              <div className="card-header">③ 选择里图像（黑底时可见）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={displayInnerThumb} alt="inner" className='image-preview' />
                </div>
                <div className="form-check form-switch float-start">
                  <input className="form-check-input" type="checkbox" role="switch" id="inner-color-mode"
                    checked={innerColorMode} onChange={(e) => setInnerColorMode(e.target.checked)} disabled={blenderMode === "chessboard"} />
                  <label className="form-check-label" htmlFor="inner-color-mode">彩色模式</label>
                </div>
                <button type="button" className="btn btn-primary float-end" onClick={handleInnerImageUpload}>
                  <i className="bi bi-cloud-upload"></i> 选择
                </button>
                <input type="file" id="innerImageInput" style={{ display: 'none' }} onChange={handleInnerImageChange} />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-4 mb-4">
            <div className="card text-bg-light">
              <div className="card-header">④ 预览（成品需导出）</div>
              <div className="card-body">
                <div className='image-container'>
                  <img src={displayResultThumb} alt="inner" className={`image-preview ${bgColor ? 'bg-black' : 'bg-white'}`} />
                </div>
                <div className="form-check form-switch float-start">
                  <input className="form-check-input" type="checkbox" role="switch" id="bg-color" value={bgColor} onChange={(e) => setBgColor(e.target.checked)} />
                  <label className="form-check-label" htmlFor="bg-color">白底 / 黑底</label>
                </div>
                <button type="button" className="btn btn-success float-end" onClick={handleExport} disabled={!(outerImage && innerImage)}>
                  <i className="bi bi-cloud-download"></i> 导出
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
