const CAPTURE_PRESETS = {
  "4:5": { width: 1536, height: 1920, label: "4:5 Half body" },
  "3:4": { width: 1440, height: 1920, label: "3:4 More background" },
  "1:1": { width: 1600, height: 1600, label: "1:1 Portrait" },
  "9:16": { width: 1080, height: 1920, label: "9:16 Vertical" },
};

const DEFAULT_SETTINGS = {
  capture: {
    aspectRatio: "4:5",
    guideMode: "half-body",
    cameraDeviceId: "",
    cameraResolution: "high",
  },
  watermark: {
    style: "digital",
    position: "bottom-left",
    size: "medium",
    color: "#fff3d0",
    background: true,
  },
  overlay: {
    opacity: 0,
  },
  referencePhotoDate: null,
};

const WATERMARK_SIZES = {
  small: { fontSize: 34, paddingX: 22, paddingY: 13, margin: 38, radius: 12 },
  medium: { fontSize: 58, paddingX: 34, paddingY: 20, margin: 52, radius: 16 },
  large: { fontSize: 86, paddingX: 44, paddingY: 28, margin: 68, radius: 20 },
};

const SEVEN_SEGMENT_DIGITS = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "c", "d", "g"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "e", "d", "c", "g"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const SEGMENT_NAMES = ["a", "b", "c", "d", "e", "f", "g"];
const MEDIAPIPE_BUNDLE_URL = new URL("vendor/mediapipe/vision_bundle.mjs", document.baseURI).href;
const MEDIAPIPE_WASM_URL = new URL("vendor/mediapipe/wasm/", document.baseURI).href;
const POSE_LANDMARKER_MODEL_URL = new URL("models/pose_landmarker_lite.task", document.baseURI).href;
const POSE_DETECTION_INTERVAL_MS = 120;
const CAMERA_CONSTRAINT_PRESETS = [
  {
    key: "high",
    label: "1920x1080",
    constraints: {
      audio: false,
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "user",
      },
    },
  },
  {
    key: "medium",
    label: "1280x720",
    constraints: {
      audio: false,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
    },
  },
  {
    key: "low",
    label: "960x540",
    constraints: {
      audio: false,
      video: {
        width: { ideal: 960 },
        height: { ideal: 540 },
        facingMode: "user",
      },
    },
  },
  {
    key: "auto",
    label: "自动模式",
    constraints: {
      audio: false,
      video: true,
    },
  },
];
const ALIGNMENT_KEYPOINTS = [
  { index: 0, label: "nose" },
  { index: 2, label: "leftEye" },
  { index: 5, label: "rightEye" },
  { index: 11, label: "leftShoulder" },
  { index: 12, label: "rightShoulder" },
  { index: 23, label: "leftHip" },
  { index: 24, label: "rightHip" },
];
const ALIGNMENT_CONNECTIONS = [
  [2, 5],
  [11, 12],
  [11, 23],
  [12, 24],
  [23, 24],
  [0, 11],
  [0, 12],
];

const JPEG_QUALITY = 0.9;
const METADATA_FILE = "metadata.json";

const elements = {
  folderStatus: document.querySelector("#folderStatus"),
  cameraStatus: document.querySelector("#cameraStatus"),
  poseStatus: document.querySelector("#poseStatus"),
  unsupportedNotice: document.querySelector("#unsupportedNotice"),
  runtimeNotice: document.querySelector("#runtimeNotice"),
  viewfinder: document.querySelector("#viewfinder"),
  poseOverlay: document.querySelector("#poseOverlay"),
  guideLines: document.querySelector("#guideLines"),
  watermarkPreview: document.querySelector("#watermarkPreview"),
  countdownOverlay: document.querySelector("#countdownOverlay"),
  cameraPreview: document.querySelector("#cameraPreview"),
  cameraPlaceholder: document.querySelector("#cameraPlaceholder"),
  alignmentOverlay: document.querySelector("#alignmentOverlay"),
  chooseFolderBtn: document.querySelector("#chooseFolderBtn"),
  startCameraBtn: document.querySelector("#startCameraBtn"),
  captureBtn: document.querySelector("#captureBtn"),
  todayTitle: document.querySelector("#todayTitle"),
  todayPreview: document.querySelector("#todayPreview"),
  todayDate: document.querySelector("#todayDate"),
  todayPath: document.querySelector("#todayPath"),
  todayCapturedAt: document.querySelector("#todayCapturedAt"),
  setTodayReferenceBtn: document.querySelector("#setTodayReferenceBtn"),
  clearReferenceBtn: document.querySelector("#clearReferenceBtn"),
  pendingReview: document.querySelector("#pendingReview"),
  pendingPreview: document.querySelector("#pendingPreview"),
  savePendingBtn: document.querySelector("#savePendingBtn"),
  retakePendingBtn: document.querySelector("#retakePendingBtn"),
  referencePhotoSelect: document.querySelector("#referencePhotoSelect"),
  overlayOpacity: document.querySelector("#overlayOpacity"),
  overlayOpacityValue: document.querySelector("#overlayOpacityValue"),
  overlayHint: document.querySelector("#overlayHint"),
  referenceHint: document.querySelector("#referenceHint"),
  aspectRatioSelect: document.querySelector("#aspectRatioSelect"),
  guideModeSelect: document.querySelector("#guideModeSelect"),
  cameraDeviceSelect: document.querySelector("#cameraDeviceSelect"),
  cameraResolutionSelect: document.querySelector("#cameraResolutionSelect"),
  captureSpec: document.querySelector("#captureSpec"),
  watermarkStyleSelect: document.querySelector("#watermarkStyleSelect"),
  watermarkPositionSelect: document.querySelector("#watermarkPositionSelect"),
  watermarkSizeSelect: document.querySelector("#watermarkSizeSelect"),
  watermarkColorInput: document.querySelector("#watermarkColorInput"),
  watermarkBackgroundInput: document.querySelector("#watermarkBackgroundInput"),
  openPreviewBtn: document.querySelector("#openPreviewBtn"),
  previewModal: document.querySelector("#previewModal"),
  previewImage: document.querySelector("#previewImage"),
  previewDate: document.querySelector("#previewDate"),
  previewPrevBtn: document.querySelector("#previewPrevBtn"),
  previewPlayBtn: document.querySelector("#previewPlayBtn"),
  previewNextBtn: document.querySelector("#previewNextBtn"),
  previewSpeed: document.querySelector("#previewSpeed"),
  previewSpeedValue: document.querySelector("#previewSpeedValue"),
  closePreviewBtn: document.querySelector("#closePreviewBtn"),
  recentList: document.querySelector("#recentList"),
  captureCanvas: document.querySelector("#captureCanvas"),
};

const state = {
  directoryHandle: null,
  metadata: createEmptyMetadata(),
  stream: null,
  objectUrls: new Set(),
  isCountingDown: false,
  previewClock: null,
  pendingPhoto: null,
  cameraStartToken: 0,
  cameraStarting: false,
  cameraDiagnosticsBound: false,
  cameraLivenessTimer: 0,
  cameraLastCurrentTime: 0,
  cameraStallCount: 0,
  cameraPresetIndex: 0,
  cameraAutoRecovering: false,
  recoveredPhotoCount: 0,
  poseVision: null,
  poseLandmarkerVideo: null,
  poseLandmarkerImage: null,
  poseReady: false,
  poseDisabled: false,
  poseLoopRaf: 0,
  poseBusy: false,
  poseLastRunAt: 0,
  livePoseLandmarks: null,
  referencePoseData: null,
  previewTimer: 0,
  previewPlaying: false,
  previewIndex: 0,
  previewRecords: [],
};

init();

