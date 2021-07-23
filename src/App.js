import logo from './logo.svg';
import './App.css';
import VersusScreen from "screens/VersusScreen";


const player1 = "anastlemat";
const player2 = "danieldiurczak";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <VersusScreen name1={player1} name2={player2} />
      </header>
    </div>
  );
}

export default App;
