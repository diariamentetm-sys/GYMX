import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-neutral-900 border border-orange-500/40 rounded-md p-6 text-center">
            <h1 className="text-white font-bold text-lg mb-2">Erro ao carregar a página</h1>
            <p className="text-neutral-400 text-sm mb-4">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-md font-semibold text-sm"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
