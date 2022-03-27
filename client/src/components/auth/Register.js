import React, {useState, Fragment } from 'react'
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import setAlert from '../../actions/alert'
import {registerUser} from '../../actions/auth'
import propTypes from 'prop-types'
import {Form} from 'react-bootstrap'
import Spinner from '../layouts/Spinner.js'
import axios from 'axios'


const Register=(props)=>{
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

      const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)
        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
          const { data } = await axios.post('api/upload', formData, config)
          setImage(data)
          setUploading(false)
        } catch (error) {
          console.error(error)
          setUploading(false)
        }
      }

      const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
          props.setAlert('Passwords do not match','danger')
        } else {        
              props.registerUser(name,email,password,image)
              console.log('success')
        }
      }
       
      if (props.isAuthenticated) {
        return <Redirect to='/dashboard' />;
      }
       

    return (
        <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" action="create-profile.html" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
          
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            
            value={password2} onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        <Form.Group controlId='image'>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              
              <Form.Group controlId="formFile" className="mb-3">
             <Form.Control type="file"  onChange={uploadFileHandler}/>
              </Form.Group>
              {uploading && <Spinner />}
            </Form.Group>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
    )
}

Register.propTypes = {
  setAlert: propTypes.func.isRequired,
  registerUser: propTypes.func.isRequired,
  isAuthenticated: propTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{setAlert,registerUser})(Register)


/*
const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
      });

      const { name, email, password, password2 } = formData;

      const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
      
      const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)
    
        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
          const { data } = await axios.post('/api/upload', formData, config)
          setImage(data)
          setUploading(false)
        } catch (error) {
          console.error(error)
          setUploading(false)
        }
      }

      const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
          props.setAlert('Passwords do not match','danger')
        } else {        
              props.registerUser(name,email,password)
              console.log('success')
        }
      }
       
      if (props.isAuthenticated) {
        return <Redirect to='/dashboard' />;
      }
       

    return (
        <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" action="create-profile.html" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={e=>onChange(e)} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e=>onChange(e)} />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
          
            value={password} onChange={e=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            
            value={password2} onChange={e=>onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
    )
*/