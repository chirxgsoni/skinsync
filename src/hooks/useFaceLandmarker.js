import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

/**
 * Singleton MediaPipe Face Landmarker instance.
 * Lazy-loaded: the model is only downloaded when the Scan page is opened.
 */
let landmarker = null

/**
 * Get (or create) the Face Landmarker singleton.
 * The model runs in IMAGE mode and detects a single face.
 *
 * @returns {Promise<FaceLandmarker>}
 */
export async function getLandmarker() {
  if (landmarker) return landmarker

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
  )

  landmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
    },
    runningMode: 'IMAGE',
    numFaces: 1,
  })

  return landmarker
}

/**
 * Landmark indices for skin sampling regions.
 * Verify visually with a debug overlay on test photos.
 */
export const SAMPLE_LANDMARKS = {
  leftCheek: 50,
  rightCheek: 280,
  forehead: 151,
}
