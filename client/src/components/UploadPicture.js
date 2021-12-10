import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import { getCroppedImg } from '../utils/imageProcessing';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// bootstrap components
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// stylesheets
import 'react-image-crop/dist/ReactCrop.css';
import '../styles/UploadPicture.css';

// redux action types
import { GET_ERRORS } from '../actions/types';

function UploadPicture({ auth }) {
  const dispatch = useDispatch();

  const [showCropTool, setShowCropTool] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({aspect:1/1});

  const toggleInputDisplay = () => {
    setShowCropTool(!showCropTool);
  };

  const handleInputChange = (e) => {
    setImgSrc(URL.createObjectURL(e.target.files[0]));
    toggleInputDisplay();
  };

  const handleImageUpload = async (e) => {
    // apply selected crop to original image uploaded
    const croppedImg = await getCroppedImg(image, crop);

    let data = new FormData();
    data.append('image', croppedImg);

    const config = {
      header: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    axios.put(`/api/users/${auth.user.username}/profile-picture`, data, config)
         .then((response) => {
            window.location.reload(true);
        }).catch((err) => {
            dispatch({
              type: GET_ERRORS,
              payload: err
            });
          });
  }
  
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as={"h2"}>Upload Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body as={'form'} 
                  encType="multipart/form-data" 
                  className="upload-form">
        {
          showCropTool
            ? <ReactCrop src={imgSrc} 
                         onImageLoaded={setImage} 
                         crop={crop} 
                         onChange={setCrop}
                         minHeight="100"
                         minWidth="100" />
            : <div className="form-input-wrapper">
                <Form.Control type="file" 
                              accept="image/*"
                              onChange={handleInputChange} />
              </div>
        }
      </Modal.Body>
      {
        showCropTool 
          && <Modal.Footer>
              <Button onClick={toggleInputDisplay}
                      variant="outline-primary">
                Cancel
              </Button>
              <Button onClick={handleImageUpload}>Save</Button>
             </Modal.Footer>
      }
    </>
  )
}

UploadPicture.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(UploadPicture);