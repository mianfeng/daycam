from pathlib import Path
from urllib.request import urlretrieve


FILES = [
    (
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs",
        "vendor/mediapipe/vision_bundle.mjs",
    ),
    (
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.js",
        "vendor/mediapipe/wasm/vision_wasm_internal.js",
    ),
    (
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.wasm",
        "vendor/mediapipe/wasm/vision_wasm_internal.wasm",
    ),
    (
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        "models/pose_landmarker_lite.task",
    ),
]


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    for url, relative_target in FILES:
      target = root / relative_target
      target.parent.mkdir(parents=True, exist_ok=True)
      urlretrieve(url, target)
      print(f"downloaded {relative_target}")


if __name__ == "__main__":
    main()