function init() {
  window.addEventListener("error", (event) => {
    showError(`页面脚本错误：${event.message}`);
  });

  if (!window.isSecureContext) {
    showError("请通过 http://localhost:5173 打开应用，不要直接使用 file:// 访问。");
  }

  elements.todayDate.textContent = getTodayDate();
  elements.chooseFolderBtn.addEventListener("click", chooseDataFolder);
  elements.startCameraBtn.addEventListener("click", startCamera);
  elements.captureBtn.addEventListener("click", startCountdownCapture);
  elements.savePendingBtn.addEventListener("click", savePendingPhoto);
  elements.retakePendingBtn.addEventListener("click", retakePendingPhoto);
  elements.setTodayReferenceBtn.addEventListener("click", setTodayAsReference);
  elements.clearReferenceBtn.addEventListener("click", clearReferencePhoto);
  elements.referencePhotoSelect.addEventListener("change", handleReferencePhotoSelectChange);
  elements.overlayOpacity.addEventListener("input", updateOverlayOpacity);
  elements.overlayOpacity.addEventListener("change", handleSettingsChange);
  elements.aspectRatioSelect.addEventListener("change", handleSettingsChange);
  elements.guideModeSelect.addEventListener("change", handleSettingsChange);
  elements.cameraDeviceSelect.addEventListener("change", handleSettingsChange);
  elements.cameraResolutionSelect.addEventListener("change", handleSettingsChange);
  elements.watermarkStyleSelect.addEventListener("change", handleSettingsChange);
  elements.watermarkPositionSelect.addEventListener("change", handleSettingsChange);
  elements.watermarkSizeSelect.addEventListener("change", handleSettingsChange);
  elements.watermarkColorInput.addEventListener("input", handleSettingsChange);
  elements.watermarkBackgroundInput.addEventListener("change", handleSettingsChange);
  elements.openPreviewBtn.addEventListener("click", openPreviewModal);
  elements.previewPrevBtn.addEventListener("click", showPreviousPreviewFrame);
  elements.previewPlayBtn.addEventListener("click", togglePreviewPlayback);
  elements.previewNextBtn.addEventListener("click", showNextPreviewFrame);
  elements.previewSpeed.addEventListener("input", updatePreviewSpeedLabel);
  elements.previewSpeed.addEventListener("change", restartPreviewPlaybackIfNeeded);
  elements.closePreviewBtn.addEventListener("click", closePreviewModal);
  bindCameraDiagnostics();
  navigator.mediaDevices?.addEventListener?.("devicechange", refreshCameraDeviceOptions);
  updateOverlayOpacity();
  applySettingsToUi();
  startPreviewClock();
  updatePreviewSpeedLabel();
  initializePoseLandmarker();
  refreshCameraDeviceOptions();

  if (!supportsFileSystemAccess()) {
    elements.unsupportedNotice.classList.remove("hidden");
    elements.chooseFolderBtn.disabled = true;
    setStatus(elements.folderStatus, "文件夹访问不可用", "warn");
  }

  renderFromMetadata();
}

async function chooseDataFolder() {
  if (!supportsFileSystemAccess()) {
    showError("当前浏览器不支持本地文件夹访问，请使用 Chrome 或 Edge。");
    return;
  }

  try {
    const handle = await window.showDirectoryPicker({
      id: "daycam-data",
      mode: "readwrite",
      startIn: "pictures",
    });

    const permission = await verifyPermission(handle);
    if (!permission) {
      showError("未获得数据文件夹的读写权限。");
      return;
    }

    state.directoryHandle = handle;
    state.metadata = await readMetadata(handle);
    applySettingsToUi();
    await writeMetadata();

    const recoveredSuffix = state.recoveredPhotoCount
      ? `，已恢复 ${state.recoveredPhotoCount} 张历史照片`
      : "";
    setStatus(elements.folderStatus, `数据文件夹：${handle.name}${recoveredSuffix}`, "ready");
    await renderFromMetadata();
    await refreshReferencePoseData();
    updateCaptureAvailability();
  } catch (error) {
    if (error.name !== "AbortError") {
      showError(`选择数据文件夹失败：${error.message}`);
    }
  }
}

async function startCamera() {
  if (state.cameraStarting) {
    return;
  }

  if (!window.isSecureContext) {
    showError("摄像头访问需要在 localhost 下运行，请先启动本地服务。");
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    showError("当前环境无法访问摄像头。");
    return;
  }

  const startToken = state.cameraStartToken + 1;
  state.cameraStartToken = startToken;
  state.cameraStarting = true;
  elements.startCameraBtn.disabled = true;
  setStatus(elements.cameraStatus, "摄像头启动中", "muted");

  try {
    stopCamera({ invalidatePendingStart: false });
    const { stream, presetLabel, presetIndex } = await openCameraStream();

    if (startToken !== state.cameraStartToken) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
      return;
    }

    state.stream = stream;
    state.cameraPresetIndex = presetIndex;
    state.cameraAutoRecovering = false;
    bindCameraTrackDiagnostics(stream, startToken);
    elements.cameraPreview.srcObject = stream;
    await elements.cameraPreview.play();

    if (startToken !== state.cameraStartToken || state.stream !== stream) {
      return;
    }

    elements.cameraPlaceholder.classList.add("hidden");
    const [videoTrack] = stream.getVideoTracks();
    const settings = videoTrack?.getSettings?.();
    await refreshCameraDeviceOptions();
    syncSelectedCameraDevice(settings?.deviceId ?? "");
    const resolution = settings?.width && settings?.height ? `${settings.width}x${settings.height}` : presetLabel;
    setStatus(elements.cameraStatus, `摄像头已就绪 ${resolution}`, "ready");
    startCameraLivenessMonitor(startToken, stream, resolution);
    startPoseLoop();
    updateCaptureAvailability();
  } catch (error) {
    if (startToken !== state.cameraStartToken) {
      return;
    }
    state.cameraAutoRecovering = false;
    setStatus(elements.cameraStatus, "摄像头不可用", "warn");
    showError(`启动摄像头失败：${error.message}`);
  } finally {
    if (startToken === state.cameraStartToken) {
      state.cameraStarting = false;
      elements.startCameraBtn.disabled = false;
    }
  }
}

async function openCameraStream() {
  let lastError = null;
  const preferredResolution = getSettings().capture.cameraResolution;
  const preferredDeviceId = getSettings().capture.cameraDeviceId;
  const startIndex = state.cameraAutoRecovering
    ? state.cameraPresetIndex
    : getCameraPresetIndex(preferredResolution);

  for (let index = startIndex; index < CAMERA_CONSTRAINT_PRESETS.length; index += 1) {
    const preset = CAMERA_CONSTRAINT_PRESETS[index];
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        buildCameraConstraints(preset.constraints, preferredDeviceId),
      );
      return { stream, presetLabel: preset.label, presetIndex: index };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("无法打开摄像头。");
}

function stopCamera(options = {}) {
  const { invalidatePendingStart = true } = options;
  if (invalidatePendingStart) {
    state.cameraStartToken += 1;
  }
  state.cameraStarting = false;
  stopCameraLivenessMonitor();
  stopPoseLoop();
  const stream = state.stream;
  state.stream = null;
  elements.cameraPreview.pause();
  elements.cameraPreview.srcObject = null;

  if (!stream) {
    return;
  }

  for (const track of stream.getTracks()) {
    track.stop();
  }
}

