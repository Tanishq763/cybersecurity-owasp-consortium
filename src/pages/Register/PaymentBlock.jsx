import React, { useState, useRef, useCallback } from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

async function compressImage(file) {
  if (file.size <= 500 * 1024) return { file, compressed: file };
  try {
    const bmp = await createImageBitmap(file);
    const maxDim = 1600;
    const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.82));
    if (!blob || blob.size >= file.size) return { file, compressed: file };
    const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
    return { file, compressed };
  } catch {
    return { file, compressed: file };
  }
}

export default function PaymentBlock({ amount, screenshot, onScreenshot, screenshotError, utr, onUtr }) {
  const [drag, setDrag] = useState(false);
  const [fileError, setFileError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef();

  const { qrImage, upiId, payeeName, verificationNote } = CYBERPULSE.payment;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

  const copyUpi = async () => {
    try { await navigator.clipboard.writeText(upiId); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const processFile = useCallback(async (file) => {
    setFileError('');
    if (!ALLOWED.includes(file.type)) { setFileError('Only JPG, PNG, or WebP images are allowed.'); return; }
    if (file.size > MAX_SIZE) { setFileError('File too large (max 8 MB).'); return; }
    const result = await compressImage(file);
    // Build preview URL
    const url = URL.createObjectURL(result.compressed);
    onScreenshot({ ...result, previewUrl: url });
  }, [onScreenshot]);

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const removeFile = () => {
    if (screenshot?.previewUrl) URL.revokeObjectURL(screenshot.previewUrl);
    onScreenshot(null);
    setFileError('');
  };

  return (
    <div className="cp-payment-section">
      <h4>// PAYMENT</h4>

      <div className="cp-payment-card">
        {/* QR */}
        <div>
          {qrImage ? (
            <img
              src={qrImage}
              alt="UPI QR Code"
              className="cp-qr-img"
              onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'grid'; }}
            />
          ) : null}
          <div className="cp-qr-fallback" style={{ display: qrImage ? 'none' : 'grid' }}>
            QR not<br />configured
          </div>
        </div>

        {/* Meta */}
        <div className="cp-payment-meta">
          <p>AMOUNT DUE</p>
          <div className="amount">₹{amount}</div>
          <p>Pay to: <strong style={{ color: '#fff' }}>{payeeName}</strong></p>

          <div className="cp-upi-row">
            <span>{upiId}</span>
            <button type="button" className="cp-copy-btn" onClick={copyUpi}>
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>

          {isMobile && upiId !== 'TBA@upi' && (
            <a href={upiLink} className="btn cp-upi-app-btn" style={{ display: 'block', textAlign: 'center', marginTop: '.5rem' }}>
              PAY WITH UPI APP ↗
            </a>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`cp-dropzone ${drag ? 'drag' : ''} ${screenshot ? 'has-file' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload payment screenshot"
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInput}
          aria-label="Payment screenshot upload"
        />
        {screenshot ? (
          <div className="cp-drop-preview">
            <img src={screenshot.previewUrl} alt="Payment screenshot preview" />
            <button type="button" className="cp-drop-remove" onClick={removeFile} aria-label="Remove screenshot">✕</button>
          </div>
        ) : (
          <p>Drag & drop payment screenshot here<br /><b>or click to browse</b><br /><small>JPG, PNG, WebP · max 8 MB</small></p>
        )}
      </div>
      {(fileError || screenshotError) && (
        <p className="cp-field-error" role="alert" style={{ marginTop: '.4rem' }}>⚠ {fileError || screenshotError}</p>
      )}

      {/* UTR field */}
      <div className="cp-field" style={{ marginTop: '.8rem' }}>
        <label>Transaction / UTR ID (Optional)</label>
        <input type="text" value={utr} onChange={e => onUtr(e.target.value)} placeholder="e.g. 123456789012" />
      </div>

      <p className="cp-payment-note">{verificationNote}</p>
    </div>
  );
}
