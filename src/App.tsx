import "./App.css";
import KanbanBoard from "./components/KanbanBoard";
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

const App = () => {
  return (<ApolloProvider client={client}>
            <KanbanBoard />
          </ApolloProvider>)

}

export default App;
