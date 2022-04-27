import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';
import { clientLogin } from '../actions/actions';

const theme = createTheme();

function SignIn(props) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const CLIENT_ID =
    '88796443278-tm040jrfovse910ssio41o6hd26m5nk8.apps.googleusercontent.com';

  const login = () => {
    console.log(username, password);
    Axios.post('/api/auth/login', {
      username,
      password,
    })
      .then((data) => {
        props.clientLogin();
        localStorage.setItem('userId', data.data);
        navigate('/dashboard');
      })
      .catch((err) => setError(err.message));
  };

  const responseGoogle = (response) => {
    console.log("oauth response", response)
    const googleId = response.profileObj.googleId;
    const gmail = response.profileObj.email;
    const { accessToken } = response
    localStorage.setItem('accessToken', accessToken);

    Axios.post('/api/auth/oauth', {
      gmail,
      googleId,
    })
      .then((data) => {
        props.clientLogin();
        localStorage.setItem('userId', data.data);
        navigate('/dashboard');
      })
      .catch((err) => setError(err));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          {error}
          <Box component='form' noValidate sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText='Login with your Google Account'
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              scope = 'openid email profile https://www.googleapis.com/auth/calendar'
            />
            <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/signup' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = ({ loginStatus }) => {
  return loginStatus;
};

export default connect(mapStateToProps, { clientLogin })(SignIn);
