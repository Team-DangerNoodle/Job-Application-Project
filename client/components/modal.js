import * as React from 'react';
import AddtoCalendarForm from './AddtoCalendarForm';
import { Button, Box, Typography, Modal } from '@mui/material';

const CalModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const addCalendarEvent = () => {
    console.log('addCalendarEvent initialized')
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

  return (
    <div>
      <Button onClick={handleOpen}>Add to Calendar</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add to Google Calendar
          </Typography>
          <AddtoCalendarForm />
        </Box>
      </Modal>
    </div>
  );
}

export default CalModal

{/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
</Typography> */}
