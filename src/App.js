import logo from 'chesscomlogo.png';
import './App.css';
import VersusScreen from "screens/VersusScreen";

const players = [
  "anastlemat",
  "danieldiurczak",
  "bdcosta2",
  "unburn",
  "werdze",
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width="200" />
        <VersusScreen names={players} />
      </header>
    </div>
  );
}

export default App;
