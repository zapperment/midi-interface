export default (bytes) =>


    bytes.reduce((acc, curr) => `${acc}${curr.toString(16).padStart(2, "0")}`, ""
    );
