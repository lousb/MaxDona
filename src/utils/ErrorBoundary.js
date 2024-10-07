import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };

        // Store the original console.warn function
        this.originalWarn = console.warn;

        // Override console.warn to suppress all warnings in production
        if (process.env.NODE_ENV === 'production') {
            console.warn = () => {}; // Suppress all warnings in production
        }
    }

    static getDerivedStateFromError() {
        // Update state so the next render shows the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // Optionally, handle the error (e.g., send to logging service)
        // But we won't log anything or render anything specific.
    }

    componentWillUnmount() {
        // Restore the original console.warn when the component unmounts
        if (process.env.NODE_ENV === 'production') {
            console.warn = this.originalWarn;
        }
    }

    render() {
        // If an error occurred, render nothing
        if (this.state.hasError) {
            return null; // Seamless - render nothing on error
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
