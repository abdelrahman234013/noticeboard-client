import Footer from './components/layout/Footer.jsx';
import Navbar from './components/layout/Navbar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
