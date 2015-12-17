/**
 * @jsx React.DOM
 */

(function() {
  var App = React.createClass({
    searchRequested: _.debounce(function(key, cb) {
      axios.get('http://corsify.appspot.com/http://vocab.nic.in/rest.php/country/json').then(function(resp) {
        cb(resp.data.countries.filter(function(one) {
          return one.country.country_name.toLowerCase().indexOf(key.toLowerCase()) > -1;
        }));
      });
    }, 3000),
    getTextContentForItem: function(one) {
      return one.country.country_name;
    },
    onSelected: function(one) {
      alert('Selected: ' + one.country.country_name);
    },
    render: function() {
      return (
          <div className="container">
            <h1>Example</h1>
            <div className="row">
              <div className="col-md-3">
                <ReactBootstrapAsyncAutocomplete label="Country" placeholder="Start writing a country name" onSearch={this.searchRequested} itemContent={this.getTextContentForItem} onItemSelect={this.onSelected} />
              </div>
            </div>
          </div>
          );
    }
  });

  React.renderComponent(App(), document.body);
})();
