import React from "react";

function Textfield({ type, labelText, placeholder, data, setData }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-white text-sm">
        {labelText}
      </label>

      {type === "textarea" ? (
        /* If type is "textarea", render the large box */
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={placeholder || "Enter Text"}
          rows={4}
          className="
            border
            rounded
            px-3
            py-2
            text-white
            bg-transparent
            outline-none
            resize-y
            min-h-[120px]  /* Gives it that larger starting height */
          "
        />
      ) : (
        /* For any other type (email, text, password), render a regular input */
        <input
          type={type}
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={placeholder || "Enter Text"}
          className="
            border
            rounded
            px-3
            py-2
            text-white
            bg-transparent
            outline-none
          "
        />
      )}
    </div>
  );
}

export default Textfield;