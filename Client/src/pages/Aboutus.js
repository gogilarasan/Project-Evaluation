// AboutUs.js
import React from 'react';
import './Aboutus.css';

const AboutUs = () => {
  const images = [
    {
      src: "/images/Images/imgf4.gif",
      alt: "Image 1",
    },
  ];
  const image = [
    {
      src: "/images/Images/Mobile login.gif",
      alt: "Image 2",
    },
  ];
  const imag1 = [
    {
      src: "/images/Images/imgf1.jpg",
      alt: "Image 2",
    },
  ];
  const imag2 = [
    {
      src: "/images/Images/imgf5.jpg",
      alt: "Image 2",
    },
  ];

  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h2>Discover Our Vision</h2>
        <div className="icon-container">
          <i className="fas fa-graduation-cap"></i>
          <i className="fas fa-laptop-code"></i>
          <i className="fas fa-users"></i>
        </div>
      </div>

      <div className="about-us-content1">
        {images.map((image, index) => (
          <div className="about-container" key={index}>
            <div className="about-image">
              <img src={image.src} alt={image.alt} className="about-image-shape" />
            </div>
            <div className="about-content">
              <p><span>Our Mission:</span>  <br/> At DIST, our mission is to provide a seamless and transparent approach to project evaluation for college students.<br/>  We aim to revolutionize the project evaluation process, enabling students to view their marks and parameters while fostering a culture of innovation and learning.</p>
            </div>
          </div>
        ))}
      </div>
      <div className="about-us-content2">
        {image.map((image, index) => (
          <div className="about-container" key={index}>
            <div className="about-content">
              <p>At our core, we believe in empowering students to take charge of their learning and showcase their skills through practical projects.<br/>  We understand the importance of evaluation and feedback in the educational process, which is why we have created a comprehensive framework that allows for fair and accurate assessments.</p>
            </div>
            <div className="about-image">
              <img src={image.src} alt={image.alt} className="about-image-shape" />
            </div>
          </div>
        ))}
      </div>
      <div className="about-us-content3">
        {imag1.map((image, index) => (
          <div className="about-container" key={index}>
            <div className="about-image">
              <img src={image.src} alt={image.alt} className="about-image-shape" />
            </div>
            <div className="about-content">
              <p> <span>What We Offer:</span><br/>  Our platform offers a range of features designed to enhance the project evaluation experience. <br/> Students can effortlessly access their marks and detailed feedback from all three reviews.<br/>  With customizable parameters, students can understand how their projects are evaluated and take control of their learning journey. Moreover, circulars, instructions, and updates are easily accessible, ensuring students stay informed.</p>
            </div>
          </div>
        ))}
      </div>
      <div className="about-us-content4">
        {imag2.map((image, index) => (
          <div className="about-container" key={index}>
            <div className="about-content">
              <p> <span>Features:</span><br/> <span>Transparent Evaluation:</span> Easily view marks and parameters for each review.<br/><span>Efficiency:</span>  Automated evaluation replaces the traditional pen-and-paper approach.<br/><span> Customizable Parameters:</span>  Understand the evaluation process with clear, customizable criteria.<br/> <span>Seamless Communication:</span>  Staff can contact students via email, fostering collaboration and support.</p>
            </div>
            <div className="about-image">
              <img src={image.src} alt={image.alt} className="about-image-shape" />
            </div>
          </div>
        ))}
      </div>
      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-envelope logo"></i>
            <div className="contact-text">
              <p>Mail: <a href="mailto:istdept@auist.net" className="email-button">
                <button>Contact</button>
              </a></p>
            </div>
          </div>
        </div>
      </div>
      <footer className="about-us-footer">
        <p>&copy; 2023 Student Result Management. All rights reserved.</p>
        <i className="fas fa-university footer-logo"></i>
      </footer>
    </div>
  );
};

export default AboutUs;
