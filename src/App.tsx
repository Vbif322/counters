import './App.css';
import Table from './components/Table/Table';
import store from './models/counters';

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="container">
        <p className="title">Список счетчиков</p>
        <Table store={store} />
      </div>
    </div>
  );
};

export default App;
