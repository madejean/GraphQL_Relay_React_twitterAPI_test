import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class Item extends React.Component {
  render() {
    var item = this.props.store.search;
    const itemList = item.map((text, __dataID__) => {
      console.log(text)
      return (
        <div key={__dataID__}>
          <h3>{text.created_at}</h3>
          <h2>{text.text}</h2>
          <br />
        </div>
      )
    })
    return(
      <div>
        {itemList}
      </div>
    )
  }
};

Item = Relay.createContainer(Item, {
  fragments: {
    store: () => Relay.QL `
      fragment on TwitterAPI {
        search(q: "test", count: 5, result_type: popular) {
            text,
            created_at
          }
        }
    `,
  }
})

class TwitterRoute extends Relay.Route {
  static routeName = 'TwitterRoute';
  static queries = {
    store: ((Component) => {
      return Relay.QL `
      query root {
        twitter { ${Component.getFragment('store')} },
      }`
    })
  }
}

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('https://www.graphqlHub.com/graphql')
);

ReactDOM.render(
  <Relay.RootContainer
    Component={Item}
    route={new TwitterRoute()}
    />,
  document.getElementById('main')
);
