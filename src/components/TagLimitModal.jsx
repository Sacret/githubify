import { MAX_TAGS } from '../tags';

/**
 *  Modal with message about tags limit
 */
export default function TagLimitModal({ onHide }) {
  return (
    <>
      <div className="modal show" role="dialog" onClick={onHide}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-label="Close" onClick={onHide}>
                &times;
              </button>
              <h4 className="modal-title">Oops...</h4>
            </div>
            <div className="modal-body">
              <p>Unfortunately, you can't add more than {MAX_TAGS} tags.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={onHide}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop in" />
    </>
  );
}
