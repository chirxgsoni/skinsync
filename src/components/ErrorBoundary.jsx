import { Component } from 'react'
import Button from './Button'

/**
 * Top-level ErrorBoundary to prevent blank screen crashes.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white rounded-2xl border border-sand p-8 shadow-sm">
            <h2 className="text-xl font-bold text-espresso mb-2">Something went wrong</h2>
            <p className="text-sm text-cocoa mb-6">
              {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
            </p>
            <Button onClick={() => (window.location.href = '/')}>
              Return to Home
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
