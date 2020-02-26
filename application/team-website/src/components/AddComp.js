import React from 'react';

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      imagePreviewUrl: ""
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("handle uploading-", this.state.file);
  }

  handleImageChange(event) {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl}/>);
    } else {
      $imagePreview = (<div className="previewText">Please Select an image for preview</div>);
    }

    return (
      <div className="previeweComponent">
        <form onSubmit={(event) => this.handleSubmit(event)}>
          <input className="fileInput"
                 type="file"
                 onChange={(event) => this.handleImageChange(event)}/>
          <button className="submitButton"
                  type="submit"
                  onClick={(event) => this.handleSubmit(event)}>UploadImage
          </button>
        </form>
        <div className="imagePreview">
          {$imagePreview}
        </div>
      </div>
    )
  }
}
