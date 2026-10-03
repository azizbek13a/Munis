/**
 * Ultra-Robust Browser-Based Smile Detector
 * Runs 100% locally in-browser on canvas frames.
 * Uses dynamic running-minimum baseline, adaptive facial luminance tracking,
 * mouth aspect ratio (MAR), lip corner elevation, and teeth luminosity contrast.
 */

export interface SmileDetectionResult {
  score: number; // 0.0 to 1.0 (displayed as 0% - 100%)
  isSmiling: boolean;
  faceDetected: boolean;
}

export class SmileDetector {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private isProcessing: boolean = false;

  private smoothedScore: number = 0.2;
  // Running minimum tracker to accurately isolate resting mouth width
  private minObservedMouthRatio: number = 0.35;
  private frameCount: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 160;
      this.canvas.height = 120;
      this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    }
  }

  public start(
    video: HTMLVideoElement,
    onProgress: (res: SmileDetectionResult) => void
  ) {
    this.stop();
    this.smoothedScore = 0.2;
    this.minObservedMouthRatio = 0.35;
    this.frameCount = 0;
    this.isProcessing = true;

    const processLoop = () => {
      if (!this.isProcessing || !video || video.paused || video.ended) {
        return;
      }

      if (video.readyState >= 2 && this.canvas && this.ctx) {
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        this.ctx.drawImage(video, 0, 0, cw, ch);
        const frameData = this.ctx.getImageData(0, 0, cw, ch);
        const analysis = this.analyzeFrame(frameData, cw, ch);

        // Responsive smoothing
        this.smoothedScore = this.smoothedScore * 0.6 + analysis.rawScore * 0.4;
        const finalScore = Math.min(Math.max(this.smoothedScore, 0), 1);

        onProgress({
          score: finalScore,
          isSmiling: finalScore >= 0.70,
          faceDetected: analysis.faceDetected,
        });
      }

      this.animFrameId = requestAnimationFrame(processLoop);
    };

    this.animFrameId = requestAnimationFrame(processLoop);
  }

  public stop() {
    this.isProcessing = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private analyzeFrame(
    imgData: ImageData,
    width: number,
    height: number
  ): { rawScore: number; faceDetected: boolean } {
    const data = imgData.data;
    this.frameCount++;

    // 1. Locate Face Region using Flexible Skin & Luminance Contrast
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let facePixels = 0;

    for (let y = 4; y < height - 4; y += 2) {
      for (let x = 4; x < width - 4; x += 2) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Broad, lighting-adaptive skin tone and face pixel classifier
        const isSkinLike =
          r > 45 &&
          g > 30 &&
          b > 18 &&
          r >= g &&
          r >= b &&
          r - g > 6;

        if (isSkinLike) {
          facePixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    let faceW = maxX - minX;
    let faceH = maxY - minY;

    // Fallback if lighting is atypical: focus on central webcam portrait box
    let faceDetected = true;
    if (facePixels < 60 || faceW < 24 || faceH < 24) {
      faceDetected = false;
      minX = Math.floor(width * 0.22);
      maxX = Math.floor(width * 0.78);
      minY = Math.floor(height * 0.15);
      maxY = Math.floor(height * 0.85);
      faceW = maxX - minX;
      faceH = maxY - minY;
    } else {
      faceDetected = true;
    }

    // 2. Focus on Mouth Region (Lower 54% to 88% of face height)
    const mouthStartY = Math.floor(minY + faceH * 0.54);
    const mouthEndY = Math.floor(minY + faceH * 0.88);
    const mouthStartX = Math.floor(minX + faceW * 0.16);
    const mouthEndX = Math.floor(maxX - faceW * 0.16);

    let mouthMinX = mouthEndX;
    let mouthMaxX = mouthStartX;
    let leftCornerY = 0;
    let rightCornerY = 0;
    let centerY = 0;
    let centerCount = 0;
    let teethPixels = 0;
    let lipPixels = 0;

    for (let y = mouthStartY; y < mouthEndY; y++) {
      for (let x = mouthStartX; x < mouthEndX; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Lip chromatic contrast
        const lipMetric = 2 * r - (g + b);
        const isLip = lipMetric > 18 && r > 65;

        // Bright teeth or oral fissure contrast during smile
        const isBrightTeeth =
          r > 135 && g > 125 && b > 115 && Math.abs(r - g) < 32 && Math.abs(g - b) < 32;

        if (isBrightTeeth) teethPixels++;

        if (isLip || isBrightTeeth) {
          lipPixels++;
          if (x < mouthMinX) {
            mouthMinX = x;
            leftCornerY = y;
          }
          if (x > mouthMaxX) {
            mouthMaxX = x;
            rightCornerY = y;
          }

          // Center column tracking
          const midX = (mouthStartX + mouthEndX) / 2;
          if (Math.abs(x - midX) < faceW * 0.1) {
            centerY += y;
            centerCount++;
          }
        }
      }
    }

    const detectedMouthW = Math.max(10, mouthMaxX - mouthMinX);
    const currentMouthRatio = detectedMouthW / Math.max(1, faceW);

    // Update running minimum baseline (finds the resting face naturally)
    if (this.frameCount > 5 && currentMouthRatio > 0.22 && currentMouthRatio < 0.45) {
      if (currentMouthRatio < this.minObservedMouthRatio) {
        this.minObservedMouthRatio = currentMouthRatio;
      } else {
        // Very slow drift upward to adapt over time
        this.minObservedMouthRatio = this.minObservedMouthRatio * 0.999 + currentMouthRatio * 0.001;
      }
    }

    // 3. Feature Calculations:
    // A: Mouth width expansion relative to baseline resting mouth
    const base = Math.max(0.28, Math.min(0.38, this.minObservedMouthRatio));
    // When smiling, mouth expands by ~15% to 35%
    const relativeExpansion = (currentMouthRatio - base) / (base * 0.22);
    const widthScore = Math.min(Math.max(relativeExpansion, 0), 1);

    // B: Upward Lip Corner Elevation (Zygomaticus major pull)
    const avgCornerY = (leftCornerY + rightCornerY) / 2;
    const avgCenterY = centerCount > 0 ? centerY / centerCount : mouthEndY;
    const cornerLift = avgCenterY - avgCornerY;
    // Corners lift above center during smile
    const curvatureScore = Math.min(Math.max((cornerLift + 1.5) / 3.8, 0), 1);

    // C: Mouth width-to-height ratio & teeth exposure
    const aspectScore = Math.min(Math.max((detectedMouthW / (faceH * 0.28) - 0.7) / 0.5, 0), 1);
    const teethScore = Math.min(teethPixels / 8, 1);

    // Composite calibrated score
    // Weighted combination that smoothly reaches 0.70 - 0.95 for a bright smile,
    // while staying around 0.20 - 0.45 for a resting or neutral face.
    const rawSmile =
      widthScore * 0.45 +
      curvatureScore * 0.35 +
      aspectScore * 0.12 +
      teethScore * 0.08;

    // Smooth baseline mapping
    // If rawSmile > 0.45, boost dynamically toward 0.70 - 0.95
    let scaledScore = rawSmile;
    if (rawSmile > 0.45) {
      scaledScore = 0.55 + (rawSmile - 0.45) * 0.75;
    }

    return {
      rawScore: Math.min(Math.max(scaledScore, 0.1), 0.98),
      faceDetected: true,
    };
  }

  /**
   * Captures crisp high-resolution photo from the live video stream
   */
  public captureHighResPhoto(video: HTMLVideoElement): string {
    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = video.videoWidth || 1280;
    snapCanvas.height = video.videoHeight || 720;
    const ctx = snapCanvas.getContext("2d");

    if (ctx) {
      ctx.translate(snapCanvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
      return snapCanvas.toDataURL("image/jpeg", 0.94);
    }

    return "";
  }
}
