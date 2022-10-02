import { Layout } from 'antd';

import './App.css';
import Home from './components/Home';

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <>
      <Layout>
        <Header className='header'>CSV Parser</Header>
        <Content className='content'>
          <Home />
        </Content>
        <Footer className='footer'>@Copyrights for the developers - 2022</Footer>
      </Layout>
    </>
  );
}

export default App;
