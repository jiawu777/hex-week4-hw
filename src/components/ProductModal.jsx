import axios from "axios";
import React from "react";
const{useEffect}=React;

const ProductModal =({API_BASE,API_PATH,modalType,templateProduct,closeModal,getProducts,productModalRef,handleFileChange,pagination})=>{
const defaultImageUrl="https://storage.googleapis.com/vue-course-api.appspot.com/jia-hex/1770819402945.jpg";
const {current_page = 1} = pagination;
const [tempData,setTempData] = React.useState(templateProduct);
  useEffect(()=>{
    setTempData(templateProduct);
  },[templateProduct])


  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
      setTempData((prevData) => ({
      ...prevData,
      //id需判別為Number、checkbox或文字，以符合API需求
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateProduct= async(id)=>{
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";
    if(modalType==="edit"){
      method="put";
      url=`${API_BASE}/api/${API_PATH}/admin/product/${id}`;
    }

    const productData = {
      data:{
        ...tempData,
        origin_price: Number(tempData.origin_price),
        price: Number(tempData.price),
        is_enabled: tempData.is_enabled ? 1 : 0,
        imagesUrl: tempData.imagesUrl.filter((url)=>url.trim()!=="") //過濾掉空字串的圖片網址
      }
    }

    try{
      await axios[method](url,productData);
      if(modalType==="create"){
        alert(`${tempData.title}新增成功`);
      }else{
        alert(`${tempData.title}更新成功`);
      }
      await getProducts(current_page);
    }catch(err){
      console.log(err.response.data.message);
    }
  }

  const deleteProduct = async(id)=>{
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      alert("刪除成功");
      await getProducts(current_page);
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  const handleImageCreate=()=>{
    if(!tempData.imageUrl.trim()) return;
    const newImagesUrl = [...tempData.imagesUrl];
    newImagesUrl.unshift(tempData.imageUrl);
    setTempData({...tempData, imagesUrl: newImagesUrl})
  }

  const handleImageChange=(e,index)=>{
      const newImagesUrl = [...tempData.imagesUrl];
      newImagesUrl[index]=e.target.value;
      setTempData({...tempData, imagesUrl: newImagesUrl});
  }

  const handleImageDelete=(index)=>{
    const newImagesUrl = [...tempData.imagesUrl];
    newImagesUrl.splice(index,1);
    setTempData({...tempData, imagesUrl: newImagesUrl});
  }

    return(
        <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        ref={productModalRef}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content border-0">
              <div className={`modal-header ${modalType==="create"?"bg-primary":modalType==="edit"?"bg-success":"bg-danger"} text-white`}>
                <h5 id="productModalLabel" className="modal-title">
                  <span>{modalType==="create"?"新增":modalType==="edit"?"編輯":"刪除"}產品</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={()=>closeModal()}
                  aria-label="Close"
                  ></button>
              </div>
              <div className="modal-body">
                {modalType==="delete"? (
                    <p className="fs-4">
                      確定要刪除
                      <span className="text-danger">{tempData.title}</span>嗎？
                    </p>
                        ):
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div>
                        <label htmlFor="fileInput" className="form-label">
                          圖片上傳
                        </label>
                        <input
                          id="fileInput"
                          name="fileInput"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          onChange={handleFileChange}
                          />
                      </div>
                      <div>
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          id="imageUrl"
                          name="imageUrl"
                          type="text"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          onChange={handleModalInputChange}
                          value={tempData.imageUrl}
                          required
                          autoFocus
                          />
                      </div>
                      <img className="img-fluid rounded" src={tempData.imageUrl || defaultImageUrl} alt="無法取得商品圖片" />
                      <div>
                        <button className="btn btn-outline-primary btn-sm d-block w-100" 
                          onClick={()=>{
                            handleImageCreate();
                            setTempData((pre)=>({...pre,imageUrl:""}));
                          }}>
                            新增圖片
                        </button>
                      </div>
                    </div>
                  
                    
                      {tempData.imagesUrl?.map((url,index)=>{
                        return(
                          <div className="position-relative d-inline-block mt-3" key={index}>
                              <div>
                              <input
                              id={`imageUrl-${index}`}
                                name="imageUrl"
                                type="text"
                                className="form-control"
                                placeholder="請輸入圖片連結"
                                value={url}
                                onChange={(e)=>handleImageChange(e,index)}
                                required
                                autoFocus
                                />
                            </div>

                            <img className="img-fluid rounded" src={url} alt={`圖片${index+1}`} />
                            <div>
                              <button type="button"
                              className="btn btn-outline-danger btn-sm d-block w-100"
                              onClick={()=>{
                                handleImageDelete(index);
                              }}>
                                刪除圖片
                              </button>
                            </div>
                          </div>
                        )
                      })}
                      </div>
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">標題</label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        value={tempData.title}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                        />
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">分類</label>
                        <input
                          id="category"
                          name="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={tempData.category}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                          />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">單位</label>
                        <input
                          name="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          value={tempData.unit}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                          />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">原價</label>
                        <input
                          id="origin_price"
                          name="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={tempData.origin_price}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                          />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">售價</label>
                        <input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={tempData.price}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                          />
                      </div>
                    </div>
                    <hr />

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">產品描述</label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={tempData.description}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                        ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">說明內容</label>
                      <textarea
                        id="content"
                        name="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        value={tempData.content}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                        ></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          id="is_enabled"
                          name="is_enabled"
                          className="form-check-input"
                          type="checkbox"
                          checked={tempData.is_enabled}
                      onChange={handleModalInputChange}
                      required
                      autoFocus
                          />
                        <label className="form-check-label" htmlFor="is_enabled">
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                }</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={()=>closeModal()}
                  >
                  取消
                </button>
                <button type="button" className={`btn btn-${modalType==="delete"?"danger":"primary"}`} 
                //確認按鈕會根據updateProductIdRef是否有值來判斷是要呼叫新增或更新的API
                onClick={()=>{ modalType==="delete"?deleteProduct(tempData.id):updateProduct(tempData.id); closeModal();}}
                // data-bs-dismiss="modal"
                >{modalType==="delete"?"確認刪除":"確認"}</button>
              </div>
            </div>
          </div>
      </div>
    )
}

export default ProductModal;