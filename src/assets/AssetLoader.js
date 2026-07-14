export class AssetLoader {
  constructor(documentRef) {
    this.documentRef = documentRef;
  }

  load() {
    return {
      overlay: this.documentRef.getElementById("overlay"),
      obstacles: this.documentRef.getElementById("obstacles"),
      bull: this.documentRef.getElementById("bull"),
      egg: this.documentRef.getElementById("egg"),
      glob: this.documentRef.getElementById("glob"),
      globs: this.documentRef.getElementById("globs"),
      larval: this.documentRef.getElementById("larval"),
    };
  }
}
