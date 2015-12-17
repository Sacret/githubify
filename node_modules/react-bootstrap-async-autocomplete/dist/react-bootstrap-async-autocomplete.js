/**
 * @jsx React.DOM
 */

var AutocompleteFactory = function(
    React,
    bean,
    Input,
    DropdownMenu,
    DropdownStateMixin,
    MenuItem) {
  return React.createClass({
    mixins: [DropdownStateMixin],
    getInitialState: function() {
      return {
        searchResults: []
      }
    },
    componentDidMount: function() {
      var self = this;
      //Listen to events outside component
      bean.on(document, 'click.rbaac', function() {
        self.setState({
          showResults: false
        });
      });
      bean.on(document, 'keyup.rbaac', function(ev) {
        if (ev.keyCode !== 27) return;
        self.setState({
          showResults: false
        });
      });
    },
    componentWillUnmount: function() {
      bean.off(document, '.rbaac');
    },
    showResults: function() {
      this.setState({
        showResults: true
      });
    },
    handleTyping: function(ev) {
      var key = ev.target.value, self = this;
      if (this.props.onSearch) {
        this.setState({loading: true});
        this.props.onSearch(key, function(results) {
          self.setState({
            searchResults: results,
            loading: false
          });
        });
        this.showResults();
      }
    },
    searchResultClicked: function(i) {
      var self = this;
      return function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        self.props.onItemSelect && self.props.onItemSelect(self.state.searchResults[i]);
        self.setState({
          showResults: false
        });
      };
    },
    renderResults: function() {
      var self = this;
      if (this.state.loading) return this.props.loadingContent || React.DOM.li(null, "Loading results..");
      return this.state.searchResults.map(function(one, i) {
        return MenuItem({key: i, onClick: self.searchResultClicked(i)}, self.props.itemContent ? self.props.itemContent(one) : one);
      });
    },
    render: function() {
      var cls = 'dropdown';
      if (this.state.showResults) cls += ' open';
      return (
        React.DOM.div({className: cls}, 
           this.transferPropsTo(Input({className: "dropdown-toggle", 
                                        onChange: this.handleTyping, 
                                        key: 0, 
                                        type: "text"})), 
          DropdownMenu({ref: "menu", key: 1}, this.renderResults())
        )
          );
    }
  });
};

if (typeof module === 'object' && module.exports) {
  module.exports = AutocompleteFactory(
      require('react'),
      require('bean'),
      require('react-bootstrap/Input'),
      require('react-bootstrap/DropdownMenu'),
      require('react-bootstrap/DropdownStateMixin'),
      require('react-bootstrap/MenuItem'));
} else if (typeof define === 'function' && define.amd) {
  define(function(require) {
    return AutocompleteFactory(
        require('react'),
        require('bean'),
        require('react-bootstrap/Input'),
        require('react-bootstrap/DropdownMenu'),
        require('react-bootstrap/DropdownStateMixin'),
        require('react-bootstrap/MenuItem'));
  });
} else {
  window.ReactBootstrapAsyncAutocomplete = AutocompleteFactory(
      window.React,
      window.bean,
      window.ReactBootstrap.Input,
      window.ReactBootstrap.DropdownMenu,
      window.ReactBootstrap.DropdownStateMixin,
      window.ReactBootstrap.MenuItem);
}
