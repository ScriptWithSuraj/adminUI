import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }
  // two phase methods are in error boundry
  // 1 . getDerivedStateFrom(error)
  // 2.  componentDidCatchError( error, info)

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }
  render() {
    if (this.state.hasError) {
      //  if something went wrong with code then this will render
      return <h1>Something went wrong</h1>;
    } else {
      //  if everything okay  main component  will render.
      return this.props.children;
    }
  }
}
export default ErrorBoundary;