function bindCameraDiagnostics() {
  if (state.cameraDiagnosticsBound) {
    return;
  }

  const video = elements.cameraPreview;
  for (const eventName of ["loadedmetadata", "playing", "pause", "stalled", "suspend", "waiting", "emptied"]) {
    video.addEventListener(eventName, () => {
      console.info(`[camera-video] ${eventName}`, {
        readyState: video.readyState,
        networkState: video.networkState,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    });
  }

  video.addEventListener("error", () => {
    const mediaError = video.error;
    showError(`视频预览错误：${mediaError?.message ?? mediaError?.code ?? "unknown"}`);
  });

  state.cameraDiagnosticsBound = true;
}

function bindCameraTrackDiagnostics(stream, startToken) {
  for (const track of stream.getVideoTracks()) {
    const settings = track.getSettings?.() ?? {};
    console.info("[camera-track] settings", settings);

    track.addEventListener("ended", () => {
      if (startToken !== state.cameraStartToken || state.stream !== stream) {
        return;
      }
      setStatus(elements.cameraStatus, "摄像头连接已中断", "warn");
      showError("摄像头视频轨道已结束。通常是驱动、权限、被其他应用抢占，或当前分辨率模式不稳定。");
      stopCamera({ invalidatePendingStart: false });
    });

    track.addEventListener("mute", () => {
      if (startToken !== state.cameraStartToken || state.stream !== stream) {
        return;
      }
      showError("摄像头视频轨道已被静音，设备可能暂时停止提供画面。");
    });

    track.addEventListener("unmute", () => {
      if (startToken !== state.cameraStartToken || state.stream !== stream) {
        return;
      }
      setStatus(elements.cameraStatus, "摄像头视频已恢复", "ready");
    });
  }
}

function startCameraLivenessMonitor(startToken, stream, resolutionLabel) {
  stopCameraLivenessMonitor();
  state.cameraLastCurrentTime = 0;
  state.cameraStallCount = 0;

  state.cameraLivenessTimer = window.setInterval(() => {
    if (startToken !== state.cameraStartToken || state.stream !== stream) {
      stopCameraLivenessMonitor();
      return;
    }

    const video = elements.cameraPreview;
    if (video.paused || video.ended || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return;
    }

    const currentTime = video.currentTime;
    if (Math.abs(currentTime - state.cameraLastCurrentTime) < 0.001) {
      state.cameraStallCount += 1;
    } else {
      state.cameraLastCurrentTime = currentTime;
      state.cameraStallCount = 0;
      setStatus(elements.cameraStatus, `摄像头已就绪 ${resolutionLabel}`, "ready");
    }

    if (state.cameraStallCount >= 4) {
      setStatus(elements.cameraStatus, `摄像头预览停帧 ${resolutionLabel}`, "warn");
      showError("摄像头流已打开，但预览帧没有继续更新。这通常是当前设备上的浏览器/驱动视频链路问题。");
      attemptCameraRecovery();
    }
  }, 500);
}

function stopCameraLivenessMonitor() {
  if (state.cameraLivenessTimer) {
    window.clearInterval(state.cameraLivenessTimer);
    state.cameraLivenessTimer = 0;
  }
  state.cameraLastCurrentTime = 0;
  state.cameraStallCount = 0;
}

function describeCameraConstraints(videoConstraints) {
  if (videoConstraints === true) {
    return "自动模式";
  }

  const width = videoConstraints?.width?.ideal ?? "auto";
  const height = videoConstraints?.height?.ideal ?? "auto";
  return `${width}x${height}`;
}

function attemptCameraRecovery() {
  if (state.cameraAutoRecovering || state.cameraStarting) {
    return;
  }

  const nextPresetIndex = state.cameraPresetIndex + 1;
  if (nextPresetIndex >= CAMERA_CONSTRAINT_PRESETS.length) {
    return;
  }

  state.cameraAutoRecovering = true;
  state.cameraPresetIndex = nextPresetIndex;
  showError(`检测到预览停帧，正在自动切换到更保守的摄像头模式 ${CAMERA_CONSTRAINT_PRESETS[nextPresetIndex].label}。`);
  startCamera();
}

async function startCountdownCapture() {
  if (state.isCountingDown) {
    return;
  }

  if (!state.directoryHandle) {
    showError("请先选择 daycam-data 文件夹。");
    return;
  }

  if (!state.stream || elements.cameraPreview.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    showError("摄像头尚未准备好。");
    return;
  }

  state.isCountingDown = true;
  updateCaptureAvailability();

  try {
    clearPendingPhoto();

    for (const value of [2, 1]) {
      elements.countdownOverlay.textContent = String(value);
      elements.countdownOverlay.classList.remove("hidden");
      elements.captureBtn.textContent = `${value} 秒后拍摄`;
      await wait(1000);
    }

    elements.countdownOverlay.textContent = "拍摄";
    await wait(180);
    await preparePendingPhoto();
  } finally {
    elements.countdownOverlay.classList.add("hidden");
    state.isCountingDown = false;
    elements.captureBtn.textContent = state.pendingPhoto
      ? "等待确认"
      : hasTodayPhoto() ? "重新拍摄今日照片" : "拍摄今日照片";
    updateCaptureAvailability();
  }
}

async function preparePendingPhoto() {
  if (!state.directoryHandle) {
    showError("请先选择 daycam-data 文件夹。");
    return;
  }

  if (!state.stream || elements.cameraPreview.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    showError("摄像头尚未准备好。");
    return;
  }

  elements.captureBtn.disabled = true;
  elements.captureBtn.textContent = "正在生成预览...";

  try {
    const now = new Date();
    const date = formatDate(now);
    const timestampText = formatTimestamp(now);
    const outputSize = getOutputSize();
    const photoPath = `photos/${now.getFullYear()}/${date}.jpg`;
    const fileName = `${date}.jpg`;
    const blob = await renderPhotoBlob(timestampText);
    const url = URL.createObjectURL(blob);
    state.objectUrls.add(url);
    state.pendingPhoto = {
      blob,
      date,
      file: photoPath,
      fileName,
      year: String(now.getFullYear()),
      width: outputSize.width,
      height: outputSize.height,
      createdAt: now.toISOString(),
      timestampText,
      hasTimestamp: true,
    };

    showPendingPreview(url);
  } catch (error) {
    showError(`生成预览失败：${error.message}`);
  } finally {
    elements.captureBtn.textContent = state.pendingPhoto
      ? "等待确认"
      : hasTodayPhoto() ? "重新拍摄今日照片" : "拍摄今日照片";
    updateCaptureAvailability();
  }
}

async function savePendingPhoto() {
  if (!state.pendingPhoto || !state.directoryHandle) {
    return;
  }

  elements.savePendingBtn.disabled = true;
  elements.savePendingBtn.textContent = "正在保存...";

  try {
    const pending = state.pendingPhoto;
    const yearDirectory = await getDirectory(state.directoryHandle, "photos", true);
    const photoYearDirectory = await getDirectory(yearDirectory, pending.year, true);
    await archiveExistingTodayPhoto(photoYearDirectory, pending.fileName, new Date(pending.createdAt));
    await writeBlob(photoYearDirectory, pending.fileName, pending.blob);

    upsertPhotoRecord({
      date: pending.date,
      file: pending.file,
      width: pending.width,
      height: pending.height,
      createdAt: pending.createdAt,
      timestampText: pending.timestampText,
      hasTimestamp: true,
    });

    clearPendingPhoto();
    await writeMetadata();
    await renderFromMetadata();
  } catch (error) {
    showError(`保存照片失败：${error.message}`);
  } finally {
    elements.savePendingBtn.disabled = false;
    elements.savePendingBtn.textContent = "保存照片";
    updateCaptureAvailability();
  }
}

function retakePendingPhoto() {
  clearPendingPhoto();
  elements.captureBtn.textContent = hasTodayPhoto() ? "重新拍摄今日照片" : "拍摄今日照片";
  updateCaptureAvailability();
}

function showPendingPreview(url) {
  elements.pendingPreview.src = url;
  elements.pendingReview.classList.remove("hidden");
  elements.cameraPlaceholder.classList.add("hidden");
}

function clearPendingPhoto() {
  state.pendingPhoto = null;
  elements.pendingPreview.removeAttribute("src");
  elements.pendingReview.classList.add("hidden");
}

async function initializePoseLandmarker() {
  if (!window.isSecureContext) {
    setStatus(elements.poseStatus, "请通过 localhost 打开", "warn");
    return;
  }
  setStatus(elements.poseStatus, "关键点模型加载中", "muted");

  try {
    const { FilesetResolver, PoseLandmarker } = await import(MEDIAPIPE_BUNDLE_URL);
    state.poseVision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
    state.poseLandmarkerVideo = await PoseLandmarker.createFromOptions(state.poseVision, {
      baseOptions: {
        modelAssetPath: POSE_LANDMARKER_MODEL_URL,
      },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.55,
      minPosePresenceConfidence: 0.55,
      minTrackingConfidence: 0.55,
    });
    state.poseReady = true;
    state.poseDisabled = false;
    setStatus(elements.poseStatus, "关键点模型已就绪", "ready");
    await refreshReferencePoseData();
    startPoseLoop();
  } catch (error) {
    disablePoseDetection("关键点模型加载失败", error);
  }
}

function startPoseLoop() {
  if (!state.poseReady || state.poseDisabled || !state.stream || state.poseLoopRaf) {
    return;
  }

  const loop = async () => {
    state.poseLoopRaf = window.requestAnimationFrame(loop);
    if (state.poseBusy || state.poseDisabled || !state.poseLandmarkerVideo || !state.stream) {
      return;
    }

    const video = elements.cameraPreview;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth || !video.videoHeight) {
      return;
    }

    const now = performance.now();
    if (now - state.poseLastRunAt < POSE_DETECTION_INTERVAL_MS) {
      return;
    }

    state.poseBusy = true;
    try {
      const result = state.poseLandmarkerVideo.detectForVideo(video, now);
      state.poseLastRunAt = now;
      state.livePoseLandmarks = result?.landmarks?.[0] ?? null;
      drawPoseAlignment();
    } catch (error) {
      disablePoseDetection("关键点检测失败，已自动关闭姿态对齐", error);
    } finally {
      state.poseBusy = false;
    }
  };

  state.poseLoopRaf = window.requestAnimationFrame(loop);
}

function stopPoseLoop() {
  if (state.poseLoopRaf) {
    window.cancelAnimationFrame(state.poseLoopRaf);
    state.poseLoopRaf = 0;
  }
  state.poseLastRunAt = 0;
  state.livePoseLandmarks = null;
  clearPoseOverlay();
}

function disablePoseDetection(statusText, error) {
  state.poseDisabled = true;
  state.poseReady = false;
  stopPoseLoop();
  state.referencePoseData = null;

  for (const landmarker of [state.poseLandmarkerVideo, state.poseLandmarkerImage]) {
    landmarker?.close?.();
  }

  state.poseVision = null;
  state.poseLandmarkerVideo = null;
  state.poseLandmarkerImage = null;

  setStatus(elements.poseStatus, statusText, "warn");
  if (error) {
    showError(`${statusText}：${error.message}`);
  }
}

async function archiveExistingTodayPhoto(photoYearDirectory, fileName, now) {
  let existingHandle;
  try {
    existingHandle = await photoYearDirectory.getFileHandle(fileName);
  } catch {
    return;
  }

  const existingFile = await existingHandle.getFile();
  const archiveRoot = await getDirectory(state.directoryHandle, "archive", true);
  const archiveYear = await getDirectory(archiveRoot, String(now.getFullYear()), true);
  const archiveName = `${formatDate(now)}_${formatTimeForFile(now)}.jpg`;
  await writeBlob(archiveYear, archiveName, existingFile);
}

async function renderPhotoBlob(timestampText) {
  const outputSize = getOutputSize();
  const canvas = elements.captureCanvas;
  const context = canvas.getContext("2d", { alpha: false });
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;

  drawVideoCover(context, elements.cameraPreview, outputSize.width, outputSize.height);
  drawTimestamp(context, timestampText, outputSize);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate JPEG image."));
        }
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

function drawVideoCover(context, video, outputWidth, outputHeight) {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  if (!videoWidth || !videoHeight) {
    throw new Error("Invalid camera frame size.");
  }

  const outputRatio = outputWidth / outputHeight;
  const videoRatio = videoWidth / videoHeight;
  let sourceWidth = videoWidth;
  let sourceHeight = videoHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (videoRatio > outputRatio) {
    sourceWidth = Math.round(videoHeight * outputRatio);
    sourceX = Math.round((videoWidth - sourceWidth) / 2);
  } else {
    sourceHeight = Math.round(videoWidth / outputRatio);
    sourceY = Math.round((videoHeight - sourceHeight) / 2);
  }

  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );
}

