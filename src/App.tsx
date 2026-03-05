import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Customers } from './page/Customers';
import { CustomerForm } from './page/CustomerForm';
import { CustomerDetail } from './page/CustomerDetail';
import { Films } from './page/Films';
import { FilmDetail } from './page/FilmDetail';
import { ActorDetail } from './page/ActorDetail';
import { Layout } from './components/layouts/Layout';
import { Home } from './page/Home';
 
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Customer Routes */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/edit/:id" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          
          {/* Film Routes */}
          <Route path="/films" element={<Films />} />
          <Route path="/films/:id" element={<FilmDetail />} />
          
          {/* Actor Routes */}
          <Route path="/actors/:id" element={<ActorDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;