class AIImageEditor {
  static async applyCommand(imageData, command) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        const cmd = command.toLowerCase();
        
        if (cmd.includes('brighten')) {
          ctx.filter = 'brightness(1.3)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('darken')) {
          ctx.filter = 'brightness(0.8)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('contrast')) {
          ctx.filter = 'contrast(1.5)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('saturate') || cmd.includes('vibrant')) {
          ctx.filter = 'saturate(1.8)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('grayscale') || cmd.includes('black')) {
          ctx.filter = 'grayscale(1)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('sepia')) {
          ctx.filter = 'sepia(0.8)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('blur')) {
          ctx.filter = 'blur(3px)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('sharpen')) {
          ctx.filter = 'contrast(1.8) brightness(1.1)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('warm')) {
          ctx.filter = 'sepia(0.3) brightness(1.1)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('cool')) {
          ctx.filter = 'hue-rotate(180deg) brightness(0.95)';
          ctx.drawImage(img, 0, 0);
        } else if (cmd.includes('invert')) {
          ctx.filter = 'invert(1)';
          ctx.drawImage(img, 0, 0);
        } else {
          ctx.drawImage(img, 0, 0);
        }
        
        const result = canvas.toDataURL('image/jpeg', 0.95);
        resolve(result);
      };
      img.src = imageData;
    });
  }

  static getCommandSuggestions() {
    return [
      { cmd: 'brighten', desc: 'Make the image brighter' },
      { cmd: 'darken', desc: 'Make the image darker' },
      { cmd: 'contrast', desc: 'Increase contrast' },
      { cmd: 'saturate', desc: 'Make colors more vibrant' },
      { cmd: 'grayscale', desc: 'Convert to black & white' },
      { cmd: 'sepia', desc: 'Add vintage look' },
      { cmd: 'blur', desc: 'Blur the background' },
      { cmd: 'sharpen', desc: 'Make it clearer' },
      { cmd: 'warm', desc: 'Add warm tones' },
      { cmd: 'cool', desc: 'Add cool tones' }
    ];
  }
}