function drawTimestamp(context, text, outputSize) {
  const settings = getSettings().watermark;
  const size = WATERMARK_SIZES[settings.size] ?? WATERMARK_SIZES.medium;

  if (settings.style === "digital") {
    drawSevenSegmentTimestamp(context, text, outputSize, settings, size);
    return;
  }

  context.save();
  context.font = getWatermarkFont(settings.style, size.fontSize);
  context.textBaseline = "middle";
  context.letterSpacing = settings.style === "digital" ? "2px" : "0px";

  const metrics = context.measureText(text);
  const boxWidth = Math.ceil(metrics.width + size.paddingX * 2);
  const boxHeight = Math.ceil(size.fontSize + size.paddingY * 2);
  const position = getWatermarkPosition(settings.position, outputSize, boxWidth, boxHeight, size.margin);

  if (settings.background) {
    context.fillStyle = settings.style === "digital" ? "rgba(0, 0, 0, 0.68)" : "rgba(0, 0, 0, 0.5)";
    roundRect(context, position.x, position.y, boxWidth, boxHeight, size.radius);
    context.fill();
  }

  if (settings.style === "digital") {
    context.shadowColor = settings.color;
    context.shadowBlur = 22;
    context.globalAlpha = 0.42;
    context.fillStyle = settings.color;
    context.fillText(text, position.x + size.paddingX, position.y + boxHeight / 2 + size.paddingY / 8);
    context.globalAlpha = 1;
    context.shadowBlur = 12;
  }
  context.fillStyle = settings.color;
  context.fillText(text, position.x + size.paddingX, position.y + boxHeight / 2 + size.paddingY / 8);
  context.restore();
}

function getWatermarkFont(style, fontSize) {
  if (style === "digital") {
    return `800 ${fontSize}px "DSEG7 Classic", "Digital-7", "DS-Digital", "Cascadia Mono", Consolas, "Courier New", monospace`;
  }
  if (style === "minimal") {
    return `600 ${Math.round(fontSize * 0.72)}px "Segoe UI", sans-serif`;
  }
  return `800 ${fontSize}px Bahnschrift, "Segoe UI", sans-serif`;
}

function drawSevenSegmentTimestamp(context, text, outputSize, settings, size) {
  context.save();

  const metrics = measureSevenSegmentText(text, size.fontSize);
  const boxWidth = Math.ceil(metrics.width + size.paddingX * 2);
  const boxHeight = Math.ceil(metrics.height + size.paddingY * 2);
  const position = getWatermarkPosition(settings.position, outputSize, boxWidth, boxHeight, size.margin);

  if (settings.background) {
    context.fillStyle = "rgba(0, 0, 0, 0.76)";
    roundRect(context, position.x, position.y, boxWidth, boxHeight, size.radius);
    context.fill();
  }

  drawSevenSegmentText(
    context,
    text,
    position.x + size.paddingX,
    position.y + size.paddingY,
    size.fontSize,
    settings.color,
  );

  context.restore();
}

function measureSevenSegmentText(text, height) {
  let width = 0;
  for (const char of text) {
    width += getSevenSegmentCharWidth(char, height);
  }
  return { width, height };
}

function getSevenSegmentCharWidth(char, height) {
  if (/\d/.test(char)) {
    return height * 0.58;
  }
  if (char === ":") {
    return height * 0.26;
  }
  if (char === "-") {
    return height * 0.34;
  }
  return height * 0.28;
}

function drawSevenSegmentText(context, text, x, y, height, color) {
  let cursor = x;
  for (const char of text) {
    const width = getSevenSegmentCharWidth(char, height);
    if (/\d/.test(char)) {
      drawSevenSegmentDigit(context, char, cursor, y, width, height, color);
    } else if (char === ":") {
      drawSevenSegmentColon(context, cursor, y, width, height, color);
    } else if (char === "-") {
      drawSevenSegmentDash(context, cursor, y, width, height, color);
    }
    cursor += width;
  }
}

function drawSevenSegmentDigit(context, digit, x, y, width, height, color) {
  const active = new Set(SEVEN_SEGMENT_DIGITS[digit] ?? []);
  const thickness = height * 0.105;
  const segmentRects = {
    a: [x + width * 0.18, y, width * 0.64, thickness],
    g: [x + width * 0.18, y + height * 0.45, width * 0.64, thickness],
    d: [x + width * 0.18, y + height - thickness, width * 0.64, thickness],
    f: [x + width * 0.04, y + height * 0.055, thickness, height * 0.38],
    b: [x + width - thickness - width * 0.04, y + height * 0.055, thickness, height * 0.38],
    e: [x + width * 0.04, y + height * 0.55, thickness, height * 0.38],
    c: [x + width - thickness - width * 0.04, y + height * 0.55, thickness, height * 0.38],
  };

  for (const name of SEGMENT_NAMES) {
    const rect = segmentRects[name];
    drawGlowSegment(context, rect[0], rect[1], rect[2], rect[3], color, active.has(name));
  }
}

function drawSevenSegmentColon(context, x, y, width, height, color) {
  const radius = height * 0.055;
  drawGlowCircle(context, x + width * 0.5, y + height * 0.36, radius, color, true);
  drawGlowCircle(context, x + width * 0.5, y + height * 0.64, radius, color, true);
}

