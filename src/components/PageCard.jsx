import './PageCard.scss';

const PageCard = ({ title, children }) => {
  return (
    <div className="page-card">
      <div className="page-card-inner">
        <h2 className="page-card-title">{title}</h2>
        <div className="page-card-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageCard;