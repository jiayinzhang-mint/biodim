import React from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Tabs, Tab, colors } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import Home from './Home';
import About from './About';

const theme = createMuiTheme({
  palette: {
    primary: { main: colors.teal[400] },
  },
});

const appStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #dddddd 30%, #ffffff 90%)',
    height: '100vh',
  },
});

export default function App() {
  const classes = appStyles();

  return (
    <div className={classes.root}>
      <Router>
        <ThemeProvider theme={theme}>
          <CenteredTabs></CenteredTabs>
        </ThemeProvider>
      </Router>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  tab: {
    fontWeight: 600,
  },
});

function CenteredTabs() {
  const tabList = [
    {
      label: 'HOME',
      to: '/',
    },
    {
      label: 'ABOUT',
      to: '/about',
    },
  ];

  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(history.location.pathname);

  const tabs = tabList.map((t) => {
    return <Tab className={classes.tab} value={t.to} label={t.label} key={t.label}></Tab>;
  });

  const handleChange = (_: React.ChangeEvent<{}>, newValue: string) => {
    history.push(newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor='primary' textColor='primary' centered>
        {tabs}
      </Tabs>

      <Switch>
        <Route exact path='/'>
          <Home></Home>
        </Route>
        <Route path='/about'>
          <About></About>
        </Route>
      </Switch>
    </div>
  );
}
