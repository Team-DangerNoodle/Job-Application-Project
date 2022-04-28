import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Paper, Box, Grid, Container, Avatar } from '@mui/material';
import Select from '@mui/material/Select';

function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  // const [category, setCategory] = useState([]);
  // const [jobType, setJobType] = useState([]);

  // need to access job categories and use as values in dropdown menu
  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const [formState, setFormState] = useState({});
  const handleFormStateChange = (e) => {
    const newState = { ...formState, [e.target.name]: e.target.value };
    setFormState(newState);
  };

  // const catChange = (e) => {
  //   setCategory(e.target.value);
  // };
  // const typeChange = (e) => {
  //   setJobType(e.target.value);
  // };

  function UserPreference() {
    const userId = localStorage.getItem('userId');
    const jobPreferenceUrl = `/api/applications/${userId}`;
    fetch(jobPreferenceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })
      .then((data) => data.json())
      .then((res) => {
        navigate('/dashboard');
      });
  }
  console.log(jobs);
  const categoryArr = [];
  const jobTypeArr = [];
  const jobTitleArr = [];
  const companyNameArr = [];
  for (let i = 0; i < jobs.length; i++) {
    const { category, company_name, job_type, title } = jobs[i];
    categoryArr.push(category);
    jobTypeArr.push(job_type);
    jobTitleArr.push(title);
    companyNameArr.push(company_name);
  }
  console.log('jobType:', jobTypeArr);
  console.log('category:', categoryArr);
  console.log('jobTitle:', jobTitleArr);
  console.log('companyName:', companyNameArr);

  // Need to have a way to iterate through all arrays and assign
  // a semantic value for the drop down menu
  return (
    <Container maxWidth='md' sx={{ mt: 5 }}>
      <Box
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#eeeeee',
          p: 2,
        }}
      >
        <FormControl fullWidth>
          <TextField
            id='title_search'
            name='title_search'
            label='Job Title'
            fullWidth
            variant='standard'
            helperText='Job Title'
            value={formState['title_search']}
            onChange={(e) => handleFormStateChange(e)}
          />
          <InputLabel id='job_category_select'></InputLabel>
          <Select
            labelId='job_category_select'
            id='job_category'
            name='job_category'
            value={formState['category']}
            label='category'
            onChange={(e) => handleFormStateChange(e)}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem value={formState['category']}>Software Engineer</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id='jobType_select'>Job Type</InputLabel>
          <Select
            labelId='jobType_select'
            id='jobType'
            value={formState['job_type']}
            label='jobType'
            onChange={(e) => handleFormStateChange(e)}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem value={['full_time']}>Full-Time</MenuItem>
            <MenuItem value={['contract']}>Contract</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' onClick={UserPreference}>
          Search
        </Button>
      </Box>
      <Grid container spacing={2}>
        {jobs.length !== 0 &&
          jobs.map((job) => {
            return (
              <Grid item xs={6} key={job.id}>
                <div className='job-card'>
                  <Paper elevation={5}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 2,
                      }}
                    >
                      <Avatar src={job.company_logo} />
                      <br></br>
                      {job.title}
                      <br></br>
                      {job.company_name}
                      <br></br>
                      <br></br>
                      {new Date(job.publication_date).toDateString()}
                      <br></br>
                      {job.category}
                      <br></br>
                      {job.job_type === 'full_time'
                        ? 'Full Time'
                        : job.job_type === 'part_time'
                        ? 'Part Time'
                        : job.job_type === 'contract'
                        ? 'Contract'
                        : 'Null'}
                      <br></br>
                      <Link
                        to='/applications'
                        state={{ ...job }}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant='outlined'>Start application</Button>
                      </Link>
                    </Box>
                  </Paper>
                </div>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
}

export default JobDashboard;
