'use client';
import React from 'react';
export class BlockErrorBoundary extends React.Component<{
    children: React.ReactNode;
    blockName: string;
}, {
    error: boolean;
}> {
    state = { error: false };
    static getDerivedStateFromError() { return { error: true }; }
    render() { if (this.state.error)
        return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><strong>{this.props.blockName} could not render.</strong><button className="btn ml-3" onClick={() => this.setState({ error: false })}>Retry</button></div>; return this.props.children; }
}

