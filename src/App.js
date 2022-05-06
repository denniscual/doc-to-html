import { useRef, useState, useMemo } from "react";
import mammoth from "mammoth";
import parse from "html-react-parser";

export default function App() {
  const fileInputRef = useRef(null);
  const [stringifyDocument, setStringifyDocs] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const files = fileInputRef.current.files || [];
    if (!files.length) return;

    const file = files[0];

    // Reading document file
    const reader = new FileReader();
    reader.onloadend = function () {
      const arrayBuffer = reader.result;

      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          setStringifyDocs(resultObject.value);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  const parsedDocument = useMemo(() => {
    if (stringifyDocument === "") {
      return <span>Show preview</span>;
    }
    return parse(stringifyDocument);
  }, [stringifyDocument]);

  return (
    <Stack
      gap={6}
      style={{
        minHeight: "100vh",
        alignItems: "center",
        padding: "3em",
      }}
    >
      <Stack gap={2} component="form" onSubmit={handleSubmit}>
        <Stack gap={1}>
          <label htmlFor="file-input">Choose doc/docx file</label>
          <input ref={fileInputRef} id="file-input" type="file" />
        </Stack>
        <button type="submit">Show preview</button>
      </Stack>
      <main
        style={{
          maxWidth: 800,
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow:
            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
          borderRadius: 4,
          padding: "3em 2em",
        }}
      >
        {parsedDocument}
      </main>
    </Stack>
  );
}

function Stack({
  children,
  component: Component = "div",
  gap = 1,
  direction = "column",
  style = {},
  ...props
}) {
  return (
    <Component
      style={{
        ...style,
        display: "flex",
        flexDirection: direction,
        rowGap: direction === "column" ? gap * 8 : 0,
        columnGap: direction === "row" ? gap * 8 : 0,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
