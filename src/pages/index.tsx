import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { ChangeEvent } from "react"
import styled from "styled-components";
import { useState } from "react";
import {syllable} from 'syllable';

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

type Language = {code:string, name:string, matcher:(text:string)=>number};

const languages:Language[] = [
  { code: "en", name: "English", matcher:(text:string) => {
      //(?:ea)|(?:oo)|[aáeéiíoóöőuúüű]/gi
      console.log(text.split(/[^\p{L}]/gmu));
      return text.split(/[^\p{L}]/gmu)
      .map(word => syllable(word))
      .reduce((acc, curr) => acc + curr, 0)
    }
  },
  { code: "hu", name: "Hungarian", matcher:(text:string) => { 
      return text.match(/[aáeéiíoóöőuúüű]/gi)?.length || 0;
    }
  }
];

const getSyllables = (text:string, matcher:(text:string)=>number) =>
{
  let list = text.split("\n");
  let syllables = list.map(line => matcher(line));
  let modeLength = mode(syllables.filter(s => s > 0));
  return {text:text, lines:list, syllables:syllables, modeLength:modeLength};
}

const IndexPage: React.FC<PageProps> = () => {

  const [poem, setPoem] = useState<{text:string, lines:string[], syllables: number[], modeLength:number}>({text: "__UNINITED__", lines: [], syllables: [], modeLength:0});
  const [lang, setLang] = useState<Language>(languages[0]);

  if (poem.text === "__UNINITED__" && typeof window !== "undefined")
  {
    let text = window.localStorage.getItem("poem") || ""; 
    let newLang = languages[parseInt(window.localStorage.getItem("lang") || "0")];
    setPoem( getSyllables(text, newLang.matcher) );
    setLang( newLang );
  }

  const onChange = (e:ChangeEvent<HTMLTextAreaElement>) =>
  {
    let text = e.target.value;
    setPoem(getSyllables(text, lang.matcher));
    window.localStorage.setItem("poem", text);
  }
  
  const onChangeLang = (langIndex:number) =>
  {
    let newLang = languages[langIndex]; 
    setLang(newLang); 
    setPoem(getSyllables(poem.text, newLang.matcher));
    window.localStorage.setItem("lang", langIndex.toString());
  }

  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Poem Tools
      </h1>
      <select onChange={(e) => onChangeLang(parseInt(e.target.value)) }>
        {languages.map((l,i) => <option value={i} key={l.code} selected={languages[i] == lang}>{l.name}</option>)}
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
