import React, { useState } from 'react';
import { Button } from '@mui/material';
import Axios from 'axios';


function AddtoCalendarForm() {

    const addCalendarEvent = () => {
        const accessToken = localStorage.getItem("accessToken");
        console.log('accessToken: ', accessToken);
        Axios.post('/api/auth/calendar/addCalendarEvent', {
          accessToken, form
        })
          .then(function (response) {
            console.log("THIS1", response);
          })
          .catch(function (error) {
            console.log("THIS2",error);
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
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
   
    const handleClick = (e) => {
        e.preventDefault()
        console.log(form)
    }


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
            <form 
            // onSubmit={console.log('submitted')}
            >
                <label htmlFor='summary'>Summary</label>
                <br />
                <input
                    type='text'
                    id='summary'
                    // value={summary}
                    onChange={(e) => setForm({...form, summary: e.target.value})} /> 
                <br />
                <label htmlFor='description'>Description</label>
                <br />
                <textarea
                    id='description'
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})} />
                <br />
                <label htmlFor='location'>Location</label>
                <br />
                <input
                    type='text'
                    id='location'
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})} />
                <br />
                <label htmlFor='startDateTime'>Start Date Time</label>
                <br />
                <input
                    type='datetime-local'
                    id='startDateTime'
                    value={form.startDateTime}
                    onChange={(e) => setForm({...form, startDateTime: e.target.value})} />
                <br />
                <label htmlFor='endDateTime'>End Date Time</label>
                <br />
                <input
                    type='datetime-local'
                    id='endDateTime'
                    value={form.endDateTime}
                    onChange={(e) => setForm({...form, endDateTime: e.target.value})} />
                    <br />
                <Button onClick={addCalendarEvent} type='submit'>Submit</Button>
            </form>
        </div>
    )
}

export default AddtoCalendarForm;

// onSubmit={handleSubmit}

// const handleSummary = (e) => {
//     e.preventDefault()
//     setForm({summary: e.target.value})
//     console.log(form)
// }
// const handleDescription = (e) => {
//     e.preventDefault()
//     setForm({description: e.target.value})
//     console.log(form)
// }
// const handleLocation = (e) => {
//     e.preventDefault()
//     setForm({location: e.target.value})
//     console.log(form)
// }
// const handleStart = (e) => {
//     e.preventDefault()
//     setForm({startDateTime: e.target.value})
//     console.log(form)
// }
// const handleEnd = (e) => {
//     e.preventDefault()
//     setForm({endDateTime: e.target.value})
//     console.log(form)
// }