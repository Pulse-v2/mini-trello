import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  //TODO: Add a real URL to use Appolo CLient GraphQL
  uri: 'API_URL', // Replace this with your actual GraphQL endpoint
      cache: new InMemoryCache(),
  
      name: 'react-web-client',
      version: '1.3',
      queryDeduplication: false,
      defaultOptions: {
      watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;