import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

// Create an http link:
const httpLink = new HttpLink({
    uri: `${window.location.protocol}//${window.location.host}/graphql`
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}/graphql`,
    options: {
        reconnect: true,
        timeout: 50000
    }
});

const cache = new InMemoryCache({
});


// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link, cache
});

export default client;