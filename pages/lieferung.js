import Link from "next/link";
import React, { useEffect, useState } from "react";
import BlogSidebar from "../components/elements/BlogSidebar";
import Layout from "../components/layout/Layout";
import { getShippingOverview } from "./../lib/getShippingOverview";


export default function Lieferung({overview}) {

    console.log("overview", overview)
    return (
        <>
            <Layout parent="Home" sub="Pages" subChild="Terms">
            <div className="page-content pt-50">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-10 col-lg-12 m-auto">
                            <div className="row">
                                <div className="col-lg-9">
                                    <div className="single-page pr-30 mb-lg-0 mb-sm-5">
                                        <div className="single-header style-2">
                                            <h1>Lieferung</h1>
                                            
                                        </div>
                                        <div className="single-content mb-50">
                                            
                                            <ol>
                                            <li>Liefergebiet</li>

                                            <p>Die Lieferung erfolgt in die ganze Schweiz und dem Fürstentum Liechtenstein.</p>
                                            
                                            <li>Lieferzeit</li>
                                            <p>Wir versenden mit der Schweizer 
                                               A-Post oder DHL von Montag bis Freitag. Die Lieferzeit beträgt 
                                               2 bis 3 Werktage innerhalb der Schweiz und dem Fürstentum 
                                               Liechtenstein.</p>

                                            <li>Versandkosten</li>
                                            <table className="table">
                                                <thead>
                                                  <tr>
                                                    <th scope="col">Gewicht</th>
                                                    <th scope="col">Versandkosten</th>
                                                    
                                                  </tr>
                                                </thead>
                                                <tbody>

                                                {overview
                                                .sort( (a,b) => a.shipping_price > b.shipping_price ? 1 : -1)
                                                .map(x =>

                                                  <tr key={x.shipping_price}>

                                                <th scope="row">{x.weight_from}kg bis {x.weight_to}kg   </th>
                                                <td>CHF {x.shipping_price}   </td>
                                                    
                                                  </tr>
                                                  )}
                                                 
                                                </tbody>
                                              </table>

                                              <li>Abholung</li>
                                              <p>Eine Abholung ist nach Vereinbarung möglich. Schreiben Sie uns dazu ein E-Mail auf info@bio-hundeshop.ch</p>

                                                </ol>

                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Layout>
        </>
    );
}

export async function getServerSideProps() {
 

  const overview = await getShippingOverview()

  return { props: { overview } }
}