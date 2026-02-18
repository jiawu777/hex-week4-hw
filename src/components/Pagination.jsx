const Pagination = ({ pagination,changePage }) => {
    const { current_page, total_pages, has_pre, has_next } = pagination;
    
    const handleClick=(e,page)=>{
    //預防預設行為，因為a標籤會導致頁面重新整理
    e.preventDefault();
    //重新載入指定頁數頁面
    changePage(page);
    }

    return(
        <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
            <li className="page-item">
            {/* 沒有前一頁就不能點擊 */}
            <a className={`page-link ${has_pre? '':'disabled'}`} 
            href="/" aria-label="Previous" onClick={(e)=>handleClick(e,current_page-1)}>
                <span aria-hidden="true">&laquo;</span>
            </a>
            </li>
            {Array.from({length: total_pages}, (_, i) => (
                <li key={i} className="page-item">
                    {/* i+1是因為頁碼從1開始，陣列索引從0開始，才是當前頁碼 */}
                    <a className={`page-link ${current_page === i+1 ? 'active':''}`} href="/" onClick={(e)=>handleClick(e,i+1)}>{i+1}</a>
                </li>
            ))}
            <li className="page-item">
            {/* 沒有後一頁就不能點擊 */}
            <a className={`page-link ${has_next? '':'disabled'}`} href="/" aria-label="Next" onClick={(e)=>handleClick(e,current_page+1)}>
                <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
        </nav>
    )
}

export default Pagination;