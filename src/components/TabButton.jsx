import slugify from "slugify"; 

const TabButton = ({ label, imgSrc, altText, isActive,onClick }) => {
  const slug = slugify(label, { lower: true }); 
  return (
    <button
      className={`nav-link ${isActive ? "active" : ""}`}
      id={`v-${slug}-tab`}
      data-bs-toggle="pill"
      data-bs-target={`#v-${slug}`}
      type="button"
      role="tab"
      aria-controls={`v-${slug}`}
      aria-selected={isActive ? "true" : "false"}
      onClick={onClick}
    >
      <img src={imgSrc} className="img-fluid" alt={altText} />
      <h4>{label}</h4>
    </button>
  );
};

export default TabButton;
