import React from "react";
const { useEffect } = React;
const Products = ({openModal, INITIAL_PRODUCT_DATA, products, getProducts, isAuth}) => {

  useEffect(()=>{
    (async()=>{
      //只有在驗證過才會取得產品列表
      if(isAuth){await getProducts();}
    })()
  },[isAuth])

    return(
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" 
              // data-bs-toggle="modal" data-bs-target="#productModal" 
              onClick={()=>{              
                openModal("create",INITIAL_PRODUCT_DATA);
              }}>建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                
                  {products.map((item)=>{
                    return(
                      <tr key={item.id}>
                          <td>{item.category}</td>
                          <td>{item.title}</td>
                          <td className="text-end">{item.origin_price}</td>
                          <td className="text-end">{item.price}</td>
                          <td>
                            {item.is_enabled ?<span className="text-success">啟用</span>:<span>未啟用</span>}
                          </td>
                          <td>
                            <div className="btn-group">
                              <button type="button" className="btn btn-outline-primary btn-sm" 
                              // data-bs-toggle="modal" data-bs-target="#productModal" 
                              onClick={()=>{
                                openModal("edit",item);
                              }}>
                                編輯
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{
                                openModal("delete",item);
                              }}>
                                刪除
                              </button>
                            </div>
                          </td>
                        </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
    )
}

export default Products;