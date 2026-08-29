import React from 'react';

export default function Rating(props) {
  const ratingValue = props.value || 0;
  return (
    <div className="rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ color: '#f59e0b', fontSize: '1.45rem', display: 'flex', gap: '2px' }}>
        <span>
          <i
            className={
              ratingValue >= 1
                ? 'fa fa-star'
                : ratingValue >= 0.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              ratingValue >= 2
                ? 'fa fa-star'
                : ratingValue >= 1.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              ratingValue >= 3
                ? 'fa fa-star'
                : ratingValue >= 2.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              ratingValue >= 4
                ? 'fa fa-star'
                : ratingValue >= 3.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              ratingValue >= 5
                ? 'fa fa-star'
                : ratingValue >= 4.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
      </div>
      {props.text && (
        <span style={{ fontSize: '1.3rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
          {props.text}
        </span>
      )}
    </div>
  );
}
