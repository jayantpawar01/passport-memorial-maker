class CameraManager {
  constructor() {
    this.stream = null;
    this.facingMode = 'user';
    this.video = null;
    this.canvas = null;
    this.capturedImageData = null;
  }

  async initialize(videoElement) {
    this.video = videoElement;
    this.canvas = document.createElement('canvas');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { success: false, message: 'Camera not supported in this browser' };
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      this.video.srcObject = this.stream;
      this.video.style.display = 'block';
      
      return { success: true, message: 'Camera initialized' };
    } catch (error) {
      console.error('Camera error:', error);
      return { success: false, message: `Camera error: ${error.message}` };
    }
  }

  async capturePhoto() {
    if (!this.video || !this.canvas) {
      return { success: false, message: 'Camera not initialized' };
    }

    try {
      const ctx = this.canvas.getContext('2d');
      this.canvas.width = this.video.videoWidth || 640;
      this.canvas.height = this.video.videoHeight || 480;
      
      ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      
      this.capturedImageData = this.canvas.toDataURL('image/jpeg', 0.95);
      
      return { 
        success: true, 
        message: 'Photo captured',
        imageData: this.capturedImageData
      };
    } catch (error) {
      console.error('Capture error:', error);
      return { success: false, message: 'Failed to capture photo' };
    }
  }

  switchCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopCamera();
    return this.initialize(this.video);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  getCapturedImage() {
    return this.capturedImageData;
  }

  async downloadCapturedImage(fileName = 'EASYPHOTO-Camera.jpg') {
    if (!this.capturedImageData) {
      return { success: false, message: 'No image captured' };
    }

    const link = document.createElement('a');
    link.href = this.capturedImageData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, message: 'Image downloaded' };
  }
}
