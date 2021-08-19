import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  getGamesForToday,
  gamesWonLossDrawnToday,
  getMostRecentResult,
  getTimeInChessGamesToday,
  eloGainedToday,
} from "utils/chessUtils";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#6c9c40",
    color: theme.palette.common.white,
    fontSize: 13,
  },
  body: {
    fontSize: 11,
  },
  root: {
    padding: "0px 16px",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#6c9c4050",
    },
  },
}))(TableRow);

function createData(name, players, render = undefined) {
  return { name, players, render };
}

const useStyles = makeStyles({
  table: {},
  tableRow: { height: 10 },
  tableContainer: {},
});

const dataValues = {
  "Current Rapid ELO": {
    value: (player) => eloGainedToday(player),
    renderCell: (player, allPlayers) => {
      const currentElo = player.chess_rapid.last.rating;
      const eloGained = eloGainedToday(player);
      const isPositive = eloGained >= 0;

      const eloGainedString = ` ( ${isPositive ? "+" : "-"}${Math.abs(
        eloGained
      )})`;

      return (
        <StyledTableCell align="center">
          {currentElo}
          <div
            style={{ color: isPositive ? "green" : "red", display: "inline" }}
          >
            {eloGainedString}
          </div>
        </StyledTableCell>
      );
    },
  },
  "# of Games": {
    value: (player) => getGamesForToday(player.games).length,
    renderCell: (player, players) => {
      const numberOfGames = getGamesForToday(player.games).length;
      const bestNumberOfGames = Math.max(
        ...players.map((player) => getGamesForToday(player.games).length)
      );
      const isBest = numberOfGames === bestNumberOfGames;
      return (
        <StyledTableCell align="center">
          <div
            style={{ color: isBest ? "green" : undefined, display: "inline" }}
          >
            {numberOfGames}
          </div>
        </StyledTableCell>
      );
    },
  },
  "Most Recent Result": {
    value: (player) => getMostRecentResult(player),
    renderCell: (player, players) => {
      const mostRecentResult = getMostRecentResult(player);
      const drawConditions = ["insufficient", "stalemate", "unknown"];
      let resultColor;

      if (mostRecentResult === "win") {
        resultColor = "green";
      }
      else if (drawConditions.includes(mostRecentResult)) {
        resultColor = undefined;
      } else {
        resultColor = "red";
      }
      const isWin = mostRecentResult === "win";
      return (
        <StyledTableCell align="center">
          <div style={{ color: resultColor, display: "inline" }}>
            {mostRecentResult}
          </div>
        </StyledTableCell>
      );
    },
  },
  "Time Spent": {
    value: (player) => getTimeInChessGamesToday(player),
    renderCell: (player, players) => {
      const value = getTimeInChessGamesToday(player);

      return (
        <StyledTableCell align="center">
          <div style={{ color: "black", display: "inline" }}>
            {value}
          </div>
        </StyledTableCell>
      );
    },
  },
  "Wins/Losses/Draws": {
    renderCell: (player, players) => {
      const results = gamesWonLossDrawnToday(player);

      return (
        <StyledTableCell align="center">
          <div style={{ color: "green", display: "inline" }}>
            {results.wins}
          </div>
          <div style={{ display: "inline" }}>{" / "}</div>
          <div style={{ color: "red", display: "inline" }}>
            {`${results.losses}`}
          </div>
          <div style={{ display: "inline" }}>{" / "}</div>
          <div style={{ display: "inline" }}>{results.draws}</div>
        </StyledTableCell>
      );
    },
    comparator: undefined,
  },
};

const renderBestRows = (row) => {
  const { players, render } = row;

  return players.map((player) => render(player, players));
};

export default function CustomizedTables(props) {
  const { players } = props;

  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = [];

    const newHeaders = players.reduce(
      (playerValues, player) => [
        ...playerValues,
        player.name || player.username,
      ],
      []
    );
    setHeaders(newHeaders);

    for (const dataKey of Object.keys(dataValues)) {
      const value = dataValues[dataKey];
      newData.push(createData(dataKey, players, value.renderCell));
    }
    setData(newData);
  }, [players]);

  const classes = useStyles();

  return (
    <div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table
          align="center"
          className={classes.table}
          aria-label="customized table"
        >
          <TableHead>
            <StyledTableRow className={classes.tableRow}>
              <StyledTableCell>Metrics for Today</StyledTableCell>
              {headers.map((header) => (
                <StyledTableCell align="center">{header}</StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.name} className={classes.tableRow}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                {renderBestRows(row)}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
