'use strict';

const defaultInitialPage = 1;
const defaultOffset = 250;
const defaultButtonId = 'more-button';

const topOfElement = (element) => {
  if (!element) {
    return 0;
  }
  return element.offsetTop + topOfElement(element.offsetParent);
};

/**
 * @extends ReactCompositeComponentInterface
 *
 * @mixin InfiniteScrollMixin
 */
const InfiniteScrollMixin = {

  getButtonId(buttonId) {
    this.props.buttonId = buttonId;
  },

  componentWillMount() {
    this.nextPage = this.props.initialPage || defaultInitialPage;
  },

  componentWillUnmount() {
    this.detachScrollListener();
  },

  componentDidMount() {
    this.attachScrollListener();
  },

  componentDidUpdate() {
    this.attachScrollListener();
  },

  scrollListener() {
    let el = this.getDOMNode();
    let offset = this.props.offset || defaultOffset;
    let buttonId = this.props.buttonId || defaultButtonId;
    let scrollTop = (window.pageYOffset !== undefined) ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if (topOfElement(el) + el.offsetHeight - scrollTop - window.innerHeight < offset) {
      this.detachScrollListener();
      let btn = document.getElementById(buttonId);
      if (btn) {
        btn.click();
      }
    }
  },

  attachScrollListener() {
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.scrollListener);
    this.scrollListener();
  },

  detachScrollListener () {
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.scrollListener);
  }
};

export default InfiniteScrollMixin;
