import "./file-explorer-style.css";

function getChildList({ state, onSelectDir }) {
  return (
    <div className="list-group">
      <br />
      {state.children &&
        state.children.map((child, index) => {
          return (
            <div className="list-group-item">
              {child.isDir ? (
                <button
                  className="btn btn-light"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (child.isDir) {
                      await onSelectDir(index, child);
                    }
                  }}
                >
                  {child.children && child.children.length ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-arrow-down-short"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-arrow-right-short"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                      />
                    </svg>
                  )}
                </button>
              ) : (
                ""
              )}
              &nbsp; &nbsp;
              {child.dirName}
              {child.children && child.children.length
                ? getChildList({ state: child, onSelectDir })
                : ""}
            </div>
          );
        })}
    </div>
  );
}

const fileExplorerComponent = ({ state, onSelectDir, onAddressKeyPress }) => {
  return (
    <div className="margin">
      <h1>File Explorer</h1>
      <div>
        <div className="input-group mb-3">
          <input
            onKeyDown={onAddressKeyPress}
            placeholder="Type Directory path"
            type="text"
            className="form-control"
            aria-label=""
            aria-describedby="basic-addon1"
          />
        </div>
      </div>
      {getChildList({ state, onSelectDir })}
    </div>
  );
};

export default fileExplorerComponent;
