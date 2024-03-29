
import React, { useState, useEffect } from 'react';
import Header from "../Header";
import Footer from "../Footer";
import Card from "../UI/Card/Card";
import "./style.scss";

import getAPI from "../../service/post";



const index = () => {

    const[datas, setDatas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [brand, setBrand] = useState([]);
    const [price, setPrice] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('Brands'); 
    const [selectedPrice, setSelectedPrice] = useState('Prices'); 

    const getID = async (offset) => {

      const requestBody = {
        action: "get_ids",
        params: {offset, limit: 50}
      };
    
      try {
        const response = await getAPI.getID(requestBody);
        const data = response?.data;   
        const res = new Set(data?.result);
        const resArray = Array.from(res);
        getData(resArray)
        
      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);
      }
    };
    

    const getData = async (data) => {
        
      const requestBody = {
        action: "get_items",
        params: {ids: data}
    
      };
    
      try {
          setLoading(true);
          const response = await getAPI.getData(requestBody);
          const data = response?.data;
          setDatas(data.result);
          
          setLoading(false);
      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);
        setLoading(false);
      }
    };


    const getFields = async (fieldType) => {
        
      const requestBody = {
        action: "get_fields",
        params: {field: fieldType}
    
      };
    
      try {
          
          const response = await getAPI.getField(requestBody);
          const data = response?.data;

          if (fieldType === "brand") {
            const filterData = new Set(data?.result);
            const filterDatatoArr = Array.from(filterData);
            setBrand(filterDatatoArr);
          } else if (fieldType === "price") {
            const filterData = new Set(data?.result);
            const filterDatatoArr = Array.from(filterData);
            setPrice(filterDatatoArr);
          }
          
      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);
       
      }
    };


    const getFilterBrand = async (data) => {

      
      const requestBody = {
        action: "filter",
        params: { brand: data === "No brand" ? null : data }
      };
      setSelectedBrand(data) 
      
     
      try {
          
          const response = await getAPI.getFilter(requestBody);
          const data = response?.data;
          getData(data?.result);
          
      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);
        
      }
    };



    const getFilterPrice = async (data) => {

      const requestBody = {
        action: "filter",
        params: { price: Number(data) }
      };
      setSelectedPrice(data) 
      
      try {
          const response = await getAPI.getFilter(requestBody);
          const data = response?.data;
          getData(data?.result);
          
      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);  
      }

    };


    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };



  
    useEffect(() => {
        const fetchData = async () => {
           await getID((currentPage - 1) * 50 + 1);
          };
      
          fetchData();
          getFields("brand");
          getFields("price");
    }, [currentPage]);

  return (
    <>
        <Header/>
        <main className="main">
            <section>
                <div className="container">
                  {
                    loading ? (
                      <p className="loader-wrapper">
                        <span className="loader"></span>
                      </p>
                    ): (
                      <div>  
                            <div className='brand'>
                              <select name="price" id="price" className='brand-select' onChange={(e) => getFilterPrice(e.target.value)} >
                                <option value="Prices">{selectedPrice}</option>
                                {
                                  price?.sort((a, b) => a - b).map((item, index) => (
                                    <option  value={item} key={index}>{item}</option>
                                  ))
                                }
          
                              </select>

                              <select name="brand" id="brand" className='brand-select' onChange={(e) => getFilterBrand(e.target.value)}>
                                <option value="Brands">{selectedBrand}</option>
                                {
                                  brand?.map((item, index) => (
                                    <option  value={item} key={index}>{item == null ? "No brand" : item}</option>
                                  ))
                                }
          
                              </select>
                            </div>

                            <div className="card-wrapper">
                                {datas.map((item, index) => (
                                    <Card key={index} data={item}/>
                                ))}
                            </div>


                            <div className="pagination">
                              <div className="pagination-inner">
                                <button className="pagination-prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                  </button>
                                  <span className="pagination-numb">{currentPage}</span>
                                  <button className="pagination-next" onClick={() => handlePageChange(currentPage + 1)}>
                                    Next
                                  </button>
                              </div>
                            </div>

                      </div>
                    )
                  }
                  
                </div>
            </section>
        </main>
        <Footer/>
    </>
  )
}

export default index