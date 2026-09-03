import './CircularText.css';

const CircularText = ({
  text = 'Lorem ipsum • ',
  spinDuration = 20,
  onHover = 'slowDown',
  className = '',
}) => {
  const letters = Array.from(text);

  return (
    <div
      className={`circular-text ${onHover === 'pause' ? 'pause-on-hover' : 'slow-on-hover'} ${className}`}
    >
      <svg
        className="circular-text-svg"
        viewBox="0 0 200 200"
        style={{ animationDuration: `${spinDuration}s` }}
      >
        <defs>
          <path
            id="circlePath"
            d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
          />
        </defs>
        <text className="circular-text-content">
          <textPath href="#circlePath">
            {letters.map((letter, index) => (
              <tspan key={index}>{letter}</tspan>
            ))}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularText;
