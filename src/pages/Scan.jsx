/**
 * Scan page — camera capture, face detection, skin sampling.
 * The selfie NEVER leaves the device.
 */
import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getLandmarker, SAMPLE_LANDMARKS } from '../hooks/useFaceLandmarker'
import { rgbToLab, samplePatch, labDistance } from '../lib/color'
import { classifyDepth, classifyUndertone, ruleKey } from '../lib/classify'
import { getRecommendation } from '../lib/recommend'
import LightingWarning from '../components/LightingWarning'
import CameraCapture from '../components/CameraCapture'

export default function Scan() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [status, setStatus] = useState('init') // init | loading | ready | error
  const [errorMsg, setErrorMsg] = useState('')
  const [lightingIssue, setLightingIssue] = useState(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setStatus('loading')
      setErrorMsg('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('ready')
    } catch (err) {
      console.error('Camera error:', err)
      setStatus('error')
      setErrorMsg(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings or upload a photo.'
          : 'Could not access the camera. You can upload a photo to continue.'
      )
    }
  }, [])

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  // Initialize camera on mount
  useEffect(() => {
    startCamera()
  }, [startCamera])

  // Stop active camera stream
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  /**
   * Process a populated canvas element:
   * Run MediaPipe face detection, sample 3 landmark patches, check lighting, classify, and navigate to results.
   */
  const processCanvas = async (canvas) => {
    setStatus('loading')
    setLightingIssue(null)

    try {
      const landmarker = await getLandmarker()
      const result = landmarker.detect(canvas)

      if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
        setStatus('error')
        setErrorMsg("We couldn't clearly detect your face. Please move closer, face the light, and try again.")
        return
      }

      const landmarks = result.faceLandmarks[0]
      const ctx = canvas.getContext('2d')

      // Get sample points from landmarks
      const getPoint = (idx) => ({
        x: Math.round(landmarks[idx].x * canvas.width),
        y: Math.round(landmarks[idx].y * canvas.height),
      })

      const leftCheek = getPoint(SAMPLE_LANDMARKS.leftCheek)
      const rightCheek = getPoint(SAMPLE_LANDMARKS.rightCheek)
      const forehead = getPoint(SAMPLE_LANDMARKS.forehead)

      // Sample 12x12 patches
      const leftRGB = samplePatch(ctx, leftCheek.x, leftCheek.y, 12)
      const rightRGB = samplePatch(ctx, rightCheek.x, rightCheek.y, 12)
      const foreheadRGB = samplePatch(ctx, forehead.x, forehead.y, 12)

      // Average the three patches
      const avgRGB = [
        Math.round((leftRGB[0] + rightRGB[0] + foreheadRGB[0]) / 3),
        Math.round((leftRGB[1] + rightRGB[1] + foreheadRGB[1]) / 3),
        Math.round((leftRGB[2] + rightRGB[2] + foreheadRGB[2]) / 3),
      ]

      // Convert to CIELAB
      const lab = rgbToLab(avgRGB)
      const leftLab = rgbToLab(leftRGB)
      const rightLab = rgbToLab(rightRGB)
      const foreheadLab = rgbToLab(foreheadRGB)

      // Lighting check
      if (lab.L < 35) {
        setLightingIssue('Too dark — move to a brighter spot, ideally facing a window.')
      } else if (lab.L > 85) {
        setLightingIssue('Too bright — move away from direct sunlight or excessive glare.')
      } else if (Math.abs(leftLab.L - rightLab.L) > 12) {
        setLightingIssue('Uneven lighting — face the light source directly for more accurate matching.')
      }

      // Calculate confidence based on pairwise patch agreement
      const d1 = labDistance(leftLab, rightLab)
      const d2 = labDistance(leftLab, foreheadLab)
      const d3 = labDistance(rightLab, foreheadLab)
      const avgDist = (d1 + d2 + d3) / 3
      const confidence = Math.max(65, Math.min(98, Math.round(100 - avgDist * 2.5)))

      // Classify
      const { level: monkLevel, alt: monkAlt } = classifyDepth(lab)
      const undertone = classifyUndertone(lab)
      const key = ruleKey(monkLevel, undertone)
      const recommendation = getRecommendation(monkLevel, undertone)

      // Generate a thumbnail to preview on Results page
      let capturedImage = null
      try {
        capturedImage = canvas.toDataURL('image/jpeg', 0.85)
      } catch (e) {
        console.warn('Could not generate dataURL:', e)
      }

      // Navigate to results
      navigate('/results', {
        state: {
          monkLevel,
          monkAlt,
          undertone,
          lab,
          ruleKey: key,
          recommendation,
          confidence,
          capturedImage,
          samplePoints: {
            leftCheek: { ...leftCheek, relX: landmarks[SAMPLE_LANDMARKS.leftCheek].x, relY: landmarks[SAMPLE_LANDMARKS.leftCheek].y },
            rightCheek: { ...rightCheek, relX: landmarks[SAMPLE_LANDMARKS.rightCheek].x, relY: landmarks[SAMPLE_LANDMARKS.rightCheek].y },
            forehead: { ...forehead, relX: landmarks[SAMPLE_LANDMARKS.forehead].x, relY: landmarks[SAMPLE_LANDMARKS.forehead].y },
          },
        },
      })
    } catch (err) {
      console.error('Analysis error:', err)
      setStatus('error')
      setErrorMsg('Something went wrong during analysis. Please try again or upload another photo.')
    }
  }

  // Handle capture from live camera
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    if (video.videoWidth === 0 || video.videoHeight === 0) return

    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)

    stopStream()
    processCanvas(canvas)
  }

  // Handle photo upload fallback
  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    stopStream()
    setStatus('loading')

    const img = new Image()
    img.onload = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      processCanvas(canvas)
    }
    img.onerror = () => {
      setStatus('error')
      setErrorMsg('Failed to load image file. Please choose a valid image (JPEG/PNG/WebP).')
    }
    img.src = URL.createObjectURL(file)
  }

  const handleRetake = () => {
    setLightingIssue(null)
    setErrorMsg('')
    startCamera()
  }

  return (
    <div className="min-h-screen bg-espresso flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-ivory/80 hover:text-ivory cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <span className="text-sm font-medium text-ivory/70">Skin Scan</span>
        <div className="w-12" />
      </div>

      {/* Lighting / Environment tips */}
      <div className="px-4 pb-2">
        <p className="text-xs text-ivory/60 text-center">
          Face a natural light source · No filters · Minimal makeup for best results
        </p>
      </div>

      {/* Lighting warning banner */}
      {lightingIssue && (
        <div className="px-4 pb-3 max-w-sm mx-auto w-full">
          <LightingWarning message={lightingIssue} onRetake={handleRetake} />
        </div>
      )}

      {/* Camera capture viewport */}
      <CameraCapture
        status={status}
        errorMsg={errorMsg}
        onCapture={handleCapture}
        onUpload={handleUpload}
        onRetry={handleRetake}
        videoRef={videoRef}
      />

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
