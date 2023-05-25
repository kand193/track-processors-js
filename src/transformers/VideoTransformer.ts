import { VideoTrackTransformer, VideoTransformerInitOptions } from './types';

export default abstract class VideoTransformer implements VideoTrackTransformer {
  transformer?: TransformStream;

  canvas?: OffscreenCanvas;

  ctx?: OffscreenCanvasRenderingContext2D;

  inputVideo?: HTMLVideoElement;

  protected isDisabled?: Boolean = false;

  init({ outputCanvas, inputElement: inputVideo }: VideoTransformerInitOptions): void {
    if (!(inputVideo instanceof HTMLVideoElement)) {
      throw TypeError('Video transformer needs a HTMLVideoElement as input');
    }
    this.transformer = new TransformStream({
      transform: (frame, controller) => this.transform(frame, controller),
    });
    this.canvas = outputCanvas || null;
    if (outputCanvas) {
      this.ctx = this.canvas?.getContext('2d', { readFrequently: true }) || undefined;
    }
    this.inputVideo = inputVideo;
    this.isDisabled = false;
  }

  async destroy() {
    this.isDisabled = true;
    this.canvas = undefined;
    this.ctx = undefined;
  }

  abstract transform(
    frame: VideoFrame,
    controller: TransformStreamDefaultController<VideoFrame>,
  ): void;
}
