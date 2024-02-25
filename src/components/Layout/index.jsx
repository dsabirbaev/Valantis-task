
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


    const getID = async (offset) => {

      const requestBody = {
        action: "get_ids",
        params: {offset, limit: 50}
      };
    
      try {
        const response = await getAPI.getID(requestBody);
        const data = response?.data;   
        getData(data?.result)
    
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