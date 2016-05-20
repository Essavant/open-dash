import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Ladda from 'ladda';

const laddaOptions = {
  buttonStyle: 'data-style',
  buttonColor: 'data-color',
  buttonSize: 'data-size',
  spinnerSize: 'data-spinner-size',
  spinnerColor: 'data-spinner-color'
};

class LaddaButton extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.laddaButton = Ladda.create(findDOMNode(this));
  }

  componentWillUnmount() {
    if (this.laddaButton.remove) {
      this.laddaButton.remove();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.laddaButton) {
      return;
    }

    // Skip if all props are the same
    if (prevProps.loading === this.props.loading && prevProps.disabled === this.props.disabled) {
      return;
    }

    if (!this.props.loading && this.props.disabled) {
      this.laddaButton.stop();
      this.laddaButton.disable();
    }

    if (this.props.loading && !this.laddaButton.isLoading()) {
      this.laddaButton.start();
    } else if (!this.props.loading && this.laddaButton.isLoading()) {
      this.laddaButton.stop();
    }

    if (typeof this.props.progress !== 'undefined') {
      this.laddaButton.setProgress(this.props.progress);
    }
  }

  render() {
    let props = {};
    for (let prop in this.props) {
      props[laddaOptions[prop] || prop] = this.props[prop];
    }

    // Add the ladda-button class to the button.
    props.className = 'ladda-button ' + (props.className || '');

    return React.DOM.button(props,
      React.DOM.span({ className: 'ladda-label' }, this.props.children),
      React.DOM.span({ className: 'ladda-spinner' })
    );
  }
}

LaddaButton.propTypes = {
  loading: React.PropTypes.bool,
  progress: React.PropTypes.number,
  buttonStyle: React.PropTypes.string,
  buttonColor: React.PropTypes.string,
  buttonSize: React.PropTypes.string,
  spinnerSize: React.PropTypes.number,
  spinnerColor: React.PropTypes.string
};

LaddaButton.defaultProps = {
  loading: false,
  buttonStyle: 'expand-left'
};

export default LaddaButton;
