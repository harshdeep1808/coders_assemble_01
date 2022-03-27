import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';
import axios from 'axios'
import setAlert from '../../actions/alert.js'
const ReviewForm = ({_id}) => {
  const [text, setText] = useState('');
  const addReview=async ()=>{
    try {
        const body=JSON.stringify({text})
    
    const config={
         headers:{
            'Content-Type':'application/json'
             }
        }
        const res = await axios.post(`/api/profile/review/${_id}`,body,config);
        window.location.reload()
      } catch (error) {
        console.log(error.msg)
             setAlert('Please Login to review','danger');
      }
  }
  return (
    <div className='post-form' >
      <div className='bg-primary p'>
        <h3 style={{color:"white"}}>Leave a review...</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          addReview();
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a review'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

export default ReviewForm;