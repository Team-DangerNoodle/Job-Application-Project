import React, { useState } from 'react';
import { Button } from '@mui/material';
import Axios from 'axios';


function AddtoCalendarForm() {

    const addCalendarEvent = () => {
        const accessToken = localStorage.getItem("accessToken");
        console.log('accessToken: ', accessToken);
        Axios.post('/api/auth/calendar/addCalendarEvent', {
          accessToken
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    
        console.log('addCalendarEvent function completed');
      }

    const [form, setForm] = useState({
        summary: '',
        description: '',
        location: '', 
        startDateTime: '', 
        endDateTime: ''
    })
    // const [summary, setSummary] = useState('');
    // const [description, setDescription] = useState('');
    // const [location, setLocation] = useState('');
    // const [startDateTime, setStartDateTime] = useState('');
    // const [endDateTime, setEndDateTime] = useState('');

    const handleSummary = (e) => {
        e.preventDefault()
        setForm({summary: e.target.value})
        console.log(form)
    }
    const handleDescription = (e) => {
        e.preventDefault()
        setForm({description: e.target.value})
        console.log(form)
    }
    const handleLocation = (e) => {
        e.preventDefault()
        setForm({location: e.target.value})
        console.log(form)
    }
    const handleStart = (e) => {
        e.preventDefault()
        setForm({startDateTime: e.target.value})
        console.log(form)
    }
    const handleEnd = (e) => {
        e.preventDefault()
        setForm({endDateTime: e.target.value})
        console.log(form)
    }

    return (
        <div>
            <form onSubmit={console.log('submitted')}>
                <label htmlFor='summary'>Summary</label>
                <br />
                <input
                    type='text'
                    id='summary'
                    value={form.summary}
                    onChange={(e) => handleSummary(e)} /> 
                <br />
                <label htmlFor='description'>Description</label>
                <br />
                <textarea
                    id='description'
                    value={form.description}
                    onChange={handleDescription} />
                <br />
                <label htmlFor='location'>Location</label>
                <br />
                <input
                    type='text'
                    id='location'
                    value={form.location}
                    onChange={handleLocation} />
                <br />
                <label htmlFor='startDateTime'>Start Date Time</label>
                <br />
                <input
                    type='datetime-local'
                    id='startDateTime'
                    value={form.startDateTime}
                    onChange={handleStart} />
                <br />
                <label htmlFor='endDateTime'>End Date Time</label>
                <br />
                <input
                    type='datetime-local'
                    id='endDateTime'
                    value={form.endDateTime}
                    onChange={handleEnd} />
                    <br />
                <Button type='submit'>Submit</Button>
            </form>
        </div>
    )
}

export default AddtoCalendarForm;

// onSubmit={handleSubmit}