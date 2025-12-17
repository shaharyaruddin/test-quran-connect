import slugify from "slugify";

const TabPane = ({ label, children, isActive }) => {
  const slug = slugify(label, { lower: true });

  return (
    <div
      className={`tab-pane fade ${isActive ? "show active" : ""}`}
      id={`v-${slug}`}
      role="tabpanel"
      aria-labelledby={`v-${slug}-tab`}
      tabIndex="0"
    >
      {children}
    </div>
  );
};

export default TabPane;
