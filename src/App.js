import logo from 'chesscomlogo.png';
import './App.css';
import VersusScreen from "screens/VersusScreen";


const player1 = "anastlemat";
const player2 = "danieldiurczak";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width="200" />
        <VersusScreen name1={player1} name2={player2} />
      </header>
    </div>
  );
}

export default App;
