import { Camera, Upload, ShieldCheck } from 'lucide-react'
import Button from './Button'

/**
 * CameraCapture component:
 * Live camera feed with oval face guide, capture button, and photo upload fallback.
 *
 * @param {object} props
 * @param {string} props.status - 'init' | 'loading' | 'ready' | 'error'
 * @param {string} props.errorMsg - Error message if status === 'error'
 * @param {() => void} props.onCapture - Called when capture button is pressed
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onUpload - Called when a file is selected
 * @param {() => void} props.onRetry - Called when retry button is pressed
 * @param {React.RefObject<HTMLVideoElement>} props.videoRef - Ref to the <video> element
 */
export default function CameraCapture({
  status,
  errorMsg,
  onCapture,
  onUpload,
  onRetry,
  videoRef,
}) {
  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Viewport Area */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
        {status === 'error' ? (
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-ivory/10 flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-ivory/60" />
            </div>
            <p className="text-ivory mb-6 text-sm">{errorMsg}</p>
            <div className="space-y-3">
              <Button onClick={onRetry}>Try again</Button>
              <label className="block">
                <span className="text-sm text-ivory/60 underline cursor-pointer hover:text-ivory transition-colors">
                  Upload a photo instead
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-espresso/40">
            {/* Camera feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* Oval face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[62%] h-[78%] border-2 border-ivory/50 rounded-[50%]"
                style={{ boxShadow: '0 0 0 9999px rgba(43, 27, 23, 0.45)' }}
              />
            </div>

            {/* Loading overlay */}
            {status === 'loading' && (
              <div className="absolute inset-0 bg-espresso/70 flex items-center justify-center backdrop-blur-xs">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-ivory/30 border-t-marigold rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-ivory text-sm font-medium">Analyzing complexion...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 py-6 space-y-4">
        {status === 'ready' && (
          <>
            <button
              onClick={onCapture}
              aria-label="Capture photo"
              className="w-18 h-18 rounded-full bg-ivory border-4 border-ivory/40 mx-auto block cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-lg"
            />
            <label className="block text-center">
              <span className="text-sm text-ivory/70 underline cursor-pointer hover:text-ivory transition-colors">
                <Upload size={14} className="inline mr-1" />
                Upload a photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                className="hidden"
              />
            </label>
          </>
        )}

        {/* Privacy note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-ivory/50">
          <ShieldCheck size={13} className="text-sage" />
          <span>Processed on your device. Never uploaded.</span>
        </div>
      </div>
    </div>
  )
}
