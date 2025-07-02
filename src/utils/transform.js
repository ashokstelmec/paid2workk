import React from "react";

const transform = (node, children) => {
  const classMap = {
    h1: "text-xl text-black/80 font-bold my-1",
    h2: "text-lg text-black/80 font-semibold my-1",
    p: "text-black/75 text-sm md:text-base my-0 ",
    ol: "list-decimal text-black pl-6 my-0",
    ul: "list-disc pl-6 my-0",
    li: "marker:text-black/75 my-0",
    a: "text-blue hover:text-blue/80 underline",
  };

  const tag = node.tagName.toLowerCase();

  if (classMap[tag]) {
    return React.createElement(
      tag,
      {
        ...node.attributes,
        className: classMap[tag],
      },
      children
    );
  }

  return undefined; // Return undefined to use default handling
};

  const transform1 = (node, children) => {
  const classMap = {
    h1: "text-base text-black font-semibold my-1",
    h2: "text-base text-black font-medium my-1",
    p: "text-black text-sm my-0 w-full",
    span: "text-black my-0 w-full",
    ul: "list-disc text-black pl-6 space-y-1 text-sm m-0 mt-1",
    ol: "list-decimal text-black pl-6 space-y-1 text-sm m-0 mt-1", // ✅ added ordered list styling
    li: "marker:text-black text-black text-sm my-0",
    a: "text-blue hover:text-blue/80 underline",
  };

  const tag = node.tagName?.toLowerCase();

  if (classMap[tag]) {
    return React.createElement(
      tag,
      {
        ...node.attributes,
        className: classMap[tag],
      },
      children
    );
  }

  return undefined; // Let Interweave handle tags not in classMap
};

export { transform1 };
export default transform;
