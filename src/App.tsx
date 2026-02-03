 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layouts/Layout';
import { Home } from './page/Home';
import { Films } from './page/Films';
import { Customers } from './page/Customers';
 

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/films" element={<Films />} />
          {/* Agregaremos más rutas después */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;