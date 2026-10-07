/**
 *  Loading block contains loading icon
 */
export default function LoadingBlock({ inline }) {
  return (
    <div className={inline ? 'loading-block-inline' : 'loading-block'}>
      <img
        src="/img/animated_loading_icon.gif"
        className="center-block loading-icon"
        alt="Loading"
      />
    </div>
  );
}
