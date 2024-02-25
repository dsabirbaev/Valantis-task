

import Header from "../Header";
import Footer from "../Footer";
import Card from "../UI/Card/Card";
import "./style.scss";
import React, { useState, useEffect } from 'react';

import md5 from 'crypto-js/md5'; // импортируем md5 из библиотеки crypto-js
import axios from 'axios';



const API_URL = 'https://api.valantis.store:41000/';

const generateAuthString = () => {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `${"Valantis"}_${timestamp}`;
};

const calculateMD5 = (str) => {
  return md5(str).toString();
};


const index = () => {

    const[datas, setDatas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const getID = async (offset) => {
  
  
      const authString = generateAuthString();
      const authHeader = { 'X-Auth': calculateMD5(authString) };
    
      const requestBody = {
        action: "get_ids",
        params: {offset, limit: 50}
    
      };
    
      try {
    
        const response = await axios.post(API_URL, requestBody, {
          headers: {
            ...authHeader,
            'Content-Type': 'application/json',
          },
        });
    
        const data = response?.data;  
        
        getData(data?.result)
    
       
      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);
      }
    };
    
    

    
    
    const getData = async (data) => {
    
     
      const authString = generateAuthString();
      const authHeader = { 'X-Auth': calculateMD5(authString) };
    
      const requestBody = {
        action: "get_items",
        params: {ids: data}
    
      };
    
      try {
        setLoading(true);
        const response = await axios.post(API_URL, requestBody, {
          headers: {
            ...authHeader,
            'Content-Type': 'application/json',
          },
        });
    
          const data = response?.data;
          setDatas(data.result);
          
          setLoading(false);
      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);
        setLoading(false);
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