import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import ReviewItem from '../reviews/ReviewItem.js';
import ReviewForm from '../reviews/ReviewForm.js';

const ProfileReviews = ({
    id, 
    profile:{
       reviews
    }
 }) => {

  return  (
    <Fragment>
      <h1 className='large text-primary'>Reviews</h1> <br></br>
      <ReviewForm _id={id} />
      <br></br>
      <div className='posts'>
        {reviews.length>0?(reviews.map(review => (
          <ReviewItem key={review._id} review={review} />
        ))):(
            <>
            <h3>No reviews yet</h3>
            </>
        )}
      </div>
    </Fragment>
  );
};

export default ProfileReviews;