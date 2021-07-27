import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { getGamesForToday, gamesWonLossDrawnToday, eloGainedToday } from "utils/chessUtils";

const dataValues = {
  "Current Rapid ELO": {
    getValue: player => player.chess_rapid.last.rating,
    comparator: Math.max,
  },
  "Number of games": {
    getValue: player => getGamesForToday(player.games).length,
    comparator: Math.max,
  },
  "ELO gained": {
    getValue: (player) => eloGainedToday(player.username, player.games),
    comparator: Math.max,
  },
  "Wins/Losses/Draws": {
    getValue: (player) => {
      const results = gamesWonLossDrawnToday(player.username, player.games);
      return `${results.wins} / ${results.losses} / ${results.draws}`;
    },
    comparator: undefined,
  },
};


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "gray",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, values, comparator=undefined) {
  return { name, values, comparator };
}

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

const renderBestRows = (row) => {
  const { values, comparator } = row;
  const bestScore = comparator ? comparator(...values) : undefined; 
  const getColor = (value) => {
    if(comparator) {
      return value === bestScore ? "green" : "red";
    } 
  }
  return values.map((value) => <StyledTableCell align="center" style={{ color: getColor(value)}}>{value}</StyledTableCell>);
};

export default function CustomizedTables(props) {
  const { players } = props;

  const [ headers, setHeaders ] = useState([]);
  const [ data, setData ] = useState([]);

  useEffect(() => {
    const newData = [];

    const newHeaders = players.reduce((playerValues, player) => [...playerValues, player.name || player.username], []);
    setHeaders(newHeaders);

    for (const dataKey of Object.keys(dataValues)) {
      const value = dataValues[dataKey];
      const values = players.reduce((playerValues, player) => [...playerValues, value.getValue(player)], []);
      newData.push(createData(dataKey, values, value.comparator));
    }
    setData(newData);
  }, [players]);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Metric for Today</StyledTableCell>
            {
              headers.map(header => (<StyledTableCell align="center">{header}</StyledTableCell>)) 
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              {renderBestRows(row)}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
     );
}