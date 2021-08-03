import logo from "chesscomlogo.png";
import "./App.css";
import "./index.css";
import VersusScreen from "screens/VersusScreen";
import { isMobile } from "react-device-detect";

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
      <img src={logo} width="200" />
      <div className={`screen`}>
        <VersusScreen names={players} />
      </div>
    </div>
  );
}

export default App;
