import React from "react";

export default function DisplaySourceDataSet({ title, data }: { data: any; title: string }) {
  return (
    <div className="column gap">
      <b>{title}</b>
      <ul>
        {data?.map((el: any) => {
          return <li key={el.id}> {el?.val} </li>;
        })}
      </ul>
    </div>
  );
}
