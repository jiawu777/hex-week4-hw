import React from "react";
import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
const { useState, useEffect, useRef } = React;
const{VITE_API_BASE, VITE_API_PATH}=import.meta.env

const API_BASE = VITE_API_BASE;
const API_PATH = VITE_API_PATH; 

function App() {
  const defaultImageUrl="https://storage.googleapis.com/vue-course-api.appspot.com/jia-hex/1770819402945.jpg";
  const INITIAL_PRODUCT_DATA = { 
      "name": "",
      "title": "",
      "category": "",
      "origin_price": 0,
      "price": 0,
      "unit": "",
      "description": "",
      "content": "",
      "is_enabled": 0,
      "imageUrl": "",
      "imagesUrl": []}
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);
  const [products,setProducts] = useState([]);
  const [templateProduct,setTemplateProduct] = useState(INITIAL_PRODUCT_DATA);
  const productModalRef = useRef(null);
  const [modalType,setModalType] = useState("");
  const [productData,setProductData] = useState({});
  


  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (err) {
      console.log(err.response.data.message);
  }}

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateProduct((prevData) => ({
      ...prevData,
      //id需判別為Number、checkbox或文字，以符合API需求
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
    } catch (err) {
      alert("登入失敗: " + err.response.data.message);
    }
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
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
      }
    }

    try{
      await axios[method](url,productData);
      if(modalType==="create"){
        alert("新增成功");
      }else{
        alert("更新成功");
      }
      await getProducts();
    }catch(err){
      console.log(err.response.data.message);
    }
  }

  const deleteProduct = async(id)=>{
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      alert("刪除成功");
      await getProducts();
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  const handleImageCreate=()=>{
    const newImagesUrl = [...templateProduct.imagesUrl];
    newImagesUrl.unshift(templateProduct.imageUrl);
    setTemplateProduct({...templateProduct, imagesUrl: newImagesUrl, imageUrl: ""})
  }

  const handleImageChange=(e,index)=>{
      const newImagesUrl = [...templateProduct.imagesUrl];
      newImagesUrl[index]=e.target.value;
      setTemplateProduct({...templateProduct, imagesUrl: newImagesUrl});
  }

  const handleImageDelete=(index)=>{
    const newImagesUrl = [...templateProduct.imagesUrl];
    newImagesUrl.splice(index,1);
    setTemplateProduct({...templateProduct, imagesUrl: newImagesUrl});
  }

  const openModal = (type,product) => {
    setTemplateProduct((pre)=>({...pre,...product}));
    setModalType(type);
    productModalRef.current.show();
  }

  const closeModal = () => {
      productModalRef.current.hide();
    }


useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    });
    
  //   document.querySelector('#productModal').addEventListener('hidden.bs.modal', function () {
  //    if(document.activeElement instanceof HTMLElement){
  //     document.activeElement.blur();
  //    }
  //   }
  // )
    checkAdmin();
    
  }, []);

  useEffect(()=>{
    (async()=>{
      //只有在驗證過才會取得產品列表
      if(isAuth){await getProducts();}
    })()
  },[isAuth])

  

  return (
    <>
      {isAuth ? (
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
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="username"
                    id="email"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                    />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                  >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
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
                  // data-bs-dismiss="modal"
                  onClick={()=>closeModal()}
                  aria-label="Close"
                  ></button>
              </div>
              <div className="modal-body">
                {modalType==="delete"? (
                    <p className="fs-4">
                      確定要刪除
                      <span className="text-danger">{templateProduct.title}</span>嗎？
                    </p>
                        ):
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
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
                          value=""
                          required
                          autoFocus
                          />
                      </div>
                        <img className="img-fluid rounded" src={templateProduct.imageUrl || defaultImageUrl} alt="無法取得商品圖片" />
                    </div>
                  
                    <div>
                      <button className="btn btn-outline-primary btn-sm d-block w-100" 
                      onClick={()=>{
                        handleImageCreate()
                      }}>
                        新增圖片
                      </button>
                    </div>
                      {templateProduct.imagesUrl?.map((url,index)=>{
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
                        value={templateProduct.title}
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
                          value={templateProduct.category}
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
                          value={templateProduct.unit}
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
                          value={templateProduct.origin_price}
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
                          value={templateProduct.price}
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
                        value={templateProduct.description}
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
                        value={templateProduct.content}
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
                          checked={templateProduct.is_enabled}
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
                  // data-bs-dismiss="modal"
                  onClick={()=>closeModal()}
                  >
                  取消
                </button>
                <button type="button" className={`btn btn-${modalType==="delete"?"danger":"primary"}`} 
                //確認按鈕會根據updateProductIdRef是否有值來判斷是要呼叫新增或更新的API
                onClick={()=>{ modalType==="delete"?deleteProduct(templateProduct.id):updateProduct(templateProduct.id); closeModal();}}
                // data-bs-dismiss="modal"
                >{modalType==="delete"?"確認刪除":"確認"}</button>
              </div>
            </div>
          </div>
       
      </div>
    </>
  );
}

export default App


