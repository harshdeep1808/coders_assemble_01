import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getCodeforcesData } from '../../actions/profile';

const ProfileCodeforces = ({ username, getCodeforcesData, codeforces }) => {
  useEffect(() => {
      const getdata=async()=>{
        await getCodeforcesData(username);
      }
     getdata();
  }, [getCodeforcesData]);
  return (
        <>  
             <h1 className='text-primary my-1'>Codeforces Profile:{username}</h1>
            {typeof(codeforces) !== "object" ? (
         <>
           <p>Fetchin data please wait.....</p>
           <Spinner />
         </>       
      ) : (
           <>
             <br></br>
              <p>Rating:  {codeforces.rating}</p><br></br>
              <p>Rank:  {codeforces.rank}</p><br></br>
              <p>Contests attended:  {codeforces.contests.length}</p><br></br>
           </>
      )}
        </>
  );
};

ProfileCodeforces.propTypes = {
    getCodeforcesData: PropTypes.func.isRequired,
 // leetcode: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  codeforces: state.profile.codeforces
});

export default connect(
  mapStateToProps,
  { getCodeforcesData }
)(ProfileCodeforces);