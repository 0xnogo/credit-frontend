export class LayeredAudio {
  url: any;
  samples: HTMLAudioElement[] = [];

  constructor(src: string) {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        this.url = URL.createObjectURL(blob);
        this.samples[0] = new Audio(this.url);
      });
  }

  play() {
    if (!this.samples.find((e) => e.paused)?.play()) {
      this.samples.push(new Audio(this.url));
      this.samples[this.samples.length - 1].play();
    }
  }
}
