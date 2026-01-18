import React from "react";

export default function PageHeader({ title, desc }) {
  return (
    <>
      <h1 className="text-5xl text-black font-bold mb-10 ">{title}</h1>
      <p className="text-muted-foreground text-xl mb-12 ">{desc} </p>
    </>
  );
}
