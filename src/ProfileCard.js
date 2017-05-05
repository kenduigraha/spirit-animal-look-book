import React, { Component, PropTypes } from 'react';
import FileInput from 'react-file-input';
import { storage, database } from './firebase';
import './ProfileCard.css';

class ProfileCard extends Component {
  constructor(props) {
    super(props);

    this._handleSubmitUploadImage = this._handleSubmitUploadImage.bind(this)
    this.storageRef = storage.ref('user-images').child(props.uid)
    this.userRef = database.ref('/users').child(props.uid)
  }
  
  _handleSubmitUploadImage(e) {
    // console.log(e.target.files[0])
    const fileUpload = e.target.files[0]

    const uploadTask = this.storageRef
                           .child(fileUpload.name)
                           .put(fileUpload, {
                             contentType: fileUpload.type
                           })
    uploadTask.then(snapshot => {
      console.log(snapshot)

      this.userRef
          .child('photoURL')
          .set(snapshot.downloadURL)
    })

  }

  render() {
    const { user, uid } = this.props
    // console.log(user)
    return (
      <article className="ProfileCard">
        <img
          className="ProfileCard--Photo"
          src={ user.photoURL }
        />

        <h3>
          { user.displayName }
        </h3>

        <h4>
          { user.email }
        </h4>

        <FileInput
          accept=".png,.jpg,.gif,.jpeg"
          placeholder=""
          onChange={ this._handleSubmitUploadImage }
        />
      </article>
    );
  }
}

ProfileCard.propTypes = {
  displayName: PropTypes.string,
  email: PropTypes.string,
  imageName: PropTypes.string,
  imageURL: PropTypes.string,
  photoURL: PropTypes.string,
  uid: PropTypes.string
};

export default ProfileCard;
