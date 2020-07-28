import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontWeight: 900,
    fontSize: 60,
  },
});

function About() {
  const classes = useStyles();

  return <div className={classes.root}>BIODIM</div>;
}

export default withRouter(About);
