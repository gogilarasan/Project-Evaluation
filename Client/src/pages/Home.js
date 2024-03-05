import React, { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    {
      src: "/images/Images/circle1.jpg",
      alt: "Image 1",
      description: "Students celebrating their achievements.",
    },
    {
      src: "/images/Images/circle2.jpg",
      alt: "Image 2",
      description: "Academic excellence and success.",
    },
    {
      src: "/images/Images/circle3.jpg",
      alt: "Image 3",
      description: "A diverse and inclusive learning environment.",
    },
  ];

  const handleNextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length);
  };

  return (
    <div className="home-container">
      <header>
        <i className="fas fa-school logo"></i>
        <h1 className="home-title">Student Result Forum</h1>
      </header>
      <div className="content-container">
        <div className="content-background"></div>
         <div className="image-container">
          <div className="oval-images">
            <div className="oval-buttons left">
              <button onClick={handlePrevImage} className="nav-button">
                {'<'}
              </button>
            </div>
            <img
              key={currentImage}
              className={`oval-image active`}
              src={images[currentImage].src}
              alt={images[currentImage].alt}
            />
            <div className="oval-buttons right">
              <button onClick={handleNextImage} className="nav-button">
                {'>'}
              </button>
            </div>
          </div>
          <div className="navigation-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentImage === index ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
              ></span>
            ))}
          </div>
          <div className="image-description">
            <p>{images[currentImage].description}</p>
          </div>
        </div>
        <div className="website-info-container">
            <div className="website-info">
              <h1 className="info-heading">Welcome to Student Result Forum</h1>
              <p className="info-content">
                Empowering students, we evaluate <span className="larger-text">Information Science and Technology</span> projects transparently and efficiently.
              </p>
            </div>
        </div>
      </div>
      <div className="contentSer">
          <h2>What we do</h2>
          <p>With a focus on empowerment and learning, we encourage students to take charge of their education by showcasing their practical 
            skills through projects. Our comprehensive framework ensures fair and accurate assessments, enhancing the educational experience.</p>
            <div className="get-started-button">
               <Link to="/login" className="btn btn--outline">
                 Get Started <i className="fas fa-arrow-right"></i>
               </Link>
            </div>
      </div>
      <div className="services-content">
        <ul className="services-list">
          <li className="service-item">
            <i className="fas fa-graduation-cap service-icon"></i>
            <h3>Project Evaluation</h3>
            <p>
              We offer comprehensive project evaluation services to assess students' performance
              and provide valuable feedback for their academic growth.
            </p>
          </li>
          <li className="service-item">
            <i className="fas fa-chart-bar service-icon"></i>
            <h3>Pictorial Analysis</h3>
            <p>
              Our platform provides pictorial analysis of student performance, making it easier to
              identify strengths and areas that need improvement.
            </p>
          </li>
          <li className="service-item">
            <i className="fas fa-database service-icon"></i>
            <h3>Data Availability</h3>
            <p>
              Access student data anytime and anywhere, ensuring seamless monitoring and decision-making.
            </p>
          </li>
          <li className="service-item">
            <i className="fas fa-stopwatch service-icon"></i>
            <h3>Timely Evaluation</h3>
            <p>
              Enjoy the benefits of online evaluation, enabling quick and efficient assessment of results.
            </p>
          </li>
          
        </ul>
      </div>

      <footer>
        <p>&copy; 2023 Student Result Management. All rights reserved.</p>
        <i className="fas fa-university footer-logo"></i>
      </footer>
    </div>
  );
};

export default Home;