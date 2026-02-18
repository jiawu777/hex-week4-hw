import React from "react";
import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
const { useState, useEffect, useRef } = React;
const{VITE_API_BASE, VITE_API_PATH}=import.meta.env

const API_BASE = VITE_API_BASE;
const API_PATH = VITE_API_PATH; 

import Products from "./views/Products.jsx";
import Login from "./views/Login.jsx";
import ProductModal from "./components/ProductModal.jsx";
import Pagination from "./components/Pagination.jsx";

function App() {
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

  const [isAuth, setIsAuth] = useState(false);
  const [products,setProducts] = useState([]);
  const [pagination,setPagination] = useState({});
  const [templateProduct,setTemplateProduct] = useState(INITIAL_PRODUCT_DATA);
  const productModalRef = useRef(null);
  const [modalType,setModalType] = useState("");
  
  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getProducts = async (page=1) => {
    try {
      //改url取頁碼，預設為1
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      console.log(err.response.data.message);
  }}

  const openModal = (type,product) => {
    setTemplateProduct((pre)=>({...pre,...product}));
    setModalType(type);
    productModalRef.current.show();
  }

  const closeModal = () => {
      productModalRef.current.hide();
  }

  const handleFileChange=async(e)=>{
    const url = `${API_BASE}/api/${API_PATH}/admin/upload`
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append('file-to-upload', file);
    try {
      const response = await axios.post(url, formData);
      const imageUrl = response.data.imageUrl;
      setTemplateProduct((pre)=>({...pre,imageUrl}));
    } catch (error) {
      console.log(error.response.data);
    }finally{
      //清空input的值，讓使用者可以上傳同一張圖片
      e.target.value="";
    }
    
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
    checkAdmin();
  }, []);

  return (
    <>
      {isAuth ? (
     <Products 
     openModal={openModal} 
     INITIAL_PRODUCT_DATA={INITIAL_PRODUCT_DATA} 
     products={products}
     getProducts={getProducts}
     isAuth={isAuth}/>
      ) : (
       <Login setIsAuth={setIsAuth} API_BASE={API_BASE} />
      )}
     <ProductModal 
     API_BASE={API_BASE} 
     API_PATH={API_PATH} 
     modalType={modalType} 
     templateProduct={templateProduct} 
     setTemplateProduct={setTemplateProduct} 
     closeModal={closeModal}
     getProducts={getProducts}
     handleFileChange={handleFileChange}
     productModalRef={productModalRef}
     />
     <Pagination 
     pagination={pagination}
     setPagination={setPagination}
     changePage={getProducts}/>
    </>
  );
}

export default App


