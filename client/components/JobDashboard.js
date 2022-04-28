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
import { flexbox } from '@mui/system';

function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [formState, setFormState] = useState({
    title: '',
    category: '',
  });
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  // need to access job categories and use as values in dropdown menu
  useEffect(() => {
    // conditional checking if user has saved preferences

    // else
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const buttonClick = () => {
    fetch('api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formState),
    })
      .then((res) => res.json())
      .then((data) => {
      console.log(data)
      setJobs(data)});
  };

  return (
    <Container maxWidth='md' sx={{ mt: 5 }}>
      <Box
        sx={{
          width: '100%',
          height: '40%',
          display: 'flex',
          flexDirection: 'column',
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
            // value={title_search}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id='job_category_select'>Job Category</InputLabel>
          <Select
            labelId='job_category_select'
            id='job_category'
            name='job_category'
            label='category'
            value={formState.category}
            onChange={(e) =>
              setFormState({ ...formState, category: e.target.value })
            }
          >
            <MenuItem value='None'>
              <em>None</em>
            </MenuItem>
            <MenuItem value='software-dev'>Software Engineer</MenuItem>
            <MenuItem value='customer-support'>Customer Support</MenuItem>
            <MenuItem value='design'>Design</MenuItem>
            <MenuItem value='marketing'>Marketing</MenuItem>
            <MenuItem value='sales'>Sales</MenuItem>
            <MenuItem value='product'>Product Design</MenuItem>
            <MenuItem value='business'>Business</MenuItem>
            <MenuItem value='data'>Data</MenuItem>
            <MenuItem value='devops'>DevOps</MenuItem>
            <MenuItem value='finance-legal'>Finance Legal</MenuItem>
            <MenuItem value='hr'>HR</MenuItem>
            <MenuItem value='qa'>QA</MenuItem>
            <MenuItem value='writing'>Writing</MenuItem>
            <MenuItem value='all-others'>Other</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' onClick={buttonClick}>
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

// const handleFormStateChange = (e) => {
//   const newState = { ...formState, [e.target.name]: e.target.value };
//   setFormState(newState);
// };

// const titleChange = (e) => {
//   formInfo['title'] = e.target.value;
//   console.log(formInfo);
// };

// const catChange = (e) => {
//   formInfo['category'] = e.target.value;
//   console.log(formInfo);
// };

// const typeChange = (e) => {
//   formInfo['jobtype'] = e.target.value;
//   console.log(formInfo);
// };

// function UserPreference() {
//   const userId = localStorage.getItem('userId');
//   const jobPreferenceUrl = `/api/applications/${userId}`;
//   fetch(jobPreferenceUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(formInfo),
//   })
//     .then((data) => data.json())
//     .then((res) => {
//       navigate('/dashboard');
//     });
// }

// const [formState, setFormState] = useState({
// });

// const handleFormStateChange = (e) => {
//   const newState = { ...formState, [e.target.name]: e.target.value };
//   setFormState(newState);
// };

// console.log(jobs);
// const categoryArr = [];
// const jobTypeArr = [];
// const jobTitleArr = [];
// const companyNameArr = [];
// for (let i = 0; i < jobs.length; i++) {
//   const { category, company_name, job_type, title } = jobs[i];
//   categoryArr.push(category);
//   jobTypeArr.push(job_type);
//   jobTitleArr.push(title);
//   companyNameArr.push(company_name);
// }
// console.log('jobType:', jobTypeArr);
// console.log('category:', categoryArr);
// console.log('jobTitle:', jobTitleArr);
// console.log('companyName:', companyNameArr);

//  <FormControl fullWidth>
//    <InputLabel id='jobType_select'>Job Type</InputLabel>
//    <Select
//      labelId='jobType_select'
//      id='jobType'
//      value={formInfo['jobtype']}
//      label='jobType'
//      onChange={(e) => setFormState({ ...formState, jobtype: e.target.value })}
//    >
//      <MenuItem value=''>
//        <em>None</em>
//      </MenuItem>
//      <MenuItem value={'full_time'}>Full-Time</MenuItem>
//      <MenuItem value={'contract'}>Contract</MenuItem>
//    </Select>
//  </FormControl>;
