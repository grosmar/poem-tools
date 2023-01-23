import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { ChangeEvent } from "react"
import styled from "styled-components";
import { useState } from "react";

const pageStyles =  {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}
const InputContainer = styled.div `
  position: relative;
  width: 100%;
`;

const TextArea = styled.textarea `
  width: 100%;
  min-height: 200px;
  position: absolute;
`;

const PoemTextArea = styled(TextArea) `
  background: none;
`

const NumberingTextArea = styled(TextArea) `
  text-align: right;
`

const getSyllables = (text:string) =>
{
  let pattern = /[aáeéiíoóöőuúüű]/gi
  let list = text.split("\n");
  return {lines:list, syllables:list.map(line => line.match(pattern)?.length || 0)};
}

const IndexPage: React.FC<PageProps> = () => {

  const [poem, setPoem] = useState<{value:string|null, lines:string[], syllables: number[]}>({value: null, lines: [], syllables: []});

  if (poem.value === null && typeof window !== "undefined")
  {
    let text = window.localStorage.getItem("poem") || ""; 
    setPoem( {value:text, ...getSyllables(text)} );
  }

  const onChange = (e:ChangeEvent<HTMLTextAreaElement>) =>
  {
    let text = e.target.value;
    console.log(getSyllables(text));
    setPoem({value: text, ...getSyllables(text)});
    window.localStorage.setItem("poem", text);
  }
  console.log(poem.syllables.map((s, i) => poem.lines[i] == "" ? s : s).join("\n"));
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Poem Tools
      </h1>
      <InputContainer>
        <NumberingTextArea value={poem.syllables.map((s, i) => poem.lines[i] == "" ? s : s).join("\n")} readOnly></NumberingTextArea>
        <PoemTextArea value={poem.value} onChange={onChange}></PoemTextArea>
      </InputContainer>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
