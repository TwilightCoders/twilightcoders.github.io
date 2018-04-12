import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';

function fetchQuery(operation, variables) {
  let token = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_GRAPHQL_TOKEN : null;

  let getToken = fetch('https://s3.amazonaws.com/jimmyvanveen-bucket/tc_gh_token.txt')
    .then(response => {
      return response.text();
    });


  const fetchGithub = newToken => {
    return fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'User-Agent': 'TwilightCoders',
        'Authorization': `token ${newToken || token}`
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    }).then(response => {
      return response.json();
    });
  }

  if (!token) {
    return getToken
      .then(newToken => {
        return fetchGithub(newToken);
      });
  } else {
    return fetchGithub();
  }
}

export default new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
