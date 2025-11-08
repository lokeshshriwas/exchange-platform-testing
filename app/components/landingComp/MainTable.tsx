"use client"

import { useEffect, useState } from "react";
import MainTableHeader from "./MainTableHeader";
import Table from "./Table";
import { getTickers } from "@/app/utils/httpClient";

const MainTable = () => {  
    const [tableData, setTableData] = useState([]);

    useEffect(()=>{
        getTickers().then(data => setTableData(data.sort((a: any, b: any) => b.lastPrice - a.lastPrice) as any))
    }, [])

  return (
    <div className="flex flex-col bg-base-background-l1 flex-1 gap-3 rounded-xl p-4">
      <MainTableHeader />
      <Table tableData={tableData}/>
    </div>
  );
};

export default MainTable;