function drawSevenSegmentDash(context, x, y, width, height, color) {
  const thickness = height * 0.105;
  drawGlowSegment(context, x + width * 0.12, y + height * 0.45, width * 0.76, thickness, color, true);
}

function drawGlowSegment(context, x, y, width, height, color, active) {
  context.save();
  context.fillStyle = active ? color : "rgba(90, 160, 190, 0.12)";
  context.shadowColor = active ? color : "transparent";
  context.shadowBlur = active ? 18 : 0;
  roundRect(context, x, y, width, height, Math.min(width, height) / 2);
  context.fill();

  if (active) {
    context.globalAlpha = 0.38;
    context.shadowBlur = 32;
    roundRect(context, x, y, width, height, Math.min(width, height) / 2);
    context.fill();
  }
  context.restore();
}

function drawGlowCircle(context, x, y, radius, color, active) {
  context.save();
  context.fillStyle = active ? color : "rgba(90, 160, 190, 0.12)";
  context.shadowColor = active ? color : "transparent";
  context.shadowBlur = active ? 18 : 0;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function getWatermarkPosition(position, outputSize, boxWidth, boxHeight, margin) {
  const left = margin;
  const right = outputSize.width - margin - boxWidth;
  const top = margin;
  const bottom = outputSize.height - margin - boxHeight;

  return {
    x: position.endsWith("right") ? right : left,
    y: position.startsWith("top") ? top : bottom,
  };
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

async function renderFromMetadata() {
  cleanupObjectUrls();
  applySettingsToUi();
  renderReferencePhotoOptions();
  const todayRecord = getPhotoRecord(getTodayDate());
  const referenceRecord = getReferencePhotoRecord();
  const latestRecord = getLatestPhotoRecord();
  const overlayRecord = referenceRecord ?? latestRecord;
  state.previewRecords = getSortedPhotos();

  elements.todayTitle.textContent = todayRecord ? "今日已完成" : "今日未完成";
  elements.todayDate.textContent = getTodayDate();
  elements.todayPath.textContent = todayRecord?.file ?? "--";
  elements.todayCapturedAt.textContent = todayRecord ? formatDisplayDateTime(todayRecord.createdAt) : "--";
  elements.captureBtn.textContent = todayRecord ? "重新拍摄今日照片" : "拍摄今日照片";
  elements.setTodayReferenceBtn.disabled = !todayRecord;
  elements.setTodayReferenceBtn.textContent = todayRecord?.date === getSettings().referencePhotoDate
    ? "今日已是基准"
    : "设为基准";
  elements.clearReferenceBtn.disabled = !getSettings().referencePhotoDate;
  elements.referenceHint.textContent = getReferenceHint(referenceRecord);
  elements.openPreviewBtn.disabled = state.previewRecords.length < 2;

  await renderTodayPreview(todayRecord);
  await renderAlignmentOverlay(overlayRecord, Boolean(referenceRecord));
  await refreshReferencePoseData();
  drawPoseAlignment();
  await renderRecentList();
}

function renderReferencePhotoOptions() {
  const currentValue = getSettings().referencePhotoDate ?? "";
  const records = getSortedPhotos().slice().reverse();
  elements.referencePhotoSelect.replaceChildren();

  const autoOption = document.createElement("option");
  autoOption.value = "";
  autoOption.textContent = "不固定，自动使用最近照片";
  elements.referencePhotoSelect.append(autoOption);

  for (const record of records) {
    const option = document.createElement("option");
    option.value = record.date;
    option.textContent = `${record.date} ${record.date === getTodayDate() ? "(今天)" : ""}`.trim();
    elements.referencePhotoSelect.append(option);
  }

  elements.referencePhotoSelect.value = currentValue;
}

async function refreshReferencePoseData() {
  const referenceRecord = getReferencePhotoRecord() ?? getLatestPhotoRecord();
  if (!referenceRecord || !state.directoryHandle || !state.poseReady || state.poseDisabled) {
    state.referencePoseData = null;
    return;
  }

  try {
    await ensurePoseImageLandmarker();
    if (!state.poseLandmarkerImage) {
      state.referencePoseData = null;
      return;
    }

    const file = await getFileFromPath(referenceRecord.file);
    const imageBitmap = await createImageBitmap(file);
    const result = state.poseLandmarkerImage.detect(imageBitmap);
    const sourceWidth = imageBitmap.width;
    const sourceHeight = imageBitmap.height;
    imageBitmap.close();
    const landmarks = result?.landmarks?.[0] ?? null;
    state.referencePoseData = landmarks
      ? {
          date: referenceRecord.date,
          width: sourceWidth,
          height: sourceHeight,
          landmarks,
        }
      : null;
  } catch (error) {
    state.referencePoseData = null;
    disablePoseDetection("基准姿态读取失败，已自动关闭姿态对齐", error);
  }
}

async function ensurePoseImageLandmarker() {
  if (state.poseDisabled || state.poseLandmarkerImage || !state.poseVision || !state.poseReady) {
    return;
  }

  const { PoseLandmarker } = await import(MEDIAPIPE_BUNDLE_URL);
  state.poseLandmarkerImage = await PoseLandmarker.createFromOptions(state.poseVision, {
    baseOptions: {
      modelAssetPath: POSE_LANDMARKER_MODEL_URL,
    },
    runningMode: "IMAGE",
    numPoses: 1,
    minPoseDetectionConfidence: 0.55,
    minPosePresenceConfidence: 0.55,
    minTrackingConfidence: 0.55,
  });
}

function drawPoseAlignment() {
  const canvas = elements.poseOverlay;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  resizePoseOverlayCanvas();
  context.clearRect(0, 0, canvas.width, canvas.height);

  const live = state.livePoseLandmarks;
  const reference = state.referencePoseData;
  const video = elements.cameraPreview;
  if (!live || !reference || !video.videoWidth || !video.videoHeight) {
    return;
  }

  const referencePoints = mapLandmarksToDisplay(
    reference.landmarks,
    reference.width,
    reference.height,
    canvas.width,
    canvas.height,
  );
  const livePoints = mapLandmarksToDisplay(
    live,
    video.videoWidth,
    video.videoHeight,
    canvas.width,
    canvas.height,
  );

  drawReferenceSkeleton(context, referencePoints);
  drawLiveSkeleton(context, livePoints);
  drawAlignmentLinks(context, referencePoints, livePoints);
}

function resizePoseOverlayCanvas() {
  const canvas = elements.poseOverlay;
  const width = Math.max(1, Math.round(elements.viewfinder.clientWidth));
  const height = Math.max(1, Math.round(elements.viewfinder.clientHeight));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function clearPoseOverlay() {
  const context = elements.poseOverlay.getContext("2d");
  if (!context) {
    return;
  }
  resizePoseOverlayCanvas();
  context.clearRect(0, 0, elements.poseOverlay.width, elements.poseOverlay.height);
}

function mapLandmarksToDisplay(landmarks, sourceWidth, sourceHeight, displayWidth, displayHeight) {
  const scale = Math.max(displayWidth / sourceWidth, displayHeight / sourceHeight);
  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;
  const offsetX = (displayWidth - renderedWidth) / 2;
  const offsetY = (displayHeight - renderedHeight) / 2;

  const mapped = new Map();
  for (const point of ALIGNMENT_KEYPOINTS) {
    const landmark = landmarks?.[point.index];
    if (!landmark || landmark.visibility < 0.35 || landmark.presence < 0.35) {
      continue;
    }
    mapped.set(point.index, {
      x: offsetX + landmark.x * renderedWidth,
      y: offsetY + landmark.y * renderedHeight,
    });
  }
  return mapped;
}

function drawReferenceSkeleton(context, points) {
  context.save();
  context.strokeStyle = "rgba(255, 243, 208, 0.9)";
  context.lineWidth = 2;
  context.setLineDash([8, 7]);
  drawPoseConnections(context, points);
  context.setLineDash([]);
  for (const point of points.values()) {
    context.beginPath();
    context.arc(point.x, point.y, 8, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
}

function drawLiveSkeleton(context, points) {
  context.save();
  context.strokeStyle = "rgba(42, 167, 161, 0.92)";
  context.lineWidth = 3;
  drawPoseConnections(context, points);
  context.fillStyle = "rgba(42, 167, 161, 0.96)";
  for (const point of points.values()) {
    context.beginPath();
    context.arc(point.x, point.y, 5, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawPoseConnections(context, points) {
  for (const [from, to] of ALIGNMENT_CONNECTIONS) {
    const start = points.get(from);
    const end = points.get(to);
    if (!start || !end) {
      continue;
    }
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
}

function drawAlignmentLinks(context, referencePoints, livePoints) {
  context.save();
  context.strokeStyle = "rgba(219, 84, 61, 0.82)";
  context.lineWidth = 1.6;
  for (const point of ALIGNMENT_KEYPOINTS) {
    const reference = referencePoints.get(point.index);
    const live = livePoints.get(point.index);
    if (!reference || !live) {
      continue;
    }
    const distance = Math.hypot(reference.x - live.x, reference.y - live.y);
    if (distance < 10) {
      continue;
    }
    context.beginPath();
    context.moveTo(reference.x, reference.y);
    context.lineTo(live.x, live.y);
    context.stroke();
  }
  context.restore();
}

async function renderTodayPreview(record) {
  elements.todayPreview.replaceChildren();
  elements.todayPreview.classList.toggle("empty", !record);

  if (!record || !state.directoryHandle) {
    const empty = document.createElement("span");
    empty.textContent = "今日照片会显示在这里。";
    elements.todayPreview.append(empty);
    return;
  }

  const url = await createObjectUrlFromPath(record.file);
  if (!url) {
    elements.todayPreview.textContent = "今日照片无法读取。";
    return;
  }

  const image = document.createElement("img");
  image.alt = `${record.date} 的照片`;
  image.src = url;
  elements.todayPreview.append(image);
}

async function renderAlignmentOverlay(record, isReference = false) {
  elements.alignmentOverlay.classList.add("hidden");
  elements.alignmentOverlay.removeAttribute("src");

  if (!record || !state.directoryHandle) {
    elements.overlayHint.textContent = "关键点对齐会显示基准姿态和当前姿态，参考图叠加仅作为辅助。";
    return;
  }

  const url = await createObjectUrlFromPath(record.file);
  if (!url) {
    elements.overlayHint.textContent = "参考图无法读取，暂时不能显示叠图预览。";
    return;
  }

  elements.alignmentOverlay.src = url;
  if (getSettings().overlay.opacity > 0) {
    elements.alignmentOverlay.classList.remove("hidden");
  }
  elements.overlayHint.textContent = isReference
    ? `正在使用基准照片 ${record.date} 进行姿态对齐。`
    : `正在使用最近照片 ${record.date} 进行姿态对齐。`;
}

async function renderRecentList() {
  elements.recentList.replaceChildren();
  const records = getSortedPhotos().slice(-8).reverse();

  if (!records.length || !state.directoryHandle) {
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "还没有照片记录。";
    elements.recentList.append(hint);
    return;
  }

  for (const record of records) {
    const url = await createObjectUrlFromPath(record.file);
    if (!url) {
      continue;
    }

    const item = document.createElement("figure");
    item.className = "recent-item";

    const image = document.createElement("img");
    image.alt = `${record.date} 的记录`;
    image.src = url;

    const caption = document.createElement("span");
    caption.textContent = record.date.slice(5);

    const referenceButton = document.createElement("button");
    referenceButton.type = "button";
    referenceButton.textContent = record.date === getSettings().referencePhotoDate ? "当前基准" : "设为基准";
    referenceButton.addEventListener("click", () => setReferencePhoto(record.date));

    item.append(image, caption, referenceButton);
    elements.recentList.append(item);
  }
}

async function openPreviewModal() {
  state.previewRecords = getSortedPhotos();
  if (state.previewRecords.length < 2) {
    showError("至少需要两张照片才能进行快速预览。");
    return;
  }

  state.previewIndex = 0;
  elements.previewModal.classList.remove("hidden");
  await showPreviewFrame(state.previewIndex);
}

function closePreviewModal() {
  stopPreviewPlayback();
  elements.previewModal.classList.add("hidden");
  elements.previewImage.removeAttribute("src");
  elements.previewDate.textContent = "--";
}

async function showPreviewFrame(index) {
  if (!state.previewRecords.length) {
    return;
  }

  const safeIndex = (index + state.previewRecords.length) % state.previewRecords.length;
  state.previewIndex = safeIndex;
  const record = state.previewRecords[safeIndex];
  const url = await createObjectUrlFromPath(record.file);
  if (!url) {
    showError(`读取预览照片失败：${record.file}`);
    return;
  }

  elements.previewImage.src = url;
  elements.previewDate.textContent = `${record.date} · ${safeIndex + 1}/${state.previewRecords.length}`;
}

async function showPreviousPreviewFrame() {
  stopPreviewPlayback(false);
  await showPreviewFrame(state.previewIndex - 1);
}

async function showNextPreviewFrame() {
  stopPreviewPlayback(false);
  await showPreviewFrame(state.previewIndex + 1);
}

function togglePreviewPlayback() {
  if (state.previewPlaying) {
    stopPreviewPlayback();
    return;
  }

  state.previewPlaying = true;
  elements.previewPlayBtn.textContent = "暂停";
  scheduleNextPreviewTick();
}

function scheduleNextPreviewTick() {
  const fps = Number(elements.previewSpeed.value);
  const delay = Math.max(80, Math.round(1000 / fps));
  state.previewTimer = window.setTimeout(async () => {
    await showPreviewFrame(state.previewIndex + 1);
    if (state.previewPlaying) {
      scheduleNextPreviewTick();
    }
  }, delay);
}

function stopPreviewPlayback(resetLabel = true) {
  if (state.previewTimer) {
    window.clearTimeout(state.previewTimer);
    state.previewTimer = 0;
  }
  state.previewPlaying = false;
  if (resetLabel) {
    elements.previewPlayBtn.textContent = "播放";
  }
}

function restartPreviewPlaybackIfNeeded() {
  updatePreviewSpeedLabel();
  if (!state.previewPlaying) {
    return;
  }
  stopPreviewPlayback(false);
  state.previewPlaying = true;
  elements.previewPlayBtn.textContent = "暂停";
  scheduleNextPreviewTick();
}

function updatePreviewSpeedLabel() {
  elements.previewSpeedValue.textContent = `${elements.previewSpeed.value} fps`;
}

function updateOverlayOpacity() {
  const opacity = Number(elements.overlayOpacity.value);
  elements.alignmentOverlay.style.opacity = String(opacity / 100);
  elements.alignmentOverlay.style.mixBlendMode = "normal";
  elements.alignmentOverlay.classList.toggle("hidden", opacity <= 0 || !elements.alignmentOverlay.getAttribute("src"));
  elements.overlayOpacityValue.textContent = `${opacity}%`;
}

async function handleReferencePhotoSelectChange() {
  const selectedDate = elements.referencePhotoSelect.value || null;
  state.metadata.settings = normalizeSettings({
    ...getSettings(),
    referencePhotoDate: selectedDate,
  });
  await writeMetadata();
  await renderFromMetadata();
}

async function handleSettingsChange() {
  const previousSettings = getSettings();
  const nextSettings = normalizeSettings({
    capture: {
      aspectRatio: elements.aspectRatioSelect.value,
      guideMode: elements.guideModeSelect.value,
      cameraDeviceId: elements.cameraDeviceSelect.value,
      cameraResolution: elements.cameraResolutionSelect.value,
    },
    watermark: {
      style: elements.watermarkStyleSelect.value,
      position: elements.watermarkPositionSelect.value,
      size: elements.watermarkSizeSelect.value,
      color: elements.watermarkColorInput.value,
      background: elements.watermarkBackgroundInput.checked,
    },
    overlay: {
      opacity: Number(elements.overlayOpacity.value),
    },
    referencePhotoDate: previousSettings.referencePhotoDate,
  });
  const shouldRestartCamera = hasCameraInputChanged(previousSettings, nextSettings);

  state.metadata.settings = nextSettings;
  applySettingsToUi();
  await writeMetadata();

  if (shouldRestartCamera && state.stream && !state.cameraStarting) {
    startCamera();
  }
}

function hasCameraInputChanged(previousSettings, nextSettings) {
  return previousSettings.capture.cameraDeviceId !== nextSettings.capture.cameraDeviceId
    || previousSettings.capture.cameraResolution !== nextSettings.capture.cameraResolution;
}

function applySettingsToUi() {
  state.metadata.settings = normalizeSettings(state.metadata.settings);
  const settings = getSettings();
  const preset = getCapturePreset();

  elements.aspectRatioSelect.value = settings.capture.aspectRatio;
  elements.guideModeSelect.value = settings.capture.guideMode;
  elements.cameraDeviceSelect.value = settings.capture.cameraDeviceId;
  elements.cameraResolutionSelect.value = settings.capture.cameraResolution;
  elements.watermarkStyleSelect.value = settings.watermark.style;
  elements.watermarkPositionSelect.value = settings.watermark.position;
  elements.watermarkSizeSelect.value = settings.watermark.size;
  elements.watermarkColorInput.value = settings.watermark.color;
  elements.watermarkBackgroundInput.checked = settings.watermark.background;
  elements.overlayOpacity.value = String(settings.overlay.opacity);

  elements.viewfinder.style.aspectRatio = `${preset.width} / ${preset.height}`;
  elements.guideLines.dataset.mode = settings.capture.guideMode;
  elements.captureCanvas.width = preset.width;
  elements.captureCanvas.height = preset.height;
  const cameraPresetLabel = getCameraPresetLabel(settings.capture.cameraResolution);
  elements.captureSpec.textContent = `${preset.label}，输出 ${preset.width} x ${preset.height}。预览默认 ${cameraPresetLabel}。`;
  updateOverlayOpacity();
  renderWatermarkPreview();
}

function renderWatermarkPreview() {
  const settings = getSettings().watermark;
  const text = formatTimestamp(new Date());
  elements.watermarkPreview.replaceChildren();
  elements.watermarkPreview.dataset.style = settings.style;
  elements.watermarkPreview.dataset.position = settings.position;
  elements.watermarkPreview.dataset.size = settings.size;
  elements.watermarkPreview.dataset.background = String(settings.background);
  elements.watermarkPreview.style.color = settings.color;
  elements.watermarkPreview.style.textShadow = settings.style === "digital"
    ? `0 0 4px ${settings.color}, 0 0 12px ${settings.color}, 0 0 24px ${settings.color}`
    : "";

  if (settings.style === "digital") {
    renderSevenSegmentPreview(text);
  } else {
    elements.watermarkPreview.textContent = text;
  }
}

function renderSevenSegmentPreview(text) {
  for (const char of text) {
    const charElement = document.createElement("span");

    if (/\d/.test(char)) {
      charElement.className = "seg-char";
      const active = new Set(SEVEN_SEGMENT_DIGITS[char] ?? []);
      for (const name of SEGMENT_NAMES) {
        const segment = document.createElement("span");
        segment.className = `seg ${name}${active.has(name) ? "" : " off"}`;
        charElement.append(segment);
      }
    } else if (char === ":") {
      charElement.className = "seg-char seg-narrow";
      const top = document.createElement("span");
      const bottom = document.createElement("span");
      top.className = "seg-dot top";
      bottom.className = "seg-dot bottom";
      charElement.append(top, bottom);
    } else if (char === "-") {
      charElement.className = "seg-char seg-dash";
      const segment = document.createElement("span");
      segment.className = "seg g";
      charElement.append(segment);
    } else {
      charElement.className = "seg-char seg-space";
    }

    elements.watermarkPreview.append(charElement);
  }
}

function startPreviewClock() {
  renderWatermarkPreview();
  if (state.previewClock) {
    window.clearInterval(state.previewClock);
  }
  state.previewClock = window.setInterval(renderWatermarkPreview, 1000);
}

function getSettings() {
  return normalizeSettings(state.metadata.settings);
}

function getCapturePreset() {
  const aspectRatio = getSettings().capture.aspectRatio;
  return getCapturePresetForAspectRatio(aspectRatio);
}

function getCapturePresetForAspectRatio(aspectRatio) {
  return CAPTURE_PRESETS[aspectRatio] ?? CAPTURE_PRESETS[DEFAULT_SETTINGS.capture.aspectRatio];
}

function getOutputSize() {
  const preset = getCapturePreset();
  return {
    width: preset.width,
    height: preset.height,
  };
}

function updateCaptureAvailability() {
  elements.captureBtn.disabled = !state.directoryHandle || !state.stream || state.isCountingDown || Boolean(state.pendingPhoto);
}

function upsertPhotoRecord(record) {
  const photos = state.metadata.photos.filter((photo) => photo.date !== record.date);
  photos.push(record);
  photos.sort((a, b) => a.date.localeCompare(b.date));
  state.metadata.photos = photos;
  state.metadata.updatedAt = new Date().toISOString();
}

function hasTodayPhoto() {
  return Boolean(getPhotoRecord(getTodayDate()));
}

async function setTodayAsReference() {
  const todayRecord = getPhotoRecord(getTodayDate());
  if (!todayRecord) {
    return;
  }
  await setReferencePhoto(todayRecord.date);
}

async function setReferencePhoto(date) {
  state.metadata.settings = normalizeSettings({
    ...getSettings(),
    referencePhotoDate: date,
  });
  await writeMetadata();
  await renderFromMetadata();
}

async function clearReferencePhoto() {
  state.metadata.settings = normalizeSettings({
    ...getSettings(),
    referencePhotoDate: null,
  });
  await writeMetadata();
  await renderFromMetadata();
}

function getPhotoRecord(date) {
  return state.metadata.photos.find((photo) => photo.date === date);
}

function getReferencePhotoRecord() {
  const referenceDate = getSettings().referencePhotoDate;
  return referenceDate ? getPhotoRecord(referenceDate) : null;
}

function getReferenceHint(referenceRecord) {
  const referenceDate = getSettings().referencePhotoDate;
  if (referenceRecord) {
    return `当前基准照片：${referenceRecord.date}`;
  }
  if (referenceDate) {
    return `基准照片 ${referenceDate} 不在当前数据文件夹中。`;
  }
  return "当前没有固定基准照片。";
}

function getLatestPhotoRecord() {
  const photos = getSortedPhotos();
  return photos.at(-1) ?? null;
}

function getSortedPhotos() {
  return [...state.metadata.photos].sort((a, b) => a.date.localeCompare(b.date));
}

async function readMetadata(rootHandle) {
  let metadata;

  try {
    const fileHandle = await rootHandle.getFileHandle(METADATA_FILE);
    const file = await fileHandle.getFile();
    const parsed = JSON.parse(await file.text());
    metadata = normalizeMetadata(parsed);
  } catch {
    metadata = createEmptyMetadata();
  }

  const recovered = await recoverMissingPhotoRecords(rootHandle, metadata);
  state.recoveredPhotoCount = recovered.count;
  return recovered.metadata;
}

async function recoverMissingPhotoRecords(rootHandle, metadata) {
  try {
    const diskRecords = await scanPhotoRecords(rootHandle, metadata.settings);
    if (!diskRecords.length) {
      return { metadata, count: 0 };
    }

    const recordsByDate = new Map(metadata.photos.map((photo) => [photo.date, photo]));
    let recoveredCount = 0;

    for (const record of diskRecords) {
      if (recordsByDate.has(record.date)) {
        continue;
      }

      recordsByDate.set(record.date, record);
      recoveredCount += 1;
    }

    if (!recoveredCount) {
      return { metadata, count: 0 };
    }

    return {
      metadata: {
        ...metadata,
        updatedAt: new Date().toISOString(),
        photos: [...recordsByDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
      },
      count: recoveredCount,
    };
  } catch (error) {
    console.warn("recoverMissingPhotoRecords failed", error);
    return { metadata, count: 0 };
  }
}

async function scanPhotoRecords(rootHandle, settings) {
  const records = [];
  let photosDirectory;

  try {
    photosDirectory = await rootHandle.getDirectoryHandle("photos");
  } catch {
    return records;
  }

  for await (const [yearName, yearHandle] of photosDirectory.entries()) {
    if (yearHandle.kind !== "directory" || !/^\d{4}$/.test(yearName)) {
      continue;
    }

    for await (const [fileName, fileHandle] of yearHandle.entries()) {
      const match = /^(\d{4}-\d{2}-\d{2})\.jpe?g$/i.exec(fileName);
      if (fileHandle.kind !== "file" || !match || !fileName.startsWith(`${yearName}-`)) {
        continue;
      }

      const file = await fileHandle.getFile();
      records.push(createRecoveredPhotoRecord(match[1], yearName, fileName, file, settings));
    }
  }

  return records;
}

function createRecoveredPhotoRecord(date, year, fileName, file, settings) {
  const preset = getCapturePresetForAspectRatio(settings?.capture?.aspectRatio);
  const createdAtDate = Number.isFinite(file.lastModified) && file.lastModified > 0
    ? new Date(file.lastModified)
    : new Date(`${date}T00:00:00`);

  return {
    date,
    file: `photos/${year}/${fileName}`,
    width: preset.width,
    height: preset.height,
    createdAt: createdAtDate.toISOString(),
    timestampText: formatTimestamp(createdAtDate),
    hasTimestamp: true,
  };
}

async function writeMetadata() {
  if (!state.directoryHandle) {
    return;
  }

  state.metadata.updatedAt = new Date().toISOString();
  const fileHandle = await state.directoryHandle.getFileHandle(METADATA_FILE, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(normalizeMetadata(state.metadata), null, 2));
  await writable.close();
}

function createEmptyMetadata() {
  const now = new Date().toISOString();
  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    settings: structuredClone(DEFAULT_SETTINGS),
    photos: [],
  };
}

function normalizeMetadata(metadata) {
  return {
    version: Number(metadata?.version) || 1,
    createdAt: metadata?.createdAt || new Date().toISOString(),
    updatedAt: metadata?.updatedAt || new Date().toISOString(),
    settings: normalizeSettings(metadata?.settings),
    photos: Array.isArray(metadata?.photos)
      ? metadata.photos
          .filter((photo) => photo?.date && photo?.file)
          .map((photo) => ({
            date: String(photo.date),
            file: String(photo.file),
            width: Number(photo.width) || getOutputSize().width,
            height: Number(photo.height) || getOutputSize().height,
            createdAt: photo.createdAt || new Date().toISOString(),
            timestampText: photo.timestampText || "",
            hasTimestamp: Boolean(photo.hasTimestamp),
          }))
      : [],
  };
}

function normalizeSettings(settings) {
  const capture = settings?.capture ?? {};
  const watermark = settings?.watermark ?? {};
  const overlay = settings?.overlay ?? {};
  const aspectRatio = CAPTURE_PRESETS[capture.aspectRatio]
    ? capture.aspectRatio
    : DEFAULT_SETTINGS.capture.aspectRatio;
  const guideMode = ["half-body", "portrait", "background"].includes(capture.guideMode)
    ? capture.guideMode
    : DEFAULT_SETTINGS.capture.guideMode;
  const cameraDeviceId = typeof capture.cameraDeviceId === "string"
    ? capture.cameraDeviceId
    : DEFAULT_SETTINGS.capture.cameraDeviceId;
  const cameraResolution = CAMERA_CONSTRAINT_PRESETS.some((preset) => preset.key === capture.cameraResolution)
    ? capture.cameraResolution
    : DEFAULT_SETTINGS.capture.cameraResolution;
  const style = ["digital", "classic", "minimal"].includes(watermark.style)
    ? watermark.style
    : DEFAULT_SETTINGS.watermark.style;
  const position = ["bottom-left", "bottom-right", "top-left", "top-right"].includes(
    watermark.position,
  )
    ? watermark.position
    : DEFAULT_SETTINGS.watermark.position;
  const size = WATERMARK_SIZES[watermark.size] ? watermark.size : DEFAULT_SETTINGS.watermark.size;
  const color = /^#[0-9a-f]{6}$/i.test(watermark.color ?? "")
    ? watermark.color
    : DEFAULT_SETTINGS.watermark.color;
  const overlayOpacity = Number.isFinite(Number(overlay.opacity))
    ? Math.min(100, Math.max(0, Number(overlay.opacity)))
    : DEFAULT_SETTINGS.overlay.opacity;
  const referencePhotoDate = /^\d{4}-\d{2}-\d{2}$/.test(settings?.referencePhotoDate ?? "")
    ? settings.referencePhotoDate
    : null;

  return {
    capture: { aspectRatio, guideMode, cameraDeviceId, cameraResolution },
    watermark: {
      style,
      position,
      size,
      color,
      background: typeof watermark.background === "boolean"
        ? watermark.background
        : DEFAULT_SETTINGS.watermark.background,
    },
    overlay: {
      opacity: overlayOpacity,
    },
    referencePhotoDate,
  };
}

function getCameraPresetIndex(key) {
  const index = CAMERA_CONSTRAINT_PRESETS.findIndex((preset) => preset.key === key);
  return index >= 0 ? index : 0;
}

function getCameraPresetLabel(key) {
  return CAMERA_CONSTRAINT_PRESETS[getCameraPresetIndex(key)]?.label ?? CAMERA_CONSTRAINT_PRESETS[0].label;
}

function buildCameraConstraints(baseConstraints, deviceId) {
  if (!deviceId || baseConstraints.video === true) {
    return baseConstraints;
  }

  return {
    ...baseConstraints,
    video: {
      ...baseConstraints.video,
      deviceId: { exact: deviceId },
    },
  };
}

async function refreshCameraDeviceOptions() {
  if (!navigator.mediaDevices?.enumerateDevices || !elements.cameraDeviceSelect) {
    return;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const selectedValue = getSettings().capture.cameraDeviceId;

    elements.cameraDeviceSelect.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "系统默认";
    elements.cameraDeviceSelect.append(defaultOption);

    cameras.forEach((camera, index) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.textContent = camera.label || `摄像头 ${index + 1}`;
      elements.cameraDeviceSelect.append(option);
    });

    const hasSelected = cameras.some((camera) => camera.deviceId === selectedValue);
    elements.cameraDeviceSelect.value = hasSelected ? selectedValue : "";
  } catch (error) {
    console.warn("refreshCameraDeviceOptions failed", error);
  }
}

function syncSelectedCameraDevice(deviceId) {
  const currentSettings = getSettings();
  if (currentSettings.capture.cameraDeviceId === deviceId || !state.directoryHandle) {
    return;
  }

  state.metadata.settings = normalizeSettings({
    ...currentSettings,
    capture: {
      ...currentSettings.capture,
      cameraDeviceId: deviceId,
    },
  });
  writeMetadata();
}

async function getDirectory(parentHandle, name, create = false) {
  return parentHandle.getDirectoryHandle(name, { create });
}

async function writeBlob(directoryHandle, fileName, blob) {
  const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

async function createObjectUrlFromPath(path) {
  try {
    const file = await getFileFromPath(path);
    const url = URL.createObjectURL(file);
    state.objectUrls.add(url);
    return url;
  } catch {
    return null;
  }
}

async function getFileFromPath(path) {
  const parts = path.split("/").filter(Boolean);
  const fileName = parts.pop();
  let directory = state.directoryHandle;

  for (const part of parts) {
    directory = await directory.getDirectoryHandle(part);
  }

  const fileHandle = await directory.getFileHandle(fileName);
  return fileHandle.getFile();
}

function cleanupObjectUrls() {
  for (const url of state.objectUrls) {
    URL.revokeObjectURL(url);
  }
  state.objectUrls.clear();
}

async function verifyPermission(handle) {
  const options = { mode: "readwrite" };
  if ((await handle.queryPermission(options)) === "granted") {
    return true;
  }
  return (await handle.requestPermission(options)) === "granted";
}

function supportsFileSystemAccess() {
  return window.isSecureContext && "showDirectoryPicker" in window;
}

function setStatus(element, text, variant) {
  element.textContent = text;
  element.classList.remove("ready", "warn", "muted");
  element.classList.add(variant);
}

function showError(message) {
  console.error(message);
  if (elements.runtimeNotice) {
    elements.runtimeNotice.textContent = message;
    elements.runtimeNotice.classList.remove("hidden");
  }
}

function getTodayDate() {
  return formatDate(new Date());
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimestamp(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${formatDate(date)} ${hours}:${minutes}`;
}

function formatTimeForFile(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}-${minutes}-${seconds}`;
}

function formatDisplayDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }
  return `${formatDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
