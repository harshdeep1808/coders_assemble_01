import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const ReviewItem = ({
  review: { _id, text, name, avatar, user, date }
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <Link to={`/profile/${user}`}>
        <img className='round-img' src={avatar} alt='' />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className='my-1'>{text}</p>
      <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>
    </div>
  </div>
);

export default ReviewItem