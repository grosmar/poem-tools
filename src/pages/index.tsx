import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { ChangeEvent } from "react"
import styled from "styled-components";
import { useState } from "react";

const pageStyles =  {
  color: "#232129",
  paddingTop: "1rem",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  maxWidth: "1000px",
  margin: "auto"
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 10,
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
  overflow-x: scroll;
  white-space: nowrap;
  font-size: 11px;
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
  font-size: 11px;
`;

function mode(arr:number[]){
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop() || 0;
}

type Language = {code:string, name:string, pattern:RegExp};

const languages:Language[] = [
  { code: "en", name: "English", pattern: /(?:ea)|(?:oo)|[aáeéiíoóöőuúüű]/gi},
  { code: "hu", name: "Hungarian", pattern: /[aáeéiíoóöőuúüű]/gi}
];

const getSyllables = (text:string, pattern:RegExp) =>
{
  let list = text.split("\n");
  let syllables = list.map(line => line.match(pattern)?.length || 0);
  let modeLength = mode(syllables.filter(s => s > 0));
  return {text:text, lines:list, syllables:syllables, modeLength:modeLength};
}

const IndexPage: React.FC<PageProps> = () => {

  const [poem, setPoem] = useState<{text:string, lines:string[], syllables: number[], modeLength:number}>({text: "__UNINITED__", lines: [], syllables: [], modeLength:0});
  const [lang, setLang] = useState<Language>(languages[0]);

  if (poem.text === "__UNINITED__" && typeof window !== "undefined")
  {
    let text = window.localStorage.getItem("poem") || ""; 
    setPoem( getSyllables(text, lang.pattern) );
    setLang( languages[parseInt(window.localStorage.getItem("lang") || "0")] );
  }

  const onChange = (e:ChangeEvent<HTMLTextAreaElement>) =>
  {
    let text = e.target.value;
    setPoem(getSyllables(text, lang.pattern));
    window.localStorage.setItem("poem", text);
  }
  
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Poem Tools
      </h1>
      <select onChange={(e) => { let newLang = languages[parseInt(e.target.value)]; setLang(newLang); setPoem(getSyllables(poem.text, newLang.pattern));} }>
        {languages.map((l,i) => <option value={i} key={l.code}>{l.name}</option>)}
      </select>
      <InputContainer>
        <NumberingArea>{poem.syllables.map((s, i) => poem.lines[i] == "" ? <div>&nbsp;</div> : <div style={{color: poem.syllables[i] == poem.modeLength ? "darkgrey" : "red"}}>{s}</div>)}</NumberingArea>
        <PoemTextArea value={poem.text} onChange={onChange}></PoemTextArea>
      </InputContainer>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Poem Tools</title>
