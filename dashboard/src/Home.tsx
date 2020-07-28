import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Container,
  Card,
  Grid,
  makeStyles,
  TextField,
  InputAdornment,
  Button,
  CardContent,
  CardActions,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  Snackbar,
} from '@material-ui/core';
import { Play, Stop } from 'mdi-material-ui';
import axios from 'axios';

class Motor {
  id!: number;
  speed!: number;
  running!: boolean;
  direction!: number;
  distance!: number;
}

const motorList: Motor[] = [
  {
    id: 0,
    speed: 0,
    running: false,
    direction: 1,
    distance: 100,
  },
  {
    id: 1,
    speed: 0,
    running: false,
    direction: 1,
    distance: 100,
  },
  {
    id: 2,
    speed: 0,
    running: false,
    direction: 1,
    distance: 100,
  },
  {
    id: 3,
    speed: 0,
    running: false,
    direction: 1,
    distance: 100,
  },
  {
    id: 4,
    speed: 0,
    running: false,
    direction: 1,
    distance: 100,
  },
];

const useStyles = makeStyles({
  root: {
    paddingTop: 20,
  },
  card: {
    backdropFilter: 'saturate(180%) blur(20px)',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
  },
  cardTitle: {
    fontWeight: 900,
    marginBottom: 20,
  },
  cardActions: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  textField: {
    width: 230,
  },
});

function Home() {
  const classes = useStyles();

  // Snackbar
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState('Request succeeded');

  const handleChangeSpeed = (m: Motor) => (ev: React.ChangeEvent<HTMLInputElement>) => {
    const motor = motorList.find((i) => i.id === m.id);
    if (motor) motorList[motor.id].speed = Number(ev.target.value);
  };

  const handleChangeDirection = (m: Motor) => (ev: React.ChangeEvent<HTMLInputElement>) => {
    const motor = motorList.find((i) => i.id === m.id);
    if (motor) motorList[motor.id].direction = ev.target.checked ? -1 : 1;
  };

  const handleRunMotor = (m: Motor) => async (_: React.MouseEvent) => {
    try {
      await axios.post('/api/step/move', {
        ID: m.id,
        speed: m.speed,
        distance: m.distance,
        direction: m.direction,
      });
      setContent('Request succeeded');
      setOpen(true);
    } catch (err) {
      setContent('Request failed');
      console.error(err);
    }
  };

  const handleHaltMotor = (m: Motor) => async (_: React.MouseEvent) => {
    try {
      await axios.post('/api/step/halt', {
        ID: m.id,
      });
      setContent('Request succeeded');
      setOpen(true);
    } catch (err) {
      setContent('Request failed');
      console.error(err);
    }
  };

  return (
    <Container className={classes.root}>
      <Grid container spacing={2}>
        {motorList.map((m) => (
          <Grid item xs={4} key={m.id}>
            <Card variant='outlined' className={classes.card}>
              <CardContent>
                <Typography gutterBottom className={classes.cardTitle}>
                  Motor #{m.id}
                </Typography>
                <form>
                  <TextField
                    className={classes.textField}
                    label='Speed'
                    defaultValue={m.speed}
                    onChange={handleChangeSpeed(m)}
                    size='small'
                    type='number'
                    variant='outlined'
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>RPM</InputAdornment>,
                    }}
                  ></TextField>
                  <FormControl>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox defaultChecked={m.direction === -1} onChange={handleChangeDirection(m)} color='primary' />} label='Reverse' labelPlacement='start' />
                    </FormGroup>
                  </FormControl>

                  <TextField
                    className={classes.textField}
                    style={{ marginTop: 20 }}
                    label='Max distance'
                    defaultValue={m.distance}
                    disabled
                    size='small'
                    type='number'
                    variant='outlined'
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>mm</InputAdornment>,
                    }}
                  ></TextField>
                </form>
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Button onClick={handleRunMotor(m)} variant='outlined' color='primary' startIcon={<Play />}>
                  Run
                </Button>
                <Button onClick={handleHaltMotor(m)} variant='outlined' startIcon={<Stop />}>
                  Halt
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        autoHideDuration={2000}
        message={content}
      />
    </Container>
  );
}

export default withRouter(Home);
