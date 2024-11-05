import { Outlet } from "react-router-dom";
import Layout from "./Components/layout";
import { Provider } from "react-redux";
import {store} from "./store"

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <Outlet />
      </Layout>
    </Provider>
  );
}


export default App;
