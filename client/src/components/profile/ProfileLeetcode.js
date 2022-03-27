import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getLeetcodeData } from '../../actions/profile';
import {Table,ProgressBar} from 'react-bootstrap'
const ProfileLeetcode = ({ username, getLeetcodeData, leetcode }) => {
  useEffect(() => {
      getLeetcodeData(username);
  }, [getLeetcodeData]);
  return (
        <>
             <h1 className='text-primary my-1'>Leetcode Profile:- {username}</h1><br></br>
            {typeof(leetcode) !== "object" ? (
        <Spinner />
      ) : (
           <>
                <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Difficulty</th>
      <th>Solved</th>
      <th>Total Questions</th>
      <th>% Solved</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Total</td>
      <td>{leetcode.totalSolved}</td>
      <td>{leetcode.totalQuestions}</td>
      <td colSpan={3}>{`${(leetcode.totalSolved/leetcode.totalQuestions*100).toFixed(2)}%`}<ProgressBar now={leetcode.totalSolved/leetcode.totalQuestions*100} variant="info"  /></td>
    </tr>
    <tr>
      <td>2</td>
      <td>Easy</td>
      <td>{leetcode.easySolved}</td>
      <td>{leetcode.totalEasy}</td>
      <td colSpan={3}>{`${(leetcode.easySolved/leetcode.totalEasy*100).toFixed(2)}%`}<ProgressBar now={leetcode.easySolved/leetcode.totalEasy*100} variant="success"  /></td>
    </tr>
    <tr>
      <td>3</td>
      <td>Medium</td>
      <td>{leetcode.mediumSolved}</td>
      <td>{leetcode.totalMedium}</td>
      <td colSpan={3}>{`${(leetcode.mediumSolved/leetcode.totalMedium*100).toFixed(2)}%`}<ProgressBar now={leetcode.mediumSolved/leetcode.totalMedium*100} variant="warning"  /></td>
    </tr>
    <tr>
      <td>4</td>
      <td>Hard</td>
      <td>{leetcode.hardSolved}</td>
      <td>{leetcode.totalHard}</td>
      <td colSpan={3}>{`${(leetcode.hardSolved/leetcode.totalHard*100).toFixed(2)}%`}<ProgressBar now={leetcode.hardSolved/leetcode.totalHard*100} variant="danger"  /></td>
    </tr>
  </tbody>
</Table> <br></br>
 <div> <h3>Acceptance Rate:</h3> <ProgressBar now={leetcode.acceptanceRate} variant="success" label={`${leetcode.acceptanceRate}%`} /></div><br></br>
<div> <h3>Ranking:</h3> ~{leetcode.ranking}</div><br></br>
<div> <h3>Reputation:</h3> {leetcode.reputation} &#9733;</div><br></br>
           </>
      )}
        </>
  );
};

ProfileLeetcode.propTypes = {
  getLeetcodeData: PropTypes.func.isRequired,
 // leetcode: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  leetcode: state.profile.leetcode
});

export default connect(
  mapStateToProps,
  { getLeetcodeData }
)(ProfileLeetcode);