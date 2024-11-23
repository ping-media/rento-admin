import React from "react";
import "../../App.css";

const ImageGallery = () => {
  const images = [
    "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", // Replace with your image URLs
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://gratisography.com/wp-content/uploads/2024/03/gratisography-funflower-800x525.jpg",
  ];

  return (
    <div className="image-gallery">
      {images.map((src, index) => (
        <div className="image-container" key={index}>
          <img src={src} alt={`Image ${index + 1}`} className="image" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
