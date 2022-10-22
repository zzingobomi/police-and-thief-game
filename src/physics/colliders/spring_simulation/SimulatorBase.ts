export abstract class SimulatorBase {
  public mass: number;
  public damping: number;
  public frameTime: number;
  public offset: number;
  public abstract cache: any[];

  constructor(fps: number, mass: number, damping: number) {
    this.mass = mass;
    this.damping = damping;
    this.frameTime = 1 / fps;
    this.offset = 0;
  }

  public abstract getFrame(isLastFrame: boolean): any;
  public abstract simulate(delta: number): void;

  public generateFrames(delta: number) {
    const totalTimeStep = this.offset + delta;
    const framesToGenerate = Math.floor(totalTimeStep / this.frameTime);
    this.offset = totalTimeStep % this.frameTime;

    if (framesToGenerate > 0) {
      for (let i = 0; i < framesToGenerate; i++) {
        this.cache.push(this.getFrame(i + 1 === framesToGenerate));
      }
      this.cache = this.cache.slice(-2);
    }
  }

  public setFPS(value: number) {
    this.frameTime = 1 / value;
  }

  public lastFrame() {
    return this.cache[this.cache.length - 1];
  }
}
