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
  min-height: 1200px;
  position: absolute;
  box-sizing: border-box;
`;

const PoemTextArea = styled(TextArea) `
  background: none;
  padding-left: 30px;
`

const NumberingArea = styled.div `
  width: 100%;
  min-height: 1200px;
  overflow-y: hidden;
  position: absolute;
  box-sizing: content-box;
  font-family: monospace;
  margin-top: 2px;
  margin-left: 3px;
`
const median = (arr:number[]):number => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const getSyllables = (text:string) =>
{
  let pattern = /[aáeéiíoóöőuúüű]/gi
  let list = text.split("\n");
  let syllables = list.map(line => line.match(pattern)?.length || 0);
  let medianLength = median(syllables.filter(s => s > 0));
  return {lines:list, syllables:syllables, medianLength:medianLength};
}

const IndexPage: React.FC<PageProps> = () => {

  const [poem, setPoem] = useState<{value:string|null, lines:string[], syllables: number[], medianLength:number}>({value: null, lines: [], syllables: [], medianLength:0});

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
        <NumberingArea>{poem.syllables.map((s, i) => poem.lines[i] == "" ? <div>&nbsp;</div> : <div style={{color: poem.syllables[i] == poem.medianLength ? "darkgrey" : "red"}}>{s}</div>)}</NumberingArea>
        <PoemTextArea value={poem.value} onChange={onChange}></PoemTextArea>
      </InputContainer>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Poem Tools</title>
