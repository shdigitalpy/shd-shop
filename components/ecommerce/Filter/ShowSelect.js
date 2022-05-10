

function SelectOp({ selectChange, showLimit, translation }) {
    return (
        <>
            <div className="sort-by-product-wrap">
                <div className="sort-by">
                    <span>
                        <i className="fi-rs-apps"></i>
                        {translation}
                    </span>
                </div>
                <div className="sort-by-dropdown-wrap custom-select">
                    <select onChange={selectChange}>
                        <option value={showLimit}>{showLimit}</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>
                </div>
            </div>
        </>
    );
}
export default SelectOp;
